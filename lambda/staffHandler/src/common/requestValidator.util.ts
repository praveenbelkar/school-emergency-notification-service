import { getByKeyIgnoreCase } from "./../common/utils.js";
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as dotenv from 'dotenv';
dotenv.config();

const UUID_FORMAT: string = "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$";
const SCHOOL_CODE_FORMAT = /^\d{4}$/;

const validate= (event: APIGatewayProxyEvent): any => {
    const headers = event['headers'];
    let xSystemId: string | null = getByKeyIgnoreCase(headers, 'X-System-ID');
    if(!xSystemId || xSystemId == null || xSystemId.trim() === '') {
        return {
            statusCode: 400,
            detail: "Missing required header X-System-ID"
        }
    }
    xSystemId = xSystemId.toLowerCase();
    let expectedSystemId: string = process.env.DCU_SYSTEM_ID || 'sct_dev';
    if(xSystemId && xSystemId != null && xSystemId != expectedSystemId.toLowerCase()) {
        return {
            statusCode: 400,
            detail: "Not the allowed DCU system ID"
        }
    }

    const xCorrelationId: string | null = getByKeyIgnoreCase(headers, 'X-Correlation-ID');
    if(xCorrelationId && !xCorrelationId.match(UUID_FORMAT)) {
        return {
            statusCode: 400,
            detail: "Invalid value provided for header X-Correlation-ID"
        }
    }

    const schoolCode: string | null = getByKeyIgnoreCase(event['pathParameters'], 'schoolCode');
    if(!SCHOOL_CODE_FORMAT.test(schoolCode as string)) {
        return {
            statusCode: 400,
            detail: `Invalid value ${schoolCode} provided for school code`
        }
    }

    return null;
}

export { validate };