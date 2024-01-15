import { Carer, Contact, StudentResponse } from "../types/Student.types.js";
import { getLogger } from 'logging';
const https = require('https');
import proxy from "node-global-proxy";

const endpoint = process.env.DSM_STUDENT_CONTACT_API_URI + '/v3/StudentContactRelationships';
const isLocal = process.env.LOCAL ? true : false;

export class StudentService {
  public getBySchoolCode = async (schoolCode: string, scholasticYear: string): Promise<any> => {

    let navigationPage = 1;
    let lastPage = 1;
    const logger = getLogger();

    if(isLocal) {
      console.log('executing in local');
      proxy.setConfig("http://proxy.det.nsw.edu.au:80");
      proxy.start();
    }

    let aggregatedStudentContactRelationships: any = [];
    try {
      let requestOption: any = this.createHttpsRequest(navigationPage, scholasticYear, schoolCode);
      let firstPageResponse: any = await this.doRequest(requestOption);
      lastPage = firstPageResponse?.headers?.navigationlastpage;
      logger.debug(`lastPage: ${lastPage}`);      

      aggregatedStudentContactRelationships.push(firstPageResponse?.body?.StudentContactRelationships?.StudentContactRelationship);

      const responsePromises: Promise<any>[] = [];
      if (lastPage > 1) {
        for (let index: number = 2; index <= lastPage; index++) {
          let paginatedRequestOptions: any = this.createHttpsRequest(index, scholasticYear, schoolCode);
          let responsePromise: Promise<any> = this.doRequest(paginatedRequestOptions);
          responsePromises.push(responsePromise);
        }

        const pageResponses = await Promise.all(responsePromises);
        pageResponses.map(pageResponse => {
          aggregatedStudentContactRelationships.push(pageResponse?.body?.StudentContactRelationships?.StudentContactRelationship);
        });

      }

      aggregatedStudentContactRelationships = aggregatedStudentContactRelationships?.flat();
      logger.info('Total number of records got from DSM Api: ' + aggregatedStudentContactRelationships?.length);

      const studentResponse: StudentResponse = this.transform(aggregatedStudentContactRelationships);

      logger.info('Total number of records being returned after applying filter (for indicators) ' + studentResponse?.Carers?.length);

      return studentResponse;
    } catch (e: any) {
      logger.error('Got error while making call ' + e);
    }
  }

