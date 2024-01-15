//import your handler file or main file of Lambda
import { handler } from './index.js';
import { readFile } from 'fs/promises';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from 'aws-lambda';
import * as singleSchoolEvent from '../tests/events/single_school_event.json'

async function main() {
    let context = {
                      "callbackWaitsForEmptyEventLoop": true,
                      "logGroupName": "/aws/lambda/lambda-name",
                      "logStreamName": "2018/11/29/[$LATEST]xxxxxxxxxxxb",
                      "functionName": "lambda-name",
                      "memoryLimitInMB": "1024",
                      "functionVersion": "$LATEST",
                      "invokeid": "xxxxx-xxx-11e8-xxx-xxxxxxxf9",
                      "awsRequestId": "xxxxxx-xxxxx-11e8-xxxx-xxxxxxxxx",
                      "invokedFunctionArn": "arn:aws:lambda:us-east-1:xxxxxxxx:function:lambda-name",
                      "getRemainingTimeInMillis": () => { return 15; },
                      "done": () => {},
                      "fail": () => {},
                      "succeed": () => {}
                  };
    let testJson: APIGatewayProxyEvent & { rawHeaders: {} };
    testJson = JSON.parse(JSON.stringify(singleSchoolEvent));
    //testJson = singleSchoolEvent;
    //let testJson = allSchoolMetadataEvent;

    let response = await handler( testJson, context as Context);
    return response;
}

(async () => {
    const response = await main();
    console.log('Response from local.js: \n' + JSON.stringify(JSON.parse(response.body), null, 2));
        })();

