import 'reflect-metadata';
import { jest, afterEach, describe, expect, it } from '@jest/globals';
import axios, { AxiosResponse } from 'axios';
import  MockAdapter  from "axios-mock-adapter";

import { TokenService } from "../src/services/token.service.js";
import { when } from 'jest-when';
import * as logging from 'logging';

describe('Token Service: get token ', () => {

    let tokenService: TokenService = null;
    let mockedAxios: MockAdapter;

    beforeAll(() => {
        tokenService = new TokenService();
    });

    beforeEach(() => {
        mockedAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockedAxios.reset();
    });

    it('should return the token for the SRD profile', async () => {
        let profile = 'SRD';

        //Prepare the response we want to get from axios
            const mockedResponse: AxiosResponse  = {
              data: {
                        "access_token": "eyJraWQiOiJld05VZis2Wjc2b0ROaVN1dDdXT09rUzhYTW9NZkxROWlDV2MwTXl0U2Y0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0NXV0NzAzOWhuMGsxazRvY2kyZTUzOXUxdSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXBpXC9hY2Nlc3MgYXBwOmRvbWFwaTpzcmRzY2hvb2xcL2FjY2VzcyIsImF1dGhfdGltZSI6MTY5MzcxNDY0NCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX21aeG94anZOUiIsImV4cCI6MTY5MzcxODI0NCwiaWF0IjoxNjkzNzE0NjQ0LCJ2ZXJzaW9uIjoyLCJqdGkiOiJhZjdiMzE4Zi04NDdjLTQyMjMtYTE0Yy0xOTM1NDA5YjQzNTEiLCJjbGllbnRfaWQiOiI0NXV0NzAzOWhuMGsxazRvY2kyZTUzOXUxdSJ9.k1vWe1vNlfVFzGc_WBsZUXfLglbFoeK0PBXJnAQky0T_bXT-Wm_DGwzD_p4oxuilAitBGvBbj9rumR3Kh2QsU14YbP1v-EvDjx08dbHg5WRgp4N0gcnPvsDMIFkYxQyr4TRPDal92wgg9EiaOsgOVJEFvs0M3dx_aWH7Cyk0dxKUNXDg7aOHBSn9xDGcFFfLBP5hd3bSjpN8pQG2Hi2RHBtC6-QZpWx22YKKJTCfLviPiLtHA2Ha1pXgzAHkn2Mk1jQZm9AKDCIOnyo57zJlHfFzthiJNzvYqDLQ3JukbrPWEbSx6DF_qXCNthRKR37FjYNXUxStLMzxLMp0KcUD6g",
                        "expires_in": 3600,
                        "token_type": "Bearer"
                    },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: { headers: null},
            };

        mockedAxios.onPost(/^.*$/)
                      .reply(200, mockedResponse);
        const token:string = await tokenService.generateToken(profile);
        expect(token === mockedResponse.data.access_token);
    });

    it('should return the token for the AMS profile', async () => {
        let profile = 'AMS';

        //Prepare the response we want to get from axios
            const mockedResponse: AxiosResponse  = {
              data: {
                        "access_token": "eyJraWQiOiJld05VZis2Wjc2b0ROaVN1dDdXT09rUzhYTW9NZkxROWlDV2MwTXl0U2Y0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIydDFnMmpsZ200dGNjOXY3aW9mOXY5MTNsOCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXBpXC9hY2Nlc3MgYXBwOmRvbWFwaTphbXNzY2hvb2xcL2FjY2VzcyIsImF1dGhfdGltZSI6MTY5MzcyMjY2MiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX21aeG94anZOUiIsImV4cCI6MTY5MzcyNjI2MiwiaWF0IjoxNjkzNzIyNjYyLCJ2ZXJzaW9uIjoyLCJqdGkiOiI1MjQ1ZDk0MC0wN2UyLTQ3ZjUtOWQzYi02ZjM3ZWQ4MTcxZDEiLCJjbGllbnRfaWQiOiIydDFnMmpsZ200dGNjOXY3aW9mOXY5MTNsOCJ9.mVh5kiHS6k6vxDpqgqNcWjan7D0nNiBFrYTpOM3pi1aibFIHg6RZIsgH2NqxM1LqVQ0wo8mEyugyNPCOv0UEbi1BaIV7UJDUUmDqfBqYrJUrxoTO03AEgeJ2dX4lp1saWJAd2rTN9hAr_2ywvS5IFi7KCBih7tNWNvZHrC6Wx4Q03kHPElCbWQ4scpvfBSrpT6r1BVSmDHrQIgH8OkNZSgtrEbj4Od7TivBsixel9nnQJRcnSDLjWQJCb0_tIoy_BNlxTYNg6Qup7V8DdohfGBPrq4_DRCL_oa-wOUqNz1cbkoktegRzE8v5SbRBaBQm5mRTsz5jQENZ4Jhlcq9NQQ",
                        "expires_in": 3600,
                        "token_type": "Bearer"
                    },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: { headers: null},
            };

        mockedAxios.onPost(/^.*$/)
                      .reply(200, mockedResponse);
        const token:string = await tokenService.generateToken(profile);
        expect(token === mockedResponse.data.access_token);
    });

});
