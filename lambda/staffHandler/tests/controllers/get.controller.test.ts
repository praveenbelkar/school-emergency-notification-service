import { GetController } from "../../src/controllers/get.controller.js";
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import * as singleSchoolEvent from '../events/single_school_event.json';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StaffService } from '../../src/services/staff.service.js';
import { StaffPersonalGetService } from 'staffpersonalshandler';
import { IdmService } from '../../src/services/idm.service.js';


describe('Get Controller', () => {

    it('should return school detail for given school code', async () => {
        singleSchoolEvent.headers['X-System-ID'] = process.env.DCU_SYSTEM_ID || 'sct_dev';
        console.log('Header value X-System-ID ' + process.env.DCU_SYSTEM_ID);

        let staffPersonalGetService: InstanceType<typeof StaffPersonalGetService> = new StaffPersonalGetService();
        let idmService: IdmService = new IdmService();
        jest.spyOn(idmService, "getIdmData")
            .mockImplementation(() => {
                let mockedMap: Map<string, string> = new Map<string, string>();
                mockedMap.set('tom.holland', '0456456456');
                return Promise.resolve(mockedMap);
            });
        const staffService: StaffService = new StaffService(staffPersonalGetService, idmService);

        jest.spyOn(staffService, "getStaffsBySchoolCode")
            .mockImplementation(() => new Promise((resolve, reject) => resolve(mockResponse())));

        const getController: GetController = new GetController(staffService);
        let schoolCode = '8432';

        const result: APIGatewayProxyResult = await getController.handleGet(singleSchoolEvent as unknown as APIGatewayProxyEvent);
        console.log(JSON.stringify(result, null, 2));
        expect(result.statusCode).toEqual(200);
        console.log('&*&*& ' + JSON.stringify(result));
        expect(JSON.parse(result.body).Staffs.length).toEqual(1);
        expect(JSON.parse(result.body).Staffs[0].StaffGivenName).toEqual('Joe');
    });

    it('when the header X-System-ID is not present it should return error', async () => {
        singleSchoolEvent.headers['X-System-ID'] = '';
        let schoolCode = '8432';
        let staffPersonalGetService: InstanceType<typeof StaffPersonalGetService> = new StaffPersonalGetService();
        let idmService: IdmService = new IdmService();
        const staffService: StaffService = new StaffService(staffPersonalGetService, idmService);
        const getController: GetController = new GetController(staffService);

        const result = await getController.handleGet(singleSchoolEvent as unknown as APIGatewayProxyEvent);
        
        expect(result.statusCode).toEqual(400);
        console.log(JSON.stringify(result, null, 2));
    });

});


const mockResponse = () => {

    return `
    {
        "Staffs": [
          {
            "StaffTitleTypeCode": "Mr",
            "StaffGivenName": "Joe",
            "StaffFamilyName": "Blog",
            "StaffDoEEmailAddress": "joe.blog12@det.nsw.edu.au",
            "StaffDoEUserIdentifier": "joe.blog12",
            "StaffPhoneNumber": "98077445",
            "StaffMobileNumber": "0412345689",
            "StaffPositionName": "C'Room Teacher SBR",
            "StaffIdentifier": "9721608806279",
            "EmploymentStatus": "Ongoing"
          }
        ]
      }
    `;
}