  private transform = (studentContactRelationships: any): StudentResponse => {
    const logger = getLogger();
    type FilteredRecord = { refId: string, custody: boolean, interventionOrder: boolean, otherCourtNonAVO: boolean, contactSequence: boolean};
    const filteredRecords: FilteredRecord[] = [];

    const carers: Carer[] = studentContactRelationships
      .filter((studentContactRelationship: any) => {
        const hasCustodyForAnyRelationship: boolean = studentContactRelationship?.Relationships?.find((relationShip: any) => relationShip?.ContactFlags?.HasCustody == 'Y') ? true : false;
        const hasNoInterventionOrderForAnyRelationship: boolean = studentContactRelationship?.Relationships?.find((relationShip: any) => relationShip?.ContactFlags?.InterventionOrder == 'N') ? true : false;
        const hasNoOtherCourtOrderNonAVOForAnyRelationship: boolean = studentContactRelationship?.Relationships?.find((relationShip: any) => relationShip?.OtherCourtOrderNonAVO == 'N') ? true : false;
        const hasPreferredContactSequenceForAnyRelationship: boolean = studentContactRelationship?.Relationships?.find((relationShip: any) => (relationShip?.ContactSequence == '1' || relationShip?.ContactSequence == '2')) ? true : false;

        if( !(hasCustodyForAnyRelationship && hasNoInterventionOrderForAnyRelationship && hasNoOtherCourtOrderNonAVOForAnyRelationship && hasPreferredContactSequenceForAnyRelationship) ) {          
          filteredRecords.push({refId: studentContactRelationship?.RefId, custody: hasCustodyForAnyRelationship, interventionOrder: hasNoInterventionOrderForAnyRelationship, otherCourtNonAVO: hasNoOtherCourtOrderNonAVOForAnyRelationship, contactSequence: hasPreferredContactSequenceForAnyRelationship });
        }
        return hasCustodyForAnyRelationship && hasNoInterventionOrderForAnyRelationship && hasNoOtherCourtOrderNonAVOForAnyRelationship && hasPreferredContactSequenceForAnyRelationship;
      })
      .map((studentContactRelationship: any) => {
        let carer: Carer = <Carer>{};
        carer.RefId = studentContactRelationship?.RefId;
        carer.FullName = studentContactRelationship?.PersonInfo?.Name?.FullName || (studentContactRelationship?.PersonInfo?.Name?.Title + ' ' + studentContactRelationship?.PersonInfo?.Name?.GivenName + ' ' + studentContactRelationship?.PersonInfo?.Name?.FamilyName);
        const contacts: Contact[] = [];

        const phoneNumberList: any = studentContactRelationship?.PersonInfo?.PhoneNumberList?.PhoneNumber;
        const phoneNumber: any = phoneNumberList?.find(
          (phoneNumber: any) => phoneNumber?.Preference === "1"
        );

        if (phoneNumber) {
          const phoneContact: Contact = <Contact>{
            Type: "mobile",
            Value: phoneNumber?.Number,
          }
          contacts.push(phoneContact);
        }

        const emailList: any = studentContactRelationship?.PersonInfo?.EmailList?.Email;
        if (emailList && emailList.length > 0) {
          let emailAddress: any = emailList[0];
          const emailContact: Contact = <Contact>{
            Type: "email",
            Value: emailAddress?.value
          }
          contacts.push(emailContact);
        }

        carer.Contacts = contacts;
        return carer;
      });
    
    logger.debug('Filtered Records: ' + JSON.stringify(filteredRecords));

    let studentResponse: StudentResponse = <StudentResponse>{};
    studentResponse.Carers = carers;
    return studentResponse;
  }

  private doRequest = (options: any) => {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res: any) => {

        res.setEncoding('utf8');
        let responseBody = '';

        res.on('data', (chunk: any) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          const response = {headers: res.headers, status: res.statusCode, body: responseBody ? JSON.parse(responseBody): {}};
          resolve(response);
        });
      });

      req.on('error', (err: any) => {
        reject(err);
      });

      //req.write(data)
      req.end();
    });
  }


  private createHttpsRequest = (navigationPage: number, scholasticYear: string, schoolCode: string) => {
    /*const signedHeaders = sigV4ASignBasic(method, endpoint, service);
    console.log('signedHeaders ' + JSON.stringify(signedHeaders._flatten(), null, 2));
    const flattenedSignedHeaders = signedHeaders._flatten();*/
    const flattenedSignedHeaders: any = [];
    const zoneIdHeaderArr = ["zoneId", "urn:www.dec.nsw.gov.au:school:" + schoolCode];
    const timestampHeaderArr = ["timestamp", new Date().toISOString()];
    flattenedSignedHeaders.push(zoneIdHeaderArr);
    flattenedSignedHeaders.push(timestampHeaderArr);
    console.log('flattenedSignedHeaders ' + flattenedSignedHeaders);

    const queryParams: string = `navigationPage=${navigationPage}&navigationPageSize=500&relationshiptype=Parent&scholasticYears=${scholasticYear}`;
    const url = new URL(endpoint + '?' + queryParams);
    console.log('url.pathname ' + url.pathname + ' url.searchParams' + url.searchParams + ' url host ' + url.hostname);


    const options = {
      hostname: url.hostname, //'petstore.swagger.io',//url.hostname, //signedHeaders.get('host'),
      path: url.pathname + '?' + url.searchParams,
      method: 'GET',
      headers: { "zoneId": "urn:www.dec.nsw.gov.au:school:" + schoolCode, "timestamp": new Date().toISOString() }
    };
    return options;
  }

}

