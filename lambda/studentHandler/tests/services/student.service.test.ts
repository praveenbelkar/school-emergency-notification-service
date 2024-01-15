import nock from 'nock';
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import * as dotenv from 'dotenv';
dotenv.config();
process.env.DSM_STUDENT_CONTACT_API_URI = 'https://dummyUrl';

import { StudentService } from '../../src/services/student.service.js';
import { StudentResponse } from '../../src/types/Student.types.js';

describe('StudentService: get single school', () => {
    let studentService: StudentService = new StudentService();


    it(' should return carers response with filtered records ', async () => {
        nock(/.+/)
        .get(/\/StudentContactRelationships/)
        .query({navigationPage: 1, navigationPageSize: 500, relationshiptype: 'Parent', scholasticYears: 11})
        .reply(200, getMockResponse());
 
            let studentService: StudentService = new StudentService();
            let schoolCode = '8364';
            let scholasticYear = '11';
            const response: StudentResponse = await studentService.getBySchoolCode(schoolCode, scholasticYear);
            expect(response.Carers.length).toBe(1);
    });


});

describe('StudentService: get single school - with no response', () => {
    let studentService: StudentService = new StudentService();

    it('should return empty response', async () => {
        nock(/.+/)
        .get(/\/StudentContactRelationships/)
        .query({navigationPage: 1, navigationPageSize: 500, relationshiptype: 'Parent', scholasticYears: 9})
        .reply(200);
 
            let studentService: StudentService = new StudentService();
            let schoolCode = '1000';
            let scholasticYear = '9';
            const response: StudentResponse = await studentService.getBySchoolCode(schoolCode, scholasticYear);
            expect(response.Carers.length).toBe(0);
    });


});

const getMockResponse = () => {
    return {
        "StudentContactRelationships": {
            "StudentContactRelationship": [
                {
                    "RefId": "e102b381-2b52-54a9-a02f-5da4e563c516",
                    "LocalId": "1031143049",
                    "stampedParentId": "",
                    "serviceNswTransactionId": "",
                    "PersonInfo": {
                        "Name": {
                            "Type": "",
                            "Title": "Mrs",
                            "FamilyName": "Kommaraju",
                            "GivenName": "GIOVANNI",
                            "FullName": null
                        },
                        "OtherNames": {
                            "Name": [
                                {
                                    "Type": "PRF",
                                    "FamilyName": "Kommaraju",
                                    "GivenName": "GIOVANNI"
                                }
                            ]
                        },
                        "Demographics": {
                            "Sex": "2",
                            "LanguageList": {
                                "Language": [
                                    {
                                        "LanguageType": "2",
                                        "Code": "2303"
                                    },
                                    {
                                        "LanguageType": "4",
                                        "Code": "1201"
                                    },
                                    {
                                        "LanguageType": "",
                                        "Code": "0000"
                                    }
                                ]
                            }
                        },
                        "PhoneNumberList": {
                            "PhoneNumber": [
                                {
                                    "Type": "0888",
                                    "Number": "100001",
                                    "Preference": "1"
                                }
                            ]
                        },
                        "EmailList": {
                            "Email": [
                                {
                                    "Type": "01",
                                    "value": "test1@test.test.com"
                                }
                            ]
                        },
                        "HouseholdContactInfoList": {
                            "HouseholdContactInfo": [
                                {
                                    "PreferenceNumber": "1",
                                    "HouseholdContactId": "1031143041",
                                    "HouseholdSalutation": "Mr & Mrs BARR",
                                    "AddressList": {
                                        "Address": [
                                            {
                                                "Role": "012B",
                                                "Type": "0765",
                                                "EffectiveFromDate": "2019-11-15",
                                                "EffectiveToDate": "2999-12-31",
                                                "Street": {
                                                    "Line1": "43 Claremont Street",
                                                    "Line2": null
                                                },
                                                "City": "KELLYVILLE RIDGE",
                                                "StateProvince": "NSW",
                                                "Country": "1101",
                                                "PostalCode": "2155"
                                            }
                                        ]
                                    },
                                    "PhoneNumberList": {
                                        "PhoneNumber": []
                                    },
                                    "EmailList": {
                                        "Email": [
                                            {
                                                "Type": "01",
                                                "value": "test1@test.test.com"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    "interpreterRequiredIndicator": "N",
                    "aliveIndicator": "Y",
                    "aliveLastModified": null,
                    "metadata": {
                        "LastModified": "2023-08-16T17:19:58.945Z"
                    },
                    "Relationships": [
                        {
                            "StudentContactRelationshipRefId": "3974f4ba-91b7-5d99-bd24-c78a24c212b8",
                            "StudentPersonalRefId": "11284A98-F9C8-168C-E053-1363070ADBB8",
                            "SRN": "447684012",
                            "Relationship": {
                                "Code": "01",
                                "OtherCodeList": {
                                    "OtherCode": [
                                        {
                                            "Codeset": "StateProvince",
                                            "value": "MUM"
                                        }
                                    ]
                                }
                            },
                            "HouseholdList": {
                                "Household": [
                                    "bd8c7d0f-235d-5cb9-9ea3-bed482780a37"
                                ]
                            },
                            "ContactFlags": {
                                "LivesWith": "Y",
                                "ReceivesAssessmentReport": "Y",
                                "EmergencyContact": "N",
                                "HasCustody": "Y",
                                "FeesBilling": "Y",
                                "InterventionOrder": "N",
                                "financiallyInterested": "N",
                                "blockDigitalAccess": ""
                            },
                            "ContactSequence": "1",
                            "FamilyId": "1031143041",
                            "RelationshipType": "Parent",
                            "RelationshipCode": "MUM",
                            "OtherCourtOrderNonAVO": "N"
                        }
                    ]
                },
                {
                    "RefId": "4407ba66-5971-54d0-95cc-9b997d4f01af",
                    "LocalId": "1031144230",
                    "stampedParentId": "",
                    "serviceNswTransactionId": "",
                    "PersonInfo": {
                        "Name": {
                            "Type": "",
                            "Title": "Mr",
                            "FamilyName": "Mohan-Ram",
                            "GivenName": "Do Young",
                            "FullName": null
                        },
                        "OtherNames": {
                            "Name": [
                                {
                                    "Type": "PRF",
                                    "FamilyName": "Mohan-Ram",
                                    "GivenName": "Do Young"
                                }
                            ]
                        },
                        "Demographics": {
                            "Sex": "1",
                            "LanguageList": {
                                "Language": [
                                    {
                                        "LanguageType": "4",
                                        "Code": "2303"
                                    },
                                    {
                                        "LanguageType": "2",
                                        "Code": "2302"
                                    },
                                    {
                                        "LanguageType": "",
                                        "Code": "0000"
                                    }
                                ]
                            }
                        },
                        "PhoneNumberList": {
                            "PhoneNumber": [
                                {
                                    "Type": "0888",
                                    "Number": "100001",
                                    "Preference": "1"
                                }
                            ]
                        },
                        "EmailList": {
                            "Email": [
                                {
                                    "Type": "01",
                                    "value": "test1@test.test.com"
                                }
                            ]
                        },
                        "HouseholdContactInfoList": {
                            "HouseholdContactInfo": [
                                {
                                    "PreferenceNumber": "1",
                                    "HouseholdContactId": "1031143041",
                                    "HouseholdSalutation": "Mr & Mrs BARR",
                                    "AddressList": {
                                        "Address": [
                                            {
                                                "Role": "012B",
                                                "Type": "0765",
                                                "EffectiveFromDate": "2019-11-15",
                                                "EffectiveToDate": "2999-12-31",
                                                "Street": {
                                                    "Line1": "43 Claremont Street",
                                                    "Line2": null
                                                },
                                                "City": "KELLYVILLE RIDGE",
                                                "StateProvince": "NSW",
                                                "Country": "1101",
                                                "PostalCode": "2155"
                                            }
                                        ]
                                    },
                                    "PhoneNumberList": {
                                        "PhoneNumber": []
                                    },
                                    "EmailList": {
                                        "Email": [
                                            {
                                                "Type": "01",
                                                "value": "test1@test.test.com"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    "interpreterRequiredIndicator": "N",
                    "aliveIndicator": "Y",
                    "aliveLastModified": null,
                    "metadata": {
                        "LastModified": "2023-08-16T17:19:58.945Z"
                    },
                    "Relationships": [
                        {
                            "StudentContactRelationshipRefId": "41fcf894-8850-589d-93b6-5519f1e7b728",
                            "StudentPersonalRefId": "11284A98-F9C8-168C-E053-1363070ADBB8",
                            "SRN": "447684012",
                            "Relationship": {
                                "Code": "01",
                                "OtherCodeList": {
                                    "OtherCode": [
                                        {
                                            "Codeset": "StateProvince",
                                            "value": "DAD"
                                        }
                                    ]
                                }
                            },
                            "HouseholdList": {
                                "Household": [
                                    "bd8c7d0f-235d-5cb9-9ea3-bed482780a37"
                                ]
                            },
                            "ContactFlags": {
                                "LivesWith": "Y",
                                "ReceivesAssessmentReport": "Y",
                                "EmergencyContact": "N",
                                "HasCustody": "N",
                                "FeesBilling": "N",
                                "InterventionOrder": "N",
                                "financiallyInterested": "Y",
                                "blockDigitalAccess": ""
                            },
                            "ContactSequence": "2",
                            "FamilyId": "1031143041",
                            "RelationshipType": "Parent",
                            "RelationshipCode": "DAD",
                            "OtherCourtOrderNonAVO": "N"
                        }
                    ]
                }
            ]
        }
    };
}