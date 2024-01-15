import 'reflect-metadata';

import axios, { AxiosResponse } from 'axios';
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import  MockAdapter  from "axios-mock-adapter";
import { when } from 'jest-when';
import { DomainApiService } from "../src/services/domainApi.service.js";
import { TokenService } from "../src/services/token.service.js";
import { SchoolService } from "../src/services/school.service.js";
import { Utils } from "../src/common/utils.js";
import { Container } from 'typedi';
import * as dotenv from 'dotenv';
dotenv.config();

import * as logging from 'logging';

const mockedResponse: AxiosResponse = { data: {}, status: 200, statusText: 'ok', headers: {}, config: {headers: null} };

describe('DomainApiService: get single school', () => {
    let tokenService: TokenService = new TokenService();
    let tokenService_generateToken = null;
    let domainApiService: DomainApiService = new DomainApiService(tokenService);
    let schoolService:SchoolService = null;
    let mockedAxios: MockAdapter;

    beforeEach(() => {
      tokenService_generateToken = jest.spyOn(tokenService, "generateToken");
      Container.set(TokenService, tokenService);
      mockedAxios = new MockAdapter(axios);
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
          mockedAxios.reset();
    });

    it('should return school detail for given school code', async () => {

        when(tokenService_generateToken)
        .calledWith(expect.anything())
        .mockImplementation(async (requestProfile: string) => {
        return Promise.resolve("eyJraWQiOiJld05VZis2Wjc2b0ROaVN1dDdXT09rUzhYTW9NZkxROWlDV2MwTXl0U2Y0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0NXV0NzAzOWhuMGsxazRvY2kyZTUzOXUxdSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXBpXC9hY2Nlc3MgYXBwOmRvbWFwaTpzcmRzY2hvb2xcL2FjY2VzcyIsImF1dGhfdGltZSI6MTY5MzY2Njc0OSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX21aeG94anZOUiIsImV4cCI6MTY5MzY3MDM0OSwiaWF0IjoxNjkzNjY2NzQ5LCJ2ZXJzaW9uIjoyLCJqdGkiOiJiMGIzYmM5NC1mODRjLTRiMTMtOWZjOS00YzQ0NGRmNzlmNjkiLCJjbGllbnRfaWQiOiI0NXV0NzAzOWhuMGsxazRvY2kyZTUzOXUxdSJ9.Tq0HXadgate0gc3rkkl1tsGJDt7BtXjyP6JWKwWq_qPrf7_mhlBKrhbdm1ldbwcrg7NUkBimSJtnWq3beNccrBxnHEFbp7_qlX3Xw8wEqjFWW7Sklrd71ow870gnnDdyeH_tK5pU3QJXPetMF7Is-HT-_IqtPfZj_qb79OpNnifG2cHbxsfNuZDuFokm_Z7Z0JwPUX5YXyLwSUdnU4ZYc-KJLkZTsXId9svl0VNycVVtxoG05crU-YlelhGD52-6rrCAKSWGAryCt6bYhZfsxDh4x3j8RsP55LoO54qMMvMxviGdEXE0awc3ybgJ9kDiw826GMv3fcTEeAPnoKcAzg") });

        const mockedResponse: AxiosResponse =
                    {
                        data:
                             {
                                "links": [],
                                "schools": [{
                                    "sourceSystemCode": "SRD",
                                    "domainTopicName": "School_1",
                                    "schoolCode": "8364",
                                    "schoolSpecialityTypeName": "Not Specialist",
                                    "schoolGenderCompositionCode": "Co-ed",
                                    "schoolPrincipalNetworkName": "Hastings",
                                    "schoolAddressLine1": null,
                                    "schoolSuburbName": null,
                                    "schoolPostalCode": null,
                                    "schoolPhoneNumber": "6583 1844",
                                    "schoolEmailAddress": "hsc-portmac-school@det.nsw.edu.au",
                                    "schoolLocalGovernmentAreaName": "PORT MACQUARIE-HASTI",
                                    "schoolStateElectorateName": "PORT MACQUARIE",
                                    "schoolFederalElectorateName": "Cowper",
                                    "schoolFullName": "Hastings Sec College Port Macquarie",
                                    "schoolShortName": "Hastings Sec College Port Macquarie",
                                    "schoolStatusTypeCode": "6",
                                    "schoolStatusTypeName": "Open School",
                                    "schoolLevelTypeCode": "13",
                                    "schoolLevelTypeName": "Secondary Schools",
                                    "schoolLevelSubtypeCode": "17",
                                    "schoolLevelSubtypeName": "Secondary 7-12",
                                    "schoolSpecialityTypeCode": "16",
                                    "schoolSelectiveTypeCode": "N",
                                    "schoolSelectiveTypeName": "N",
                                    "schoolPreschoolIndicator": "N",
                                    "schoolOpportunityClassIndicator": "N",
                                    "schoolDistanceEducationCode": "No",
                                    "schoolIntensiveEnglishCenterIndicator": "N",
                                    "schoolLateOpeningIndicator": "No",
                                    "schoolNetworkDirectorName": "Mr Andrew Kuchling",
                                    "schoolNetworkDirectorEmail": "ANDREW.KUCHLING@DET.NSW.EDU.AU",
                                    "schoolOperationalDirectorateCode": " 27470",
                                    "schoolOperationalDirectorateName": "Regional North and West",
                                    "schoolAgeIdentifier": "49640",
                                    "schoolAddressTypeName": "SchoolAddress",
                                    "schoolAddressLine2": null,
                                    "schoolSectorTypeName": "Government",
                                    "schoolCommencementDate": null,
                                    "schoolClosedDate": null,
                                    "schoolEmployeeOnDutyDate": "1962-01-01T00:00:00.000Z",
                                    "schoolEmployeeWithdrawnDate": null,
                                    "schoolPrincipalName": "Mrs Kristen Miller",
                                    "schoolLastYearEnrolmentNumber": "2022",
                                    "schoolYancowinIndicator": "N",
                                    "schoolHotClimateAllowanceIndicator": "N",
                                    "schoolColdClimateAllowanceIndicator": "N",
                                    "schoolSocioCarAllowanceAmount": "0",
                                    "schoolIndexCommunitySocioEducationalAdvantageValue": 967,
                                    "schoolAustStatisticalGeographyStandardRemotenessArea": "Inner Regional Australia",
                                    "schoolStatisticalAreaLevel4Name": "Mid North Coast",
                                    "schoolStudentsInCap": 657,
                                    "schoolTotalStudents": 698,
                                    "schoolEnrolmentCap": 780
                                }]
                            },
                      status: 200,
                      statusText: 'OK',
                      headers: {},
                      config: { headers: null},
                    };
        //mockedAxios.onPost('https://school.integration.dev.education.nsw.gov.au/v1/schools/search?page=1&limit=200')
        mockedAxios.onPost(/^.*$/)
                   .reply(200, mockedResponse.data);

        let schoolCode = '8364';
        const resultPromise = domainApiService.getSingleSchoolData(schoolCode, "SRD");
        const schoolDataPromises = await Promise.allSettled([resultPromise]);
        expect(schoolDataPromises[0].status).toEqual('fulfilled');
        const aggregateData = [];
        if(schoolDataPromises[0].status == 'fulfilled') {
             aggregateData.push(schoolDataPromises[0].value);
             expect(schoolDataPromises[0].value.length > 0);
             expect(schoolDataPromises[0].value[0].schoolCode).toEqual("8364");
        }
    });

});