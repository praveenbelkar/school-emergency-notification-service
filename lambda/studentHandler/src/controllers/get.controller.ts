import { validate } from "./../common/requestValidator.util.js";
import { buildSuccessResponse, buildErrorResponse } from "./../common/responseBuilder.util.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getLogger } from 'logging';
import { getByKeyIgnoreCase } from './../common/utils.js'
import { StudentService } from "../services/student.service.js";

export class GetController {

    private studentService: StudentService;
    constructor(studentService: StudentService) {
        this.studentService = studentService;
    }

    public handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = getLogger();        
        const headers = event['headers'];
        const schoolCode: string | null = getByKeyIgnoreCase(event['pathParameters'], 'schoolCode');
        const scholasticYear: string | null = getByKeyIgnoreCase(event['queryStringParameters'], 'scholasticYear');
        logger.debug(`inside GetController schoolCode: ${schoolCode}, scholasticYear: ${scholasticYear}`);

        const validationError = validate(event);
        if (validationError) {
            logger.debug('validationError ' + validationError);
            return buildErrorResponse(validationError);
        }

        try {
            let response: any;
            response = await this.studentService.getBySchoolCode(schoolCode as string, scholasticYear as string);
            return buildSuccessResponse(response, 200);
        } catch (error) {
            logger.error(error as string);
            return buildErrorResponse(error);
        }
    }

}

