Feature: Get staff

  Scenario Outline: API to return a school staff record
    When The user calls the School notify staff API with "<SchoolCode>"
    Then The API will return the payload record and status code 200
    Then Verify staff response for staff endpoint "<StaffIdentifier>","<StaffTitleTypeCode>","<StaffGivenName>","<StaffFamilyName>","<StaffDoEEmailAddress>","<StaffDoEUserIdentifier>","<EmploymentStatus>","<StaffPhoneNumber>","<StaffMobileNumber>","<StaffFullName>","<StaffMiddleName>"

    @dev
    Examples:
      | SchoolCode | StaffIdentifier                      | StaffTitleTypeCode | StaffGivenName | StaffFamilyName | StaffDoEEmailAddress              | StaffDoEUserIdentifier | EmploymentStatus | StaffPhoneNumber | StaffMobileNumber | StaffFullName         | StaffMiddleName |
      | 8432       | c012cd92-0503-5656-e053-1263070a0125 | MISS               | Elly           | Hart            | XXXElly.Hart2@det.nsw.edu.au      | Elly.Hart2             | Active           | null             | null              | Elly Lee Hart         | Lee             |
      | 8432       | 49dead42-4546-3f78-e053-4863070aea27 | MRS                | Tracy          | Clark           | XXXTRACY.CLARK@det.nsw.edu.au     | TRACY.CLARK            | Active           | null             | null              | Tracy Louise Clark    | Louise          |
      | 8584       | f3303d66-3f97-1315-e053-1263070af329 | MR                 | Rodrigo        | Acuna           | XXXRodrigo.Acuna4@det.nsw.edu.au  | Rodrigo.Acuna4         | Active           | null             | null              | Rodrigo Zamilo Acuna  | Zamilo          |
      | 8584       | 83b98b78-f1ac-f611-e053-1263070a68d7 | MISS               | Lisa           | Mackay          | XXXLisa.Mackay11@det.nsw.edu.au   | Lisa.Mackay11          | Active           | null             | null              | Lisa Elizabeth Mackay | Elizabeth       |
      | 5126       | e538e3d1-be17-7998-e053-06021b0a2bb9 | MISS               | Natalie        | Truong          | XXXNatalie.Truong3@det.nsw.edu.au | Natalie.Truong3        | Active           | null             | null              | Natalie Truong        | null            |
      | 5126       | 6f9a3436-40a8-e304-e053-5363070a2835 | MS                 | Sarah          | Truong          | XXXSarah.Truong11@det.nsw.edu.au  | Sarah.Truong11         | Active           | null             | null              | Sarah Puishan Truong  | Puishan         |

    @test
    Examples:
      | SchoolCode | StaffIdentifier                      | StaffTitleTypeCode | StaffGivenName | StaffFamilyName | StaffDoEEmailAddress                  | StaffDoEUserIdentifier | EmploymentStatus | StaffPhoneNumber | StaffMobileNumber | StaffFullName        | StaffMiddleName |
      | 8584       | 7db1593f-6da1-484b-93fa-99a26e3ab307 | Mr                 | Samuel         | Bromley         | Samuel.Bromley1@tst.det.nsw.edu.au    | Samuel.Bromley1        | Active           | null             | null              | Samuel Kent Bromley  | Kent            |
      | 8232       | 12b95c08-5379-4d20-b01f-d95b7044ca4f | Mr                 | Umberto        | Lo Campo        | XXXcccc.ccccc@det.nsw.edu.au          | BERT.LOCAMPO           | Active           | null             | null              | Lo Campo Umberto     | Bert            |
      | 8232       | 43dafdf0-cb79-cc0e-e043-901d6b99bf50 | MISS               | Grace          | Williams        | UUUVJIVEA.ZAKVHL@det.nsw.edu.au       | FNBCMI.UISFOJ          | Active           | null             | null              | Grace Ellie Williams | Ellie           |
      | 8232       | 57dead42-9051-3f78-e053-4863070aea27 | MRS                | Daisy          | Smith           | UUUAVFELYMFKED.ZHHYIDJ@det.nsw.edu.au | IFVMJHAVSMT.UOOHBTN    | Active           | null             | null              | Daisy Smith          | null            |

  @dev @test @preprod
  Scenario Outline: API to return 400 when we pass incorect schoolcode
    Given The user calls the School notify staff API with incorrect schoolcode
    Then The Staff API will return the payload record and status code 400


  @dev @test @preprod
  Scenario Outline: API to return message - Invalid value provided for header X-Correlation-ID - when X-Correlation-ID header value is not of the uuid format
    When The user calls the School notify staffs API with X-Correlation-ID header value which is not of the uuid format
    Then The API will return the Error response message -Invalid value provided for header X-Correlation-ID - and status code 400

  @dev @test @preprod
  Scenario Outline: API to return "Missing required header X-System-ID" when X-System-ID header value is missing
    When The user calls the School notify staffs API with no header X-System-ID
    Then The API will return the Error response message -Missing required header X-System-ID - and status code 400

  @test
  Scenario Outline: API to return 403 when we pass expired or invalid token
    When The user calls the School notify staff API with expired AWS token
    Then The Staff API will return error code 403
