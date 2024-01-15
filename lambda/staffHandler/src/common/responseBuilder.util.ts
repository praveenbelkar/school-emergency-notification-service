import { Tracer } from '@aws-lambda-powertools/tracer';
const uuid = require('uuid');
const tracer = new Tracer();

const buildSuccessResponse = (responseBody: any, statusCode: number): any =>  {
    return {
        statusCode: statusCode || 200,
        body: responseBody,
        headers: buildResponseHeaders()
    }
}

const buildResponseHeaders = (): any => {
    return {
        'content-type': "application/json",
        '_X_AMZN_TRACE_ID': `${tracer.getRootXrayTraceId()}`
        };
}

const buildErrorResponse = (error: any): any => {
    let errorResponse = {
        statusCode: error?.statusCode || 500,
        body: buildErrorResponseBody(error),
        headers: buildResponseHeaders()
    }

    return errorResponse;
}

const buildErrorResponseBody = (error: any): any => {
    const id = uuid.v4();
    return {
            CorrelationId: id, //TODO - get it from x-correlation-id or generate random id
            Detail: error?.detail || 'Internal Service Error',
            Date: new Date().toISOString(), //TODO generate todays date
            Id: id //TODO
           };
}

export { buildSuccessResponse, buildResponseHeaders, buildErrorResponse, buildErrorResponseBody };