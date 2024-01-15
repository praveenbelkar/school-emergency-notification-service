const { restRequest, prettyPrintJSON } = require("rest-assured-ts");
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert')
const tunnel = require('tunnel');
var jp = require('jsonpath');

const { sigV4Client } = require("./sigV4Client");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//import * as dotenv from 'dotenv';
//dotenv.config();
require('dotenv').config();

//TODO - remove hard coding
// process.env.API_ENDPOINT = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev'
// process.env.API_ENDPOINT = 'https://da4ui00jc0-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/test'
// process.env.AWS_ACCESS_KEY_ID = ''
// process.env.AWS_SECRET_ACCESS_KEY = ''
// process.env.AWS_SESSION_TOKEN = ''

//Scenario Outline: API to return a single school record when schoolCode exists and match one record
When('The user calls the School notify school API with {string}', async function (string) {
    var schoolCode = string;
    // console.log(schoolCode);
    // console.log('checking AWS_ACCESS_KEY_ID');
    // console.log('AWS_ACCESS_KEY_ID: ' + process.env.AWS_ACCESS_KEY_ID);
    // console.log('AWS_SECRET_ACCESS_KEY: ' + process.env.AWS_SECRET_ACCESS_KEY);
    // console.log('AWS_SESSION_TOKEN: ' + process.env.AWS_SESSION_TOKEN);
    // console.log('API_ENDPOINT: ' + process.env.API_ENDPOINT);
    // console.log('Triggered ' + `${process.env.API_ENDPOINT}/schoolnotify/v1/schools/${schoolCode}`);
    /*this.response = await restRequest(`${process.env.API_ENDPOINT}/schoolcommsadapter/v1/schools/${schoolCode}`, {
                            httpMethod: "GET",
                            headerOptions: {
                                        "Content-Type": "application/json",
                                        "X-System-ID": `${process.env.DCU_SYSTEM_ID}`
                            },
                            timeOut: 20000
                        });*/
    //const endpoint = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev';
    const path = `/schoolnotify/v1/schools/${schoolCode}`;

    var environment = process.env.TS_ENV ;
    var Systemid = "sct_" + `${environment}`;
	let appHeaders = { "X-System-ID": `${Systemid}` };
    this.response = await invokeApi(path, appHeaders);
    //console.log('response ' + JSON.stringify(JSON.parse(await this.response.text()), null, 2));
    //console.log('status ' + this.response.status);                                   
});

Then('The API will return the payload record and status code {int}', async function (int) {
    assert.equal(this.response.status, 200);
    //assert.equal((JSON.parse(await this.response.text()))['SchoolCode'], "8432");
});

Then('Verify schoolcode response {string} {string} {string} {string} {string} {string} {string} {string} {string} {string}', async function (string, string2, string3, string4, string5, string6, string7, string8, string9, string10) {
    apiResponseNQuery = JSON.parse(await this.response.text());
    console.log(apiResponseNQuery);
    var varSchoolFullName = jp.value(apiResponseNQuery, 'SchoolFullName');
    var varSchoolPreschoolIndicator = jp.value(apiResponseNQuery, 'SchoolPreschoolIndicator');
    var varSchoolLevelSubtypeCode = jp.value(apiResponseNQuery, 'SchoolLevelSubtypeCode');
    var varSchoolLevelSubtypeName = jp.value(apiResponseNQuery, 'SchoolLevelSubtypeName');
    var varSchoolEmailAddress = jp.value(apiResponseNQuery, 'SchoolEmailAddress');
    var varSchoolSuburbName = jp.value(apiResponseNQuery, 'SchoolSuburbName');
    var varSchoolPrincipalName = jp.value(apiResponseNQuery, 'SchoolPrincipalName');
    var varSchoolTotalStudents = jp.value(apiResponseNQuery, 'SchoolTotalStudents');
    var varSchoolEmployeeTeachingCount = jp.value(apiResponseNQuery, 'SchoolEmployeeTeachingCount');
    var varSchoolPhoneNumber = jp.value(apiResponseNQuery, 'SchoolPhoneNumber');

    assert.equal(varSchoolFullName, string);
    assert.equal(varSchoolPreschoolIndicator, string2);
    assert.equal(varSchoolLevelSubtypeCode, string3);
    assert.equal(varSchoolLevelSubtypeName, string4);
    assert.equal(varSchoolPhoneNumber, string5);
    assert.equal(varSchoolEmailAddress, string6);
    if (string7 == 'null') {
        assert.equal(varSchoolSuburbName, null);
    }
    else {
        assert.equal(varSchoolSuburbName, string7);
    }
    assert.equal(varSchoolPrincipalName, string8);
    assert.equal(varSchoolTotalStudents, string9);
    assert.equal(varSchoolEmployeeTeachingCount, string10);


});


//Scenario Outline: API to return message - Invalid value provided for header X-Correlation-ID - when X-Correlation-ID header value is not of the uuid format
When('The user calls the School notify school API with X-Correlation-ID header value which is not of the uuid format', async function () {
    let schoolCode = '8432';
    console.log('Triggered ' + `${process.env.API_ENDPOINT}/schoolnotify/v1/schools/${schoolCode}`);
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
When('The user calls the School notify school API with no header X-System-ID', async function () {
    let schoolCode = '8432';
    console.log('Triggered ' + `${process.env.API_ENDPOINT}/schoolnotify/v1/schools/${schoolCode}`);
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

//Scenario Outline: API to return list of all school records
When('The user calls the School notify school API to get all school records', async function () {
    /*this.response = await restRequest(`${process.env.API_ENDPOINT}/schoolcommsadapter/v1/schools`, {
                            httpMethod: "GET",
                            headerOptions: {
                                        "Content-Type": "application/json",
                                        "X-System-ID": `${process.env.DCU_SYSTEM_ID}`
                            },
                            timeOut: 20000
                        });*/
    const path = `/schoolnotify/v1/schools`;
    var environment = process.env.TS_ENV ;
    var Systemid = "sct_" + `${environment}`;
	let appHeaders = { "X-System-ID": `${Systemid}` };
    this.response = await invokeApi(path, appHeaders);

});


Then('The API will return the payload of array of all the school records and status code 200', async function () {
    assert.equal(this.response.status, 200);
    //assert.ok((JSON.parse(await this.response.text()))['Schools'].length > 0);
});


Then('Verify school response for school endpoint {string},{string},{string}', async function (string, string2, string3) {
    apiResponseNQuery = JSON.parse(await this.response.text());
    totalSchoolRecordsReturned = jp.value(apiResponseNQuery, '$.Schools').length;

    var j = 0;

    for (var i = 0; i < totalSchoolRecordsReturned; i++) {

        var varschoolcode = jp.value(apiResponseNQuery, '$.Schools[' + i + '].SchoolCode');
        var varschoolname = jp.value(apiResponseNQuery, '$.Schools[' + i + '].SchoolFullName');
        var varschoolemail = jp.value(apiResponseNQuery, '$.Schools[' + i + '].SchoolEmailAddress');
        if (varschoolcode == string) {
            assert.equal(jp.value(apiResponseNQuery, '$.Schools[' + i + '].SchoolCode'), string);
            j = 1;
        }
        if (varschoolname == string2) {
            assert.equal(jp.value(apiResponseNQuery, '$.Schools[' + i + '].SchoolFullName'), string2);
        }
        if (varschoolemail == string3) {
            assert.equal(jp.value(apiResponseNQuery, '$.Schools[' + i + '].SchoolEmailAddress'), string3);
        }

    }
    //Fail the test if there is no school code found in the response
    if (j == 0) {
        assert.equal(jp.value(apiResponseNQuery, '$.Schools[' + 1 + '].SchoolCode'), string);
    }


});

//Scenario Outline: API to return 400 when we pass incorect schoolcode
When('The user calls the School notify school API with incorrect schoolcode', async function () {
    var schoolCode = 23456;
    //const endpoint = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev';
    const path = `/schoolnotify/v1/schools/${schoolCode}`;

    var environment = process.env.TS_ENV ;
    var Systemid = "sct_" + `${environment}`;
	let appHeaders = { "X-System-ID": `${Systemid}` };
    this.response = await invokeApi(path, appHeaders);                                   
});

Then('The school API will return the payload record and status code {int}', async function (int) {
    assert.equal(this.response.status, 400);
});

//Scenario Outline: API to return 403 when we pass expired or invalid token
When('The user calls the School notify school API with expired AWS token', async function () {
    var schoolCode = 8432;
    //const endpoint = 'https://iq2qa3pkib-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev';
    const path = `/schoolnotify/v1/schools/${schoolCode}`;
    let appHeaders = {};
    this.response = await invokeApiExpiredtoken(path, appHeaders);
                       
});

Then('The school API will return error code {int}', async function (int) {
    assert.equal(this.response.status, 403);
});

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