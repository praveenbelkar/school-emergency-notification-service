Feature: Get student

  Scenario Outline: API to return a school student record
    When The user calls the School notify student API with "<SchoolCode>","<ScholasticYear>"
    Then The API will return the payload record and status code 200
    Then Verify staff response for student endpoint "<RefId>","<FullName>","<Type>","<Value>"

    @dev
    Examples:
      | SchoolCode | ScholasticYear | RefId                                | FullName               | Type   | Value  |
      | 8911       | 11             | e102b381-2b52-54a9-a02f-5da4e563c516 | Mrs GIOVANNI Kommaraju | mobile | 100001 |

    @test
    Examples:
      | SchoolCode | ScholasticYear | RefId                                | FullName               | Type   | Value  |
      | 8911       | 11             | e102b381-2b52-54a9-a02f-5da4e563c516 | Mrs GIOVANNI Kommaraju | mobile | 100001 |

  @dev @test @preprod
  Scenario Outline: API to return 400 when we pass incorect schoolcode
    Given The user calls the School notify student API with incorrect schoolcode
    Then The student API will return the payload record and status code 400


  @dev @test @preprod
  Scenario Outline: API to return message - Invalid value provided for header X-Correlation-ID - when X-Correlation-ID header value is not of the uuid format
    When The user calls the School notify student API with X-Correlation-ID header value which is not of the uuid format
    Then The API will return the Error response message -Invalid value provided for header X-Correlation-ID - and status code 400

  @dev @test @preprod
  Scenario Outline: API to return "Missing required header X-System-ID" when X-System-ID header value is missing
    When The user calls the School notify student API with no header X-System-ID
    Then The API will return the Error response message -Missing required header X-System-ID - and status code 400

  @test
  Scenario Outline: API to return 403 when we pass expired or invalid token
    When The user calls the School notify student API with expired AWS token
    Then The student API will return error code 403
