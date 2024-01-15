const { restRequest, prettyPrintJSON } = require("rest-assured-ts");
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert')
const tunnel = require('tunnel');
var jp = require('jsonpath');

const { sigV4Client } = require("./sigV4Client");
const { Console } = require('console');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//import * as dotenv from 'dotenv';
//dotenv.config();
require('dotenv').config();

//TODO - remove hard coding
// process.env.API_ENDPOINT = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev'
//process.env.API_ENDPOINT = 'https://da4ui00jc0-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/test'
// process.env.AWS_ACCESS_KEY_ID = ''
// process.env.AWS_SECRET_ACCESS_KEY = ''
// process.env.AWS_SESSION_TOKEN = ''
// process.env.TS_ENV = 'test';

//Scenario Outline: API to return a single school record when schoolCode exists and match one record
When('The user calls the School notify staff API with {string}', { timeout: 30 * 1000 }, async function (string) {
    var schoolCode = string;
    /*this.response = await restRequest(`${process.env.API_ENDPOINT}/schoolcommsadapter/v1/schools/${schoolCode}`, {
                            httpMethod: "GET",
                            headerOptions: {
                                        "Content-Type": "application/json",
                                        "X-System-ID": `${process.env.DCU_SYSTEM_ID}`
                            },
                            timeOut: 20000
                        });*/
    //const endpoint = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev';
    const path = `/schoolnotify/v1/staffs/${schoolCode}`;

    var environment = process.env.TS_ENV ;
    var Systemid = "sct_" + `${environment}`;
    console.log(Systemid);
	let appHeaders = { "X-System-ID": `${Systemid}` };
    this.response = await invokeApi(path, appHeaders);
    //console.log('response ' + JSON.stringify(JSON.parse(await this.response.text()), null, 2));
    //console.log('status ' + this.response.status);                                   
});

Then('The API will return the payload record and status code {int}', async function (int) {
    assert.equal(this.response.status, 200);
    //assert.equal((JSON.parse(await this.response.text()))['SchoolCode'], "8432");
});


Then('Verify staff response for staff endpoint {string},{string},{string},{string},{string},{string},{string},{string},{string},{string},{string}', async function (string, string2, string3, string4, string5, string6, string7, string8, string9, string10, string11) {
    apiResponseNQuery = JSON.parse(await this.response.text());
    totalSchoolRecordsReturned = jp.value(apiResponseNQuery, '$.Staffs').length;
    console.log(totalSchoolRecordsReturned);

    for (var i = 0; i < totalSchoolRecordsReturned; i++) {

        var varStaffIdentifier = jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffIdentifier');
        if (varStaffIdentifier == string) {
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffIdentifier'), string);
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffTitleTypeCode'), string2);
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffGivenName'), string3);
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffFamilyName'), string4);
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffDoEEmailAddress'), string5);
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffDoEUserIdentifier'), string6);
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].EmploymentStatus'), string7);
            if (string8 == 'null') {
                assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffPhoneNumber'), null);
            }
            else {
                assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffPhoneNumber'), string8);
            }

            if (string9 == 'null') {
                assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffMobileNumber'), null);
            }
            else {
                assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffMobileNumber'), string9);
            }
            assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffFullName'), string10);

            if (string11 == 'null') {
                assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffMiddleName'), null);
            }
            else {
                assert.equal(jp.value(apiResponseNQuery, '$.Staffs[' + i + '].StaffMiddleName'), string11);
            }
        }


    }



});

//Scenario Outline: API to return 400 when we pass incorect schoolcode
When('The user calls the School notify staff API with incorrect schoolcode', async function () {
    var schoolCode = 23456;
    //const endpoint = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev';
    const path = `/schoolnotify/v1/staffs/${schoolCode}`;

    var environment = process.env.TS_ENV ;
    var Systemid = "sct_" + `${environment}`;
	let appHeaders = { "X-System-ID": `${Systemid}` };
    this.response = await invokeApi(path, appHeaders);
    //console.log('response ' + JSON.stringify(JSON.parse(await this.response.text()), null, 2));
    //console.log('status ' + this.response.status);                                   
});

Then('The Staff API will return the payload record and status code {int}', async function (int) {
    assert.equal(this.response.status, 400);
});



//Scenario Outline: API to return message - Invalid value provided for header X-Correlation-ID - when X-Correlation-ID header value is not of the uuid format
When('The user calls the School notify staffs API with X-Correlation-ID header value which is not of the uuid format', async function () {
    let schoolCode = '8432';
    console.log('Triggered ' + `${process.env.API_ENDPOINT}/schoolnotify/v1/staffs/${schoolCode}`);
    /*this.response = await restRequest(`${process.env.API_ENDPOINT}/schoolcommsadapter/v1/schools/${schoolCode}`, {
                            httpMethod: "GET",
                            headerOptions: {
                                        "Content-Type": "application/json",
                                        "X-System-ID": `${process.env.DCU_SYSTEM_ID}`,
                                        "X-Correlation-ID" : "1234"
                            },
                            timeOut: 20000
                        });*/
    const path = `/schoolnotify/v1/schools/${schoolCode}`;

    //Not setting here any application header e.g. X-System-ID
    //application header X-Correlation-ID is not in uuid format
    var environment = process.env.TS_ENV ;
    var Systemid = "sct_" + `${environment}`;
    let appHeaders = {
        "X-System-ID": `${Systemid}`,
        "X-Correlation-ID": "1234"
    };
    this.response = await invokeApi(path, appHeaders);
});


Then('The API will return the Error response message -Invalid value provided for header X-Correlation-ID - and status code 400', async function () {
    assert.equal((JSON.parse(await this.response.text()))['Detail'], "Invalid value provided for header X-Correlation-ID");
    assert.equal(this.response.status, 400);
});

