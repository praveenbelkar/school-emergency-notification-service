import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from 'aws-lambda';
import { GetController } from "./src/controllers/get.controller.js";
import { Utils } from "./src/common/utils.js"
import { Container } from 'typedi';
import { createLogger, getLogger, LogLevel } from 'logging';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { loadSecrets } from './src/services/secrets';

const tracer = new Tracer();

export const handler = async (event: APIGatewayProxyEvent | null, context: Context): Promise<APIGatewayProxyResult> => {
    await createLogger({
                 Header: {
                     Environment: process.env.env,
                     RequestId: context.awsRequestId,
                     TrackingId: context.awsRequestId,
                     XrayTraceId: process.env._X_AMZN_TRACE_ID,
                     SystemName: process.env.SystemName,
                     ComponentName: process.env.ComponentName          },
               });
    await loadSecrets();
    const logger = Utils.createLogger();
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
        const getController = Container.get(GetController);
        let response = await getController.handleGet(event);
        console.log("index.js response got from controller: " + JSON.stringify(response, null, 2));
        response.body = JSON.stringify(response.body);
        //logger.debug("index.js response after stringify: " + JSON.stringify(response, null, 2));
        return response;
    } finally {
         // Close subsegments (the Lambda one is closed automatically)
         subsegment.close(); // (### MySubSegment)
         handlerSegment.close(); // (## index.lambdaHandler)

         // Set the facade segment as active again (the one created by Lambda)
         tracer.setSegment(segment);
    }
}