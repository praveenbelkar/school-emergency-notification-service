const xmldoc = require('xmldoc');;
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { getLogger } from 'logging';
import { idmSoapRequestTemplate } from "../config/idmSoapRequestTemplate.js";
import { getSoapUserName, getSoapPassword } from './secrets';
import * as dotenv from 'dotenv';
dotenv.config();

export class IdmService {

  public getIdmData = async (schoolCode: string): Promise<Map<string, string>> => {
    const logger = getLogger();
  
    const url: string = process.env.SOAP_URL || "TEST";
    const username: string = getSoapUserName() || "TEST";
    const password: string = getSoapPassword() || "TEST";
    const basicAuth: string = "Basic " + btoa(username + ":" + password);
    const DELAY_RETRY_INTERVAL: string = process.env.DELAY_RETRY_INTERVAL || "500";
    const RETRY_ATTEMPT: string = process.env.RETRY_ATTEMPT || "3";
    const IDM_SOAP_CALL_TIMEOUT: string = process.env.IDM_SOAP_CALL_TIMEOUT || "1000";
    const HTTP_PROXY: string = process.env.HTTP_PROXY || 'http://proxy.det.nsw.edu.au:80';
    const agent = new HttpsProxyAgent(HTTP_PROXY);
    const isLocal = process.env.LOCAL ? true : false;
  
    const config: any = {
      headers: { "Content-Type": "text/xml", "Authorization": basicAuth },
      timeout: parseInt(IDM_SOAP_CALL_TIMEOUT),
      proxy: false,
      httpsAgent: agent
    };
  
    //let args: string = idmSoapRequestTemplate('8232');
    let args: string = idmSoapRequestTemplate(schoolCode);
    logger.debug("Calling Idm WebService with args " + args);
    let xmlResult = null;
    axiosRetry(axios, {
      retries: parseInt(RETRY_ATTEMPT),
      retryCondition: () => true,
      retryDelay: (retryCount) => {
        return parseInt(DELAY_RETRY_INTERVAL);
      },
      shouldResetTimeout: true,
      onRetry: (retryCount, error, requestConfig) => {
        logger.error("Retrying Idm WebServic call : retryCount  : " + retryCount);
      },
    });
    /*delete process.env['http_proxy'];
    delete process.env['HTTP_PROXY'];
    delete process.env['https_proxy'];
    delete process.env['HTTPS_PROXY'];*/
  
    if (!isLocal) {
      console.log('deleting the proxy');
      delete config.proxy;
      delete config.httpsAgent;
    }
  
    try {
      xmlResult = await axios.post(url, args, config);
      let idmData: Map<string, string> = new Map<string, string>();
      if (xmlResult && xmlResult.data) {
        logger.debug("Data Got from webservice" + `${xmlResult.data}`);
        idmData = this.extractIdmDataFromSoapResponse(xmlResult.data);
      }
      return idmData;
    } catch (e) {
      logger.error('Error invoking Web Service ' + e);
      throw new Error("Error invoking Web Service");
    }
  
  }
  
  private extractIdmDataFromSoapResponse = (idmDataXml: any): Map<string, string> => {
    const logger = getLogger();
    let rootNode = null;
    try {
      rootNode = new xmldoc.XmlDocument(idmDataXml);
    } catch (e: any) {
      logger.error("Error while parsing the data " + e);
      throw e;
    }
  
    const soapNode = rootNode.childNamed("soap:Body");
    const returnNode = rootNode.descendantWithPath("soap:Body.ns1:getGenericStaffListResponse.return");
    const itemNodes = returnNode.childrenNamed("item");
  
    const staffMap = new Map<string, string>();
    for (const itemNode of itemNodes) {
      const identityNode = itemNode.childNamed("identity");
      const detUserId = identityNode.childNamed("detUserId");
      if (detUserId != null) {
        const contactDataNodes = identityNode.childrenNamed("contactData");
        const mobileArr = contactDataNodes.filter((contactData: any) => {
          return (contactData.childNamed("Name").val === "mobile");
        })
          .map((contactDataForMobile: any) => contactDataForMobile.childNamed("Value").val);
        const mobile = (mobileArr && mobileArr[0]) || null;
        if (mobile != null) {
          staffMap.set(detUserId.val, mobile);
        }
      }
    }
  
    return staffMap;
  }
}

