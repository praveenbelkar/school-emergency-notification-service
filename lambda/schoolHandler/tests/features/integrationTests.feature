Feature: School notify School Api integration tests

    @dev @test @preprod
    Scenario Outline: API to return a single school record when schoolCode exists and match one record
        When The user calls the School notify school API with "<SchoolCode>"
        Then The API will return the payload record and status code 200
        Then Verify schoolcode response "<SchoolFullName>" "<SchoolPreschoolIndicator>" "<SchoolLevelSubtypeCode>" "<SchoolLevelSubtypeName>" "<SchoolPhoneNumber>" "<SchoolEmailAddress>" "<SchoolSuburbName>" "<SchoolPrincipalName>" "<SchoolTotalStudents>" "<SchoolEmployeeTeachingCount>"
        Examples:
            | SchoolCode | SchoolFullName                | SchoolPreschoolIndicator | SchoolLevelSubtypeCode | SchoolLevelSubtypeName | SchoolPhoneNumber | SchoolEmailAddress                 | SchoolSuburbName | SchoolPrincipalName | SchoolTotalStudents | SchoolEmployeeTeachingCount |
            | 8432       | Engadine High School          | N                        | 17                     | Secondary 7-12         | 9520 0411         | engadine-h.school@det.nsw.edu.au   | null             | Ms Kerrie Jones     | 1005                | 52                          |
            | 5126       | Merrylands East Public School | N                        | 6                      | Primary  K-6           | 9637 2638         | merrylande-p.school@det.nsw.edu.au | null             | Mr John Goh         | 341                 | 16                          |

    @dev @test @preprod
    Scenario Outline: API to return message - Invalid value provided for header X-Correlation-ID - when X-Correlation-ID header value is not of the uuid format
        When The user calls the School notify school API with X-Correlation-ID header value which is not of the uuid format
        Then The API will return the Error response message -Invalid value provided for header X-Correlation-ID - and status code 400

    @dev @test @preprod
    Scenario Outline: API to return "Missing required header X-System-ID" when X-System-ID header value is missing
        When The user calls the School notify school API with no header X-System-ID
        Then The API will return the Error response message -Missing required header X-System-ID - and status code 400

    @dev @test @preprod
    Scenario Outline: API to return list of all school records
        When The user calls the School notify school API to get all school records
        Then The API will return the payload of array of all the school records and status code 200
        Then Verify school response for school endpoint "<SchoolCode>","<SchoolFullName>","<SchoolEmailAddress>"
        Examples:
            | SchoolCode | SchoolFullName                  | SchoolEmailAddress                 |
            | 8432       | Engadine High School            | engadine-h.school@det.nsw.edu.au   |
            | 5126       | Merrylands East Public School   | merrylande-p.school@det.nsw.edu.au |
            | 8584       | Elizabeth Macarthur High School | elizabeth-h.school@det.nsw.edu.au  |

    @dev @test @preprod
    Scenario Outline: API to return 400 when we pass incorect schoolcode
        When The user calls the School notify school API with incorrect schoolcode
        Then The school API will return the payload record and status code 400

    @test
    Scenario Outline: API to return 403 when we pass expired or invalid token
        When The user calls the School notify school API with expired AWS token
        Then The school API will return error code 403