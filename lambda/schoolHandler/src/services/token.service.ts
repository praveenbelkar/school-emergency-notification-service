import axiosRetry from 'axios-retry';
import axios from 'axios';
import {HttpsProxyAgent} from 'https-proxy-agent';
import * as dotenv from 'dotenv';
import { Service } from 'typedi';
import { getClientId, getClientSecret } from './secrets';
dotenv.config();

@Service()
class TokenService {

    async generateToken(requestProfile: string = "SRD"): Promise<any> {
        const profile: Profile = this.getProfile(requestProfile);
        const tokenUrl: string = process.env.DOMAIN_SCHOOL_TOKEN_SERVICE_URL;
        let tokenClientId = profile.tokenClientId;
        let tokenClientSecret = profile.tokenClientSecret;
        let tokenScope = profile.tokenScope;
        const DELAY_RETRY_INTERVAL: string = process.env.DELAY_RETRY_INTERVAL || '500';
        const RETRY_ATTEMPT: string = process.env.RETRY_ATTEMPT || '3';

        axiosRetry(axios, {
          retries: parseInt(RETRY_ATTEMPT),
          retryCondition: () => true,
          retryDelay: (retryCount) => {
            return parseInt(DELAY_RETRY_INTERVAL);
          },
          shouldResetTimeout: true,
          onRetry: (retryCount, error, requestConfig) => {
            console.log("Retrying Idm WebServic call : retryCount  : ", retryCount);
          },
        });

        const data = {'client_id': tokenClientId, 'client_secret': tokenClientSecret, 'grant_type': 'client_credentials', 'scope': tokenScope};
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        let token:any; //TODO change any
        try {
          let axiosRequest = {
              method: 'post',
              url: tokenUrl,
              data: data,
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
               }
          };
         const localEnv: boolean = process.env.LOCAL ? true: false;
         if(localEnv) {
             (axiosRequest as any).httpsAgent = new HttpsProxyAgent('http://proxy.det.nsw.edu.au:80');
             (axiosRequest as any).proxy = false;
         }
          token = await axios.post(axiosRequest.url, axiosRequest.data, axiosRequest);
        } catch (e) {
          //logger.error("Error calling web service", e);
          console.log("Error calling web service", e);
          throw new Error("Error invoking Web Service");
          return new Promise<string>((resolve, reject) => { reject(token)});
        }
        return new Promise<any>((resolve, reject) => { resolve(token.data.access_token)});
    }

    private getProfile(requestProfile: string): Profile {
        if(requestProfile === 'AMS') {
            return {
                tokenClientId: getClientId(),
                tokenClientSecret: getClientSecret(),
                tokenScope: process.env.DOMAIN_SCHOOL_TOKEN_AMS_SCOPE
            }
        }

        return { // SRD
          tokenClientId: getClientId(),
          tokenClientSecret: getClientSecret(),
          tokenScope: process.env.DOMAIN_SCHOOL_TOKEN_SRD_SCOPE
        }
    }
}

interface Profile {
    tokenClientId: string;
    tokenClientSecret: string;
    tokenScope: string;
}

export { TokenService };