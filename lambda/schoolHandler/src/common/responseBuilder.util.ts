import { Service } from 'typedi';
import { Tracer } from '@aws-lambda-powertools/tracer';
const uuid = require('uuid');
const tracer = new Tracer();

@Service({ id: 'responseBuilder' })
class ResponseBuilder {

    buildSuccessResponse(responseBody: any, statusCode: number): any {
        return {
            statusCode: statusCode || 200,
            body: responseBody,
            headers: this.buildResponseHeaders()
        }
    }

    buildResponseHeaders(): any {
        return {
            'content-type': "application/json",
            '_X_AMZN_TRACE_ID': `${tracer.getRootXrayTraceId()}`
            };
    }

   buildErrorResponse(error): any {
        let errorResponse = {
            statusCode: error?.statusCode || 500,
            body: this.buildErrorResponseBody(error),
            headers: this.buildResponseHeaders()
        }

        return errorResponse;
    }

    buildErrorResponseBody(error): any {
        const id = uuid.v4();
        return {
                CorrelationId: id, //TODO - get it from x-correlation-id or generate random id
                Detail: error?.detail || 'Internal Service Error',
                Date: new Date().toISOString(), //TODO generate todays date
                Id: id //TODO
               };
    }


}

export { ResponseBuilder };