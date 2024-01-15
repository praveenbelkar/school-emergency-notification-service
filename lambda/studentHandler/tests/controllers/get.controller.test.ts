import { GetController } from "../../src/controllers/get.controller.js";
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import * as singleSchoolEvent from '../events/single_school_event.json';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StudentService } from "../../src/services/student.service.js";


describe('Get Controller', () => {

    it('should return school detail for given school code', async () => {
        singleSchoolEvent.headers['X-System-ID'] = process.env.DCU_SYSTEM_ID || 'sct_dev';
        console.log('Header value X-System-ID ' + process.env.DCU_SYSTEM_ID);

        const studentService: StudentService = new StudentService();

        jest.spyOn(studentService, "getBySchoolCode")
            .mockImplementation(() => new Promise((resolve, reject) => resolve(mockResponse())));

        const getController: GetController = new GetController(studentService);
        let schoolCode = '8432';

        const result: APIGatewayProxyResult = await getController.handleGet(singleSchoolEvent as unknown as APIGatewayProxyEvent);
                expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body).Students.length).toEqual(1);
        expect(JSON.parse(result.body).Students[0].Carers.length).toEqual(2);
    });

    it('when the header X-System-ID is not present it should return error', async () => {
        singleSchoolEvent.headers['X-System-ID'] = '';
        let schoolCode = '8432';
        const studentService: StudentService = new StudentService();
        const getController: GetController = new GetController(studentService);

        const result = await getController.handleGet(singleSchoolEvent as unknown as APIGatewayProxyEvent);
        
        expect(result.statusCode).toEqual(400);
    });

    it('when the scholosticYear paramter passes invalid values it should return error', async () => {
        singleSchoolEvent.queryStringParameters['scholasticYear'] = '13';
        let schoolCode = '8432';
        const studentService: StudentService = new StudentService();
        const getController: GetController = new GetController(studentService);

        const result = await getController.handleGet(singleSchoolEvent as unknown as APIGatewayProxyEvent);
        
        expect(result.statusCode).toEqual(400);
    });

});


const mockResponse = () => {

    return `
    {
        "Students": [
            {
                "SchoolCode": "8911",
                "StudentRegistrationNumber": "445425303",
                "StudentScholasticYear": {
                    "Code": null,
                    "Name": null
                },
                "StudentActiveIndicator": {
                    "Code": "A",
                    "Description": "Active"
                },
                "Registration": {
                    "Code": "ENRCON",
                    "Name": "Enrolled (In Attendance)"
                },
                "Carers": [
                    {
                        "ContactPreferredSequenceType": "1",
                        "FullName": null,
                        "Contacts": [
                            {
                                "Type": "mobile",
                                "Value": "100001"
                            },
                            {
                                "Type": "email",
                                "Value": "test1@test.test.com"
                            }
                        ],
                        "CustodyInd": "Y",
                        "CourtOrderInd": null,
                        "Relationship": {
                            "Code": "01",
                            "Name": "MUM"
                        },
                        "IsAlive": "Y",
                        "InterventionOrder": "N",
                        "InterpreterRequired": "N",
                        "EnglishAtHome": null,
                        "RecordNumber": "716018835",
                        "Suburb": "THE PONDS",
                        "AvoInd": null,
                        "Postcode": "2769",
                        "OtherCourtOrderNonAVO": "N"
                    },
                    {
                        "ContactPreferredSequenceType": "2",
                        "FullName": null,
                        "Contacts": [
                            {
                                "Type": "mobile",
                                "Value": "100001"
                            },
                            {
                                "Type": "email",
                                "Value": "test1@test.test.com"
                            }
                        ],
                        "CustodyInd": "Y",
                        "CourtOrderInd": null,
                        "Relationship": {
                            "Code": "01",
                            "Name": "DAD"
                        },
                        "IsAlive": "Y",
                        "InterventionOrder": "N",
                        "InterpreterRequired": "X",
                        "EnglishAtHome": null,
                        "RecordNumber": "716018835",
                        "Suburb": "THE PONDS",
                        "AvoInd": null,
                        "Postcode": "2769",
                        "OtherCourtOrderNonAVO": "N"
                    }
                ]
            }
        ]
    }
    `;
}