import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { getLogger } from 'logging';

const secretName = 'school-emergency-secrets';
let isSecretsLoaded: boolean = false;
let userName: string;
let password: string;


const loadSecrets = async () => {
    const client = new SecretsManagerClient({
        region: "ap-southeast-2",
    });

    const logger = getLogger();

    if (!isSecretsLoaded) {
        logger.debug("Loading secrets from : " + secretName);
        try {

            let response = await client.send(
                new GetSecretValueCommand({
                    SecretId: secretName,
                })
            );
            let secretJson = JSON.parse(response.SecretString as string);
            userName = secretJson.idmSoapUserName;
            password = secretJson.idmSoapPassword;
        } catch (error: any) {
            await logger.error("Error reading from Secrets Manager : ", error);
            throw error;
        }
        isSecretsLoaded = true;
        logger.debug(secretName + " secrets loaded");
    }
};

const getSoapUserName = () => {
    return userName;
}

const getSoapPassword = () => {
    return password;
}


export { loadSecrets, getSoapUserName, getSoapPassword };


