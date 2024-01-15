import { Utils } from "./../common/utils.js";
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Service } from 'typedi';
import * as dotenv from 'dotenv';
dotenv.config();

const UUID_FORMAT: string = "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$";

@Service({ id: 'requestValidator' })
class RequestValidator {

    validate(event: APIGatewayProxyEvent): any {
        const headers = event['headers'];
        let xSystemId: string = Utils.getByKeyIgnoreCase(headers, 'X-System-ID');
        if(!xSystemId || xSystemId == null || xSystemId.trim() === '') {
            return {
                statusCode: 400,
                detail: "Missing required header X-System-ID"
            }
        }
        xSystemId = xSystemId.toLowerCase();

        if(xSystemId && xSystemId != null && xSystemId != process.env.DCU_SYSTEM_ID.toLowerCase()) {
            return {
                statusCode: 400,
                detail: "Not the allowed DCU system ID"
            }
        }

        const xCorrelationId: string = Utils.getByKeyIgnoreCase(headers, 'X-Correlation-ID');
        if(xCorrelationId && !xCorrelationId.match(UUID_FORMAT)) {
            return {
                statusCode: 400,
                detail: "Invalid value provided for header X-Correlation-ID"
            }
        }

        return null;
    }
}

export { RequestValidator };