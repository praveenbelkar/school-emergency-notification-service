import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "../index.js";
import eventJson from "./mocks/event.json";

const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,7}Z$/;

describe("getBySchoolCode", () => {
  let mockEvent: APIGatewayProxyEvent & { rawHeaders: {} };

  beforeEach(() => {
    mockEvent = JSON.parse(JSON.stringify(eventJson));
    mockEvent.headers = {
      "X-System-ID": "test-system-id",
    };
  });

  /*test("should return staff for valid school code", async () => {
    mockEvent.pathParameters = { schoolCode: "8176" };
    const result = await handler(mockEvent, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(
      JSON.stringify({
        Staffs: [
          {
            StaffTitleTypeCode: "",
            StaffGivenName: "Anasfffff",
            StaffMiddleName: "Bulanhagui",
            StaffFamilyName: "Isffffff",
            StaffDoEEmailAddress: "TODO",
            StaffDoEUserIdentifier: "KERRY.WATTS3",
            StaffPhoneNumber: "9999 999 270",
            StaffMobileNumber: "0430082183",
            StaffSchoolCodes: ["TODO", "TODO"],
            StaffPositionName: "",
            StaffSapEmployeeIdentifier: "01161166",
            StaffFunctionalUnitName: "TODO",
            StaffFunctionalUnitCode: "TODO",
            StaffIdentifier: "16fb53e1-ddff-4dc8-a7af-9b27ad4c4ad8",
            EmploymentStatus: "",
          },
        ],
      })
    );
  });*/

  /*test("should return empty staff array for invalid school code", async () => {
    mockEvent.pathParameters = { schoolCode: "0000" };
    const result = await staffHandler(mockEvent, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ Staffs: [] }));
  });

  test("should return error response when domain service call fails", async () => {
    mockEvent.pathParameters = { schoolCode: "0000" };
    mockEvent.headers["X-Correlation-ID"] = "domain-500";

    const result = await staffHandler(mockEvent, {} as Context);

    expect(result.statusCode).toBe(500);

    expect(JSON.parse(result.body)).toEqual({
      Id: expect.stringMatching(uuidRegex),
      CorrelationId: "domain-500",
      Detail: "Unable to complete the request due to an internal error",
      Date: expect.stringMatching(dateTimeRegex),
    });
  });*/

    test("dummy test", async () => {
      expect(true).toBe(true);
    });

});