//Scenario Outline: API to return "Missing required header X-System-ID" when X-System-ID header value is missing
When('The user calls the School notify staffs API with no header X-System-ID', async function () {
    let schoolCode = '8432';
    console.log('Triggered ' + `${process.env.API_ENDPOINT}/schoolnotify/v1/staffs/${schoolCode}`);
    /*this.response = await restRequest(`${process.env.API_ENDPOINT}/schoolcommsadapter/v1/schools/${schoolCode}`, {
                            httpMethod: "GET",
                            headerOptions: {
                                        "Content-Type": "application/json"
                            },
                            timeOut: 20000
                        });*/
    const path = `/schoolnotify/v1/schools/${schoolCode}`;

    //Not setting here any application header e.g. X-System-ID
    let appHeaders = {};
    this.response = await invokeApi(path, appHeaders);
});


Then('The API will return the Error response message -Missing required header X-System-ID - and status code 400', function () {
    //assert.equal(this.response.data.Detail, "Missing required header X-System-ID");
    assert.equal(this.response.status, 400);
});


//Scenario Outline: API to return 403 when we pass expired or invalid token
When('The user calls the School notify staff API with expired AWS token', async function () {
    var schoolCode = 8432;
    //const endpoint = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev';
    const path = `/schoolnotify/v1/staffs/${schoolCode}`;
    let appHeaders = {};
    this.response = await invokeApiExpiredtoken(path, appHeaders);
                       
});

Then('The Staff API will return error code {int}', async function (int) {
    assert.equal(this.response.status, 403);
});



const invokeApi = async (path, appHeaders) => {
    const headers = {};
    const method = 'get';
    const signedRequest = sigV4Client
        .newClient({
            accessKey: process.env.AWS_ACCESS_KEY_ID,
            secretKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN,
            region: 'ap-southeast-2',
            endpoint: process.env.API_ENDPOINT
        })
        .signRequest({
            method,
            path,
            headers
        });

    console.log(signedRequest.headers);
    const requestHeaders = { ...signedRequest.headers, ...appHeaders };

    const response = await fetch(signedRequest.url, {
        headers: requestHeaders,
        method
    });
    return response;
}


const invokeApiExpiredtoken = async (path, appHeaders) => {
    const headers = {};
    const method = 'get';
    const signedRequest = sigV4Client
        .newClient({
            accessKey: 'ASIA56SSI6HEDQV2DMXE',
            secretKey: 'czUG1M2w3ZIUDrZ6NKJv5fNKaR6M7FtS6Y5yuSTS',
            sessionToken: 'IQoJb3JpZ2luX2VjED0aDmFwLXNvdXRoZWFzdC0yIkYwRAIgCjuejZMejuiq9pMlerR4PTv7fuweH5oe9vGhVXHVMcACIE87FTw077smC6k5yl/4hnUlMaeVayv9it1/KXSZdULzKvcDCIb//////////wEQAxoMOTU5MDI0MDAxNDgwIgy/cvGSmt+2HRsY68gqywNp4PpQp4sdGIiDOeXq9GAdtF2FWQPtdLZPbzY5641Oe9MBmSCwanVBj/j3akDBpO42dnQ6EHs52Gk+YNjqpPGwhfb/l7vd5ILWAT3wXTGyh0rqDkcFQEK5T9kDTHxy1jaV/FyxbgBTioxDGdBTdj+F0lUGeUyRruRISm30f/HstIY9TSwOm2O/hrs2NUMgS/0m5L0iKGXR1WPB6A5d12L+cHr0KYWWxZjYVLlr/IPIltoU13Vv0wzstb9Ga/TgxbVdg2i4kaDk8j5+ZGjLlz1nYu6H6vqMkzwxqrQ3+vGQnyHJoBMaT2Fngahkw1PxizsNYOFd1RAhANipve/GLl2zqoNPGT0/IRHhdq2hVgiNsnaPGBcR1M91Jh3VgbVxpRYVYNRRFVsSl36rXNO7rZqa7ezEFhas+DgHmNSdwy8xfIG0TAqlmaMBcmWP1E0pe8dRtIm/I/doh94fz0LI1d4OLBmZfe/xQ/bPTH7yM8kGbjO/qOR5JeHciE7pdYT8AEt7Uzml15ooj6JbqzLd/PRSnh5Oy/3DvFehq6/p9fiJN69QKKU2Z73mpAkvGxT8T+4Dzd0gS5ljrtQo23ZqkipjAb+MNi0CQHKb/xww/LHWqgY6hQKvwOkk1PAMOLGnSX3VfHahtTtJxQnM9yDhJOuodpugJluqwE9pk9wQeIIp0n0RAe4XSvcJpPre/0gjphCNvkJD2oOC/ANOtXkX6n1UUVHKruAGcI+TqEnLxTymPDUyDOBpbkRqObnlqCNwaGwp5bWCOz0o//+/3UHo+TFtsXTUZU2Z5F8zKfuB+t2S2ch6a7Dx49lbGutQbeU1HeOtHuVDNm6r9oTfTNFp8LcHQG+4KOOncH/8gmEeVPoAakhB1tQnwmga4P02tOONFewUdw2IXooyHqxwYCY3gW6gTImiJ4axRl1QlplZhRVkACritu2LfYj6M1771Btk6qqzfZOFe+dXVdM=',
            region: 'ap-southeast-2',
            endpoint: process.env.API_ENDPOINT
        })
        .signRequest({
            method,
            path,
            headers
        });

    console.log(signedRequest.headers);
    const requestHeaders = { ...signedRequest.headers, ...appHeaders };

    const response = await fetch(signedRequest.url, {
        headers: requestHeaders,
        method
    });
    return response;
}