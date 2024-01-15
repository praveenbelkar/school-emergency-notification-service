import { jest, afterEach, describe, expect, it } from '@jest/globals';
import { IdmService } from '../../src/services/idm.service';
import axios from 'axios';

describe('IdmService', () => {

    it('should return a map of (userid, mobile) ', async () => {
        const idmService: IdmService = new IdmService();
        
        jest.spyOn(axios, 'post').mockImplementation( async (url, args, config) => mockIdmData());

        const staffMap: Map<string, string> = await idmService.getIdmData('8232');
        console.log('staffMap in unit test ');
        for(const x of staffMap.entries()) {
            console.log(x);
        }
        expect(staffMap.size).toBe(1);
    });
})

const mockIdmData = () => {
  return Promise.resolve({data: `<?xml version="1.0"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <ns1:getGenericStaffListResponse xmlns:ns1="ws.idmservice.det.nsw.edu.au">
        <return xmlns:ns2="ws.idmservice.det.nsw.edu.au">
          <item>
            <identity>
              <detUserId>Gabby.Rochel</detUserId>
              <identityData>
                <Name>title</Name>
                <Value>Contractor Role</Value>
              </identityData>
              <identityData>
                <Name>personalTitle</Name>
                <Value>Mrs</Value>
              </identityData>
              <identityData>
                <Name>givenname</Name>
                <Value>Gabby</Value>
              </identityData>
              <identityData>
                <Name>sn</Name>
                <Value>Rochel</Value>
              </identityData>
              <identityData>
                <Name>DETDateOfBirth</Name>
                <Value>19810101</Value>
              </identityData>
              <identityData>
                <Name>DETGender</Name>
                <Value>F</Value>
              </identityData>
              <identityData>
                <Name>DETDUDSystemUsername</Name>
                <Value>GROCHEL6</Value>
              </identityData>
              <identityData>
                <Name>DETSAPEmployeeId</Name>
                <Value>09951576</Value>
              </identityData>
              <identityData>
                <Name>DETUserGuid</Name>
                <Value>41c6086b-a878-4a50-81b8-5f2316e92fc2</Value>
              </identityData>
              <contactData>
                <Name>DetAddressResidentialCountry</Name>
                <Value>Australia</Value>
              </contactData>
              <contactData>
                <Name>DetAddressBusinessCountry</Name>
                <Value>Australia</Value>
              </contactData>
              <contactData>
                <Name>DetEmail</Name>
                <Value>Gabby.Rochel@tst.det.nsw.edu.au</Value>
              </contactData>
              <contactData>
                <Name>mail</Name>
                <Value>email@me.com</Value>
              </contactData>
              <contactData>
                <Name>mobile</Name>
                <Value>0456456456</Value>
              </contactData>
              <roles>SCHOOL.TEACHER</roles>
            </identity>
            <schoolStaff>
              <staffData>
                <Name>DETPEPEmployeeId</Name>
                <Value>9951576</Value>
              </staffData>
              <staffData>
                <Name>DETPEPPosLvCodeDesc</Name>
                <Value>Teacher</Value>
              </staffData>
              <staffData>
                <Name>DETPEPPosLvCode</Name>
                <Value>TCH</Value>
              </staffData>
              <staffData>
                <Name>DETPEPParentCode</Name>
                <Value>329</Value>
              </staffData>
              <staffData>
                <Name>DETPEPLocation</Name>
                <Value>8232</Value>
              </staffData>
              <staffData>
                <Name>DETPEPPosNme</Name>
                <Value>Teacher</Value>
              </staffData>
              <staffData>
                <Name>DETPEPEmployeeStatus</Name>
                <Value>C</Value>
              </staffData>
            </schoolStaff>
            <otherStaff>
              <staffData>
                <Name>DETOTHUser</Name>
                <Value>180017808</Value>
              </staffData>
              <staffData>
                <Name>OU</Name>
                <Value>8232</Value>
              </staffData>
              <staffData>
                <Name>employeeStatus</Name>
                <Value>I</Value>
              </staffData>
              <staffData>
                <Name>title</Name>
                <Value>Contractor Role</Value>
              </staffData>
            </otherStaff>
          </item>
        </return>
      </ns1:getGenericStaffListResponse>
    </soap:Body>
  </soap:Envelope>` });

}