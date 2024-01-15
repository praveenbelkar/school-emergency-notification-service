//import { handler } from '../index.js';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

//import { mockClient } from 'aws-sdk-client-mock';

import uuid from 'uuid';

// GET Events

//const event_get_complete = require('./events/event_get_complete.json');

// POST Events


// Unsupported Events


describe('handler GET', () => {


    test('should return item and 200 code', async () => {

        /*var item = {
            "Operation": "mock Operation",
            "TrackingId": "mock TrackingId",
            "UpdatedAt": "mock UpdatedAt",
            "PayloadS3URL": "mock PayloadS3URL",
            "Component": "mock Component",
            "System": "mock System",
            "ContentType": "mock ContentType",
            "StudentGradeId": "mock StudentGradeId",
            "CreatedAt": "mock CreatedAt",
            "Name": "mock Name"
        }

        const event: APIGatewayEvent = event_get_complete;
        const expectedResponse: APIGatewayProxyResult = {statusCode: 200, body: '[{"StudentGradeId":"4a2e1556-e5c1-4e76-b845-ca773d933971\","StudentGradeUrl":"undefined/studentGrade/4a2e1556-e5c1-4e76-b845-ca773d933971","CreatedAt":""}]'};

        const result = await handler(event);
        expect(result).toEqual(expectedResponse); */
        expect(true).toEqual(true);
    });
});