import 'reflect-metadata';
import { SchoolService } from "../src/services/school.service.js";
import { DomainApiService } from "../src/services/domainApi.service.js";
import { GetController } from "../src/controllers/get.controller.js";
import { Utils } from "../src/common/utils.js";
import { Container } from 'typedi';
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import { when } from 'jest-when';
import * as logging from 'logging';
describe('School Service: get single school', () => {

    let domainService: DomainApiService = new DomainApiService(null);
    let domainService_getSingleSchoolData = null;
    let getController:GetController = null;
    let schoolService:SchoolService = null;

    beforeEach(() => {
      domainService_getSingleSchoolData = jest.spyOn(domainService, "getSingleSchoolData");
      Container.set(DomainApiService, domainService);
      getController = Container.get(GetController);
      schoolService = Container.get<SchoolService>("school.service");

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

        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "SRD")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([{
                                 schoolCode: schoolCode,
                                 schoolFullName: "Best School " + schoolCode
                             }]);
                         })
                     });

        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "AMS")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([{
                                 schoolCode: schoolCode,
                                 schoolEmployeeTeachingCount: "100"
                             }]);
                         })
                     });

        let schoolCode = '9364';
        const result = await schoolService.getSingleSchool(schoolCode);

        expect(result.SchoolCode).toEqual(schoolCode);
        expect(result.SchoolFullName).toEqual('Best School ' + schoolCode);
        expect(result.SchoolEmployeeTeachingCount).toEqual("100");

    });


    it('should return school details  if only SRD profile data is available and AMS profile returns empty', async() => {
        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "SRD")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([{
                                 schoolCode: schoolCode,
                                 schoolFullName: "Best School " + schoolCode
                             }]);
                         })
                     });

        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "AMS")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([]);
                         })
                     });

        let schoolCode = '9364';

        const result = await schoolService.getSingleSchool(schoolCode);

        expect(result.SchoolCode).toEqual(schoolCode);
        expect(result.SchoolFullName).toEqual('Best School ' + schoolCode);
        expect(result.SchoolEmployeeTeachingCount).toBeUndefined();
    });


    it('should return school details  if only SRD profile data is available and AMS profile throws error', async() => {
        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "SRD")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([{
                                 schoolCode: schoolCode,
                                 schoolFullName: "Best School " + schoolCode
                             }]);
                         })
                     });

        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "AMS")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             reject('domainApi service error');
                         })
                     });

        let schoolCode = '9364';
        const result = await schoolService.getSingleSchool(schoolCode);

        expect(result.SchoolCode).toEqual(schoolCode);
        expect(result.SchoolFullName).toEqual('Best School ' + schoolCode);
        expect(result.SchoolEmployeeTeachingCount).toBeUndefined();
    });

    it('should throw error if SRD profile data is not available', async() => {
        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "SRD")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([]);
                         })
                     });

        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "AMS")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([{
                                 schoolCode: schoolCode,
                                 schoolEmployeeTeachingCount: "100"
                             }]);
                         })
                     });

        let schoolCode = '9364';
        try {
            expect(await schoolService.getSingleSchool(schoolCode));
        } catch(e) {
            expect(e.detail).toBe('No school found');
        }
    });

    it('should throw error if SRD profile data throws error ', async() => {
        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "SRD")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             reject('domainApi service error');
                         })
                     });

        when(domainService_getSingleSchoolData)
        .calledWith(expect.anything(), "AMS")
        .mockImplementation(async (schoolCode: string, profile: string) => {
                         return new Promise((resolve, reject) => {
                             resolve([{
                                 schoolCode: schoolCode,
                                 schoolEmployeeTeachingCount: "100"
                             }]);
                         })
                     });

        let schoolCode = '9364';
        try {
            expect(await schoolService.getSingleSchool(schoolCode));
        } catch(e) {
            expect(e.detail).toBe('No school found');
        }
    });

});


/// All school data
describe('School Service: get all schools data', () => {

    let domainService: DomainApiService = new DomainApiService(null);
    let domainService_getAllSchoolMetaData = null;
    let getController:GetController = null;
    let schoolService:SchoolService = null;

    beforeEach(() => {
      //domainService_getAllSchoolMetaData = jest.spyOn(domainService, "getAllSchoolMetaData");
      Container.set(DomainApiService, domainService);
      getController = Container.get(GetController);
      schoolService = Container.get<SchoolService>("school.service");
    });

    afterEach(() => {
          Container.reset();
    });

    it('should return all school detail', async () => {

        jest.spyOn(domainService, "getAllSchoolMetaData")
            .mockImplementation(async () => {
                return new Promise((resolve, reject) => {
                    resolve([{
                            schoolCode: '1001',
                            schoolFullName: "Chatwoods Primary School",
                            schoolEmailAddress: "chatwoods@det.com",
                            schoolSectorTypeName: "Government"
                        },{
                            schoolCode: '1002',
                            schoolFullName: "Sherwoods High School",
                            schoolEmailAddress: "sherwoods@det.com",
                            schoolSectorTypeName: "Government"
                      }]);
                    });
                });

        const result = await schoolService.getAllSchools();
        expect(result.Schools.length).toEqual(2);
        expect(result.Schools[0].SchoolCode).toEqual('1001');
        expect(result.Schools[0].SchoolFullName).toEqual('Chatwoods Primary School');
        expect(result.Schools[0].SchoolEmailAddress).toEqual('chatwoods@det.com');
    });
});