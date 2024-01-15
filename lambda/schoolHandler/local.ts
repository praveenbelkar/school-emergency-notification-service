//import your handler file or main file of Lambda
import { handler } from './index.js';
import { readFile } from 'fs/promises';
import * as singleSchoolEvent from './tests/events/single_school_event.json';
import * as allSchoolMetadataEvent from './tests/events/all_school_metadata_event.json';

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
    let testJson = singleSchoolEvent;
    //let testJson = allSchoolMetadataEvent;

    let response = await handler( testJson, context );
    return response;
}

//exports.handler =
(async () => {
    const response = await main();
    console.log('Response from local.js: \n' + JSON.stringify(response, null, 2));
        })();

//console.log()
//console.log(response);
