import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from 'aws-lambda';
import * as dotenv from 'dotenv';
dotenv.config();
import { GetController } from './src/controllers/get.controller.js';
const { dbInit } = require("staff-service-db-node-modules");
const { options } = require("./src/config/sequelize-options.js");

import { createLogger, getLogger, LogLevel } from 'logging';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { StaffPersonalGetService } from 'staffpersonalshandler';
import { IdmService } from './src/services/idm.service.js';
import { StaffService } from './src/services/staff.service.js';
import { loadSecrets } from './src/services/secrets';

const tracer = new Tracer();
let sequelize: any;

const initSequelize = async (context: Context) => {
    await createLogger({
                 Header: {
                     Environment: process.env.env || 'dev',
                     RequestId: context.awsRequestId || 'fsdf',
                     TrackingId: context.awsRequestId || 'fsdf',
                     XrayTraceId: process.env._X_AMZN_TRACE_ID,
                     SystemName: process.env.SystemName || 'SchoolCommsAdapter',
                     ComponentName: process.env.ComponentName || 'StaffHandler'   },
               });
    await loadSecrets();
    const logger = getLogger();
    logger.debug('logger received');
    if (!sequelize) {
        try {
          sequelize = await dbInit(options);
        } catch (error) {
          logger.error("DB Init Error " + error);
          return;
          //return responseBuilder.buildErrorResponse(error, requestId, requestAction, event.path);
        }
    } else {
        try {
          // restart connection pool to ensure connections are not re-used across invocations
          sequelize.connectionManager.initPools();

          // restore `getConnection()` if it has been overwritten by `close()`
          if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
            delete sequelize.connectionManager.getConnection;
          }
        } catch (error) {
          logger.error("DB Error" + error);
          //return responseBuilder.buildErrorResponse(error, requestId, requestAction, event.path);
        }
    }
}

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    await initSequelize(context);

    const logger = getLogger();
    logger.debug('entering handler');
    // Get facade segment created by Lambda
    const segment = tracer.getSegment();
    if (!segment) {
        return {
            statusCode: 500,
            body: `An error has occurred while processing your request. Please try again or contact support if issue remains ${tracer.getRootXrayTraceId()}`,
            headers: {'_X_AMZN_TRACE_ID': `${tracer.getRootXrayTraceId()}`}
        };
    }

    // Create subsegment for the function and set it as active
    const handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);
    tracer.setSegment(handlerSegment);

    // Annotate the subsegment with the cold start and serviceName
    tracer.annotateColdStart();
    tracer.addServiceNameAnnotation();

    // Add annotation for the awsRequestId
    tracer.putAnnotation('awsRequestId', event.requestContext.requestId);

    // Create another subsegment and set it as active
    const subsegment = handlerSegment.addNewSubsegment('### processRequest');
    tracer.setSegment(subsegment);

    try {
        //const getController = Container.get(GetController);
        let staffPersonalGetService: InstanceType<typeof StaffPersonalGetService> = new StaffPersonalGetService();
        let idmService: IdmService = new IdmService();

        const staffService: StaffService = new StaffService(staffPersonalGetService, idmService);        
        const getController: GetController = new GetController(staffService);
        let response = await getController.handleGet(event);
        logger.debug("index.js response got from controller: " + JSON.stringify(response, null, 2));
        response.body = JSON.stringify(response.body);
        return response;
    } finally {
         // Close subsegments (the Lambda one is closed automatically)
         subsegment.close(); // (### MySubSegment)
         handlerSegment.close(); // (## index.lambdaHandler)

         // Set the facade segment as active again (the one created by Lambda)
         tracer.setSegment(segment);
    }
}