import 'reflect-metadata';
import { SchoolService } from "../src/services/school.service.js";
import { GetController } from "../src/controllers/get.controller.js";
import { Utils } from "../src/common/utils.js";
import { Container } from 'typedi';
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import { when } from 'jest-when';
import * as singleSchoolEvent from '../tests/events/single_school_event.json';
import * as logging from 'logging';
describe('Get Controller', () => {

    let getController:GetController = null;
    let schoolService:SchoolService = new SchoolService(null);
    let schoolService_getSingleSchool = null;

    beforeEach(() => {
      schoolService_getSingleSchool = jest.spyOn(schoolService, "getSingleSchool");
      Container.set("school.service", schoolService);
      getController = Container.get(GetController);

    // Mock the logger
      Utils.createLogger = jest.fn().mockReturnValue({
                                 debug: jest.fn(),
                                 info: jest.fn(),
                                 warn: jest.fn(),
                                 error: jest.fn()
                               });
    });

    afterEach(() => {
          Container.reset();
    });

    it('should return school detail for given school code', async () => {
        singleSchoolEvent.headers['X-System-ID'] =  process.env.DCU_SYSTEM_ID;
        console.log('Header value X-System-ID ' + process.env.DCU_SYSTEM_ID);
        when(schoolService_getSingleSchool)
        .calledWith(expect.anything())
        .mockImplementation(async (schoolCode: string) => {
                         return new Promise((resolve, reject) => {
                             resolve(
                                {
                                    "SchoolCode": "8432",
                                    "SchoolFullName": "Engadine High School",
                                    "SchoolPreschoolIndicator": "N",
                                    "SchoolLevelSubtypeCode": "17",
                                    "SchoolLevelSubtypeName": "Secondary 7-12",
                                    "SchoolPhoneNumber": "9520 0411",
                                    "SchoolEmailAddress": "engadine-h.school@det.nsw.edu.au",
                                    "SchoolSuburbName": null,
                                    "SchoolPrincipalName": "Ms Kerrie Jones",
                                    "SchoolTotalStudents": 1005,
                                    "SchoolEmployeeTeachingCount": 52
                                }
                            );
                         });
                     });

        let schoolCode = '8432';
        const result = await getController.handleGet(singleSchoolEvent);
        console.log(JSON.stringify(result, null, 2));
        expect(result.statusCode).toEqual(200);
        expect(result.body['SchoolCode']).toEqual(schoolCode.toString());
    });

    it('when the header X-System-ID is not present it should return error', async () => {
        singleSchoolEvent.headers['X-System-ID'] = null;

        let schoolCode = '8432';
        const result = await getController.handleGet(singleSchoolEvent);
        expect(result.statusCode).toEqual(400);
        console.log(JSON.stringify(result, null, 2));
    });

});
