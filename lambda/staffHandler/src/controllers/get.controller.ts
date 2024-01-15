import { validate } from "./../common/requestValidator.util.js";
import { buildSuccessResponse, buildErrorResponse } from "./../common/responseBuilder.util.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getLogger } from 'logging';
import { getByKeyIgnoreCase } from './../common/utils.js'
import { StaffService } from "../services/staff.service.js";

export class GetController {

    private staffService: StaffService;
    constructor(staffService: StaffService) {
        this.staffService = staffService;
    }

    public handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = getLogger();
        logger.debug('inside GetController');
        const headers = event['headers'];
        const schoolCode: string | null = getByKeyIgnoreCase(event['pathParameters'], 'schoolCode');

        const validationError = validate(event);
        if (validationError) {
            logger.debug('validationError ' + validationError);
            return buildErrorResponse(validationError);
        }

        try {
            let response: any;
            response = await this.staffService.getStaffsBySchoolCode(schoolCode as string);
            logger.debug("controller.js response got from controller: " + JSON.stringify(response, null, 2));
            return buildSuccessResponse(response, 200);
        } catch (error) {
            logger.error(error as string);
            return buildErrorResponse(error);
        }
    }

}

