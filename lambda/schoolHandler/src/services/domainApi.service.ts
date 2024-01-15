import axiosRetry from 'axios-retry';
import axios from 'axios';
import { TokenService } from "./token.service.js";
import { randomUUID } from 'crypto';
import {HttpsProxyAgent} from 'https-proxy-agent';
import { Service } from 'typedi';
import * as dotenv from 'dotenv';
dotenv.config();

@Service()
class DomainApiService {

    private static PAGE_NUMBER: number = parseInt(process.env.PAGE_NUMBER || '12');
    private readonly axiosRequestTemplate = {
            method: 'post',
            data: { query: {} },
            headers: {
               'Content-Type': 'application/json',
            },
        };

     constructor(
        private readonly tokenService: TokenService
     ){};

    async getSingleSchoolData(schoolCode: string, profile: string): Promise<any> { //TODO change any
        return new Promise<any>( async (resolve, reject) => {
                try {
                    console.log('Got from env ' + process.env.DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL);
                    const token:string = await this.tokenService.generateToken(profile);
                    const domainSchoolApiRequest = this.createSingleSchoolRequest(schoolCode, token);
                    let response = await axios.post<any>(domainSchoolApiRequest.url, domainSchoolApiRequest.data, domainSchoolApiRequest);
                    resolve(response.data.schools);
                } catch(e) {
                    console.log('Failed to get the domain api data for schoolCode ' + schoolCode + ' profile ' + profile);
                    console.log(e);
                    reject(e);
                }
        });
    }

    async getAllSchoolMetaData(): Promise<any> { //TODO check the return type for Promise
        const data = { query: {} };
        const token:string = await this.tokenService.generateToken();
        const domainSchoolApiRequests = this.createRequests(token);
        const responsePromises: Promise<any> [] = []; //TODO change any
        let randomRequest = null;
        for(const domainSchoolApiRequest of domainSchoolApiRequests) {
           let responsePromise: Promise<any> = axios(domainSchoolApiRequest); //TODO change any
           responsePromises.push(responsePromise);
        }

        console.log(' responsePromises size ' + responsePromises.length);
        const pageResponses = await Promise.all(responsePromises); //TODO change any

        let needToFetchMoreData: boolean = true;
        const aggregateResponse = pageResponses.map( pageResponse => {
                            //console.log(JSON.stringify(pageResponse.data, null, 2));
                            console.log('pageResponse.data.length ' + pageResponse.data.schools.length);
                            if(this.nextPageNotPresent(pageResponse)) {
                                needToFetchMoreData = false;
                            }
                            return pageResponse.data.schools;
                        });
        console.log('needToFetchMoreData ' + needToFetchMoreData);

        let pageNo: number = DomainApiService.PAGE_NUMBER;
        while(needToFetchMoreData) {
            pageNo++;
            console.log('still some pages left to be fetched ' + pageNo);
            let nextPageRequest = this.createAllSchoolRequest(pageNo, token);
            const pageResponse = await axios(nextPageRequest);
            if(pageResponse?.data && pageResponse.data?.schools.length > 0) {
                aggregateResponse.push(pageResponse.data.schools);
            }
            if(this.nextPageNotPresent(pageResponse)) {
                needToFetchMoreData = false;
            }
        }

        let response:any; //TODO change any
        try {
          //response = await axios.post(domainSchoolApi, data, config);
          /*response = await axios({
                              method: 'post',
                              url: domainSchoolApi,
                              data: data,
                              headers: {
                                 'Authorization': 'Bearer ' + token,
                                 'Content-Type': 'application/json',
                                 'x-correlation-id': '3fa85f64-5717-4562-b3fc-2c963f66afa6' //TODO remove hardcoding
                              },
                              httpsAgent: new HttpsProxyAgent('http://proxy.det.nsw.edu.au:80'), //TODO make it local specific
                              proxy: false //TODO make it local specific
                         });*/
          /*  let domainRequest:any = {
                method: 'post',
                url: 'https://school.integration.dev.education.nsw.gov.au/v1/schools/search?page=1&limit=200',
                data: { query: {} },
                headers: {
                   'Authorization': 'Bearer ' + token,
                   'Content-Type': 'application/json',
                   'x-correlation-id': '3fa85f64-5717-4562-b3fc-2c963f66afa6', //TODO remove hardcoding
                },
                   httpsAgent: new HttpsProxyAgent('http://proxy.det.nsw.edu.au:80'),
                   proxy: false
            }
          response = await axios(domainRequest);*/

          //console.log('response ' + JSON.stringify(response.data, null, 2));
        } catch (e) {
          //logger.error("Error calling web service", e);
          console.log("Error calling web service", e);
          throw new Error("Error invoking Web Service");
          //return new Promise<string>((resolve, reject) => { reject(token)});
        }
        return new Promise<any>((resolve, reject) => { resolve(aggregateResponse)});
        //return aggregateResponse;
    }

    private createRequests(token: string):any {
        let domainSchoolApiRequests: any = [];
        const localEnv: boolean = process.env.LOCAL ? true: false;
        if(localEnv) {
            (this.axiosRequestTemplate as any).httpsAgent = new HttpsProxyAgent('http://proxy.det.nsw.edu.au:80');
            (this.axiosRequestTemplate as any).proxy = false;
        }

        for(let pageNo=1; pageNo <= DomainApiService.PAGE_NUMBER; pageNo++) {
            let axiosRequest = this.createAllSchoolRequest(pageNo, token);
            domainSchoolApiRequests.push(axiosRequest);
        }
        return domainSchoolApiRequests;
    }

    private createAllSchoolRequest(pageNo: number, token: string): any {
            let domainSchoolApi: string = process.env.DOMAIN_SCHOOL_ALL_SCHOOL_REQUEST_URL + String(pageNo);
            const axiosRequest = {...this.axiosRequestTemplate,
                                    url: domainSchoolApi,
                                    headers: {...this.axiosRequestTemplate.headers,
                                                 Authorization: 'Bearer ' + token,
                                                 "x-correlation-id": randomUUID()}
                                 };
             return axiosRequest;
    }

    private createSingleSchoolRequest(schoolCode: string, token: string): any { //TODO change any
            let domainSchoolApi: string = process.env.DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL;
            const localEnv: boolean = process.env.LOCAL ? true: false;
            if(localEnv) {
                (this.axiosRequestTemplate as any).httpsAgent = new HttpsProxyAgent('http://proxy.det.nsw.edu.au:80');
                (this.axiosRequestTemplate as any).proxy = false;
            }
            const axiosRequest = {...this.axiosRequestTemplate,
                                    url: domainSchoolApi,
                                    headers: {...this.axiosRequestTemplate.headers,
                                                 Authorization: 'Bearer ' + token,
                                                 "x-correlation-id": randomUUID()}
                                 };
             axiosRequest.data = {
                                    query: {
                                        schoolCodes: [schoolCode]
                                    }
                                 };
             return axiosRequest;
    }

    //Check the page response to see if the links array in the response, has ref=next in at least one of the links.
    //Having ref=next means there is at least one next page to fetch.
    //If it is not present it returns true indicating next page not present
    private nextPageNotPresent(pageResponse): boolean {
        const links = pageResponse?.data?.links;
        const nextLinks = links.filter(link => link.ref === 'next');
        return nextLinks.length === 0;
    }
}

export { DomainApiService };