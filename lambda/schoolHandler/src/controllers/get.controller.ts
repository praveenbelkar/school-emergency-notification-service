import { SchoolService } from "./../services/school.service.js";
import { SchoolDetails } from "./../models/schoolDetails.model.js";
import { SchoolMetaData, SchoolAllMetaData } from "./../models/schoolAllMetadata.model.js";
import { Utils } from "./../common/utils.js";
import { RequestValidator } from "./../common/requestValidator.util.js";
import { ResponseBuilder } from "./../common/responseBuilder.util.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Service, Inject } from 'typedi';

@Service()
class GetController {

    @Inject('requestValidator')
    requestValidator: RequestValidator;

    @Inject('school.service')
    schoolService: SchoolService;

    @Inject('responseBuilder')
    responseBuilder: ResponseBuilder;

    async handleGet(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const logger = Utils.createLogger();
        logger.debug('inside GetController');
        const headers = event['headers'];
        const schoolCode: string = Utils.getByKeyIgnoreCase(event['pathParameters'], 'schoolCode');
        const validationError = this.requestValidator.validate(event);
        if(validationError) {
            return this.responseBuilder.buildErrorResponse(validationError);
        }

        try {
            let response: any;
            if(schoolCode) {
               response = await this.schoolService.getSingleSchool(schoolCode);
            } else {
               response = await this.schoolService.getAllSchools();
            }

            if(response) {
                return this.responseBuilder.buildSuccessResponse(response, 200);
            }
        } catch(error) {
            logger.error(error);
            return this.responseBuilder.buildErrorResponse(error);
        }
    }

}

export { GetController };

