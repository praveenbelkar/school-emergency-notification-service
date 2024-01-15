import { jest, afterEach, describe, expect, it } from '@jest/globals';
import { EmailList, LocationList, PersonInfo, StaffPersonalGetService } from 'staffpersonalshandler';
import { StaffService } from '../../src/services/staff.service.js';
import { StaffPersonals, StaffPersonal } from 'staffpersonalshandler';
import { Location } from 'staffpersonalshandler';
import { IdmService } from '../../src/services/idm.service.js';
import { StaffResponse } from '../../src/schema/response.js';

describe('Staff service ', () => {

    it('should return array of staffs for valid input', async () => {

            let staffPersonalGetService: InstanceType<typeof StaffPersonalGetService> = new StaffPersonalGetService();
            jest.spyOn(staffPersonalGetService, 'getAllStaffPersonalByLocationCode').mockImplementation((_locationCode: string) => mockStaffResponse());

            let idmService: IdmService = new IdmService();
            jest.spyOn(idmService, 'getIdmData').mockImplementation( (schoolCode: string) => mockIdmResponse());

            let staffService: StaffService = new StaffService(staffPersonalGetService, idmService);
            let staffResponse: StaffResponse = await staffService.getStaffsBySchoolCode('8232');
            console.log('$$$$$$$$$$$$$ '+JSON.stringify(staffResponse, null, 2));            

            expect(staffResponse.Staffs.length).toBe(1);
            expect(staffResponse.Staffs[0].StaffGivenName).toBe('Tom');
            expect(staffResponse.Staffs[0].EmploymentStatus).toBe('Active');        
    });

});


const mockStaffResponse = () : Promise<StaffPersonals> => {
    let staffPersonals: StaffPersonals = <StaffPersonals>{};
    
    let staffPersonal1: StaffPersonal = <StaffPersonal>{};
    staffPersonal1.UserId = 'tom.holland';
    staffPersonal1.GivenName = 'Tom';
    
    let location1: Location = <Location>{};
    location1 = {LocationCode: "8232", LocationType: "", EmploymentStatus: "A", CanBeTimeTabled: true};  
    let locationList1: LocationList = <LocationList>{};
    locationList1.Location = [location1];
    staffPersonal1.LocationList = locationList1;
    
    let personInfo1: PersonInfo = <PersonInfo>{};
    let emailList1: EmailList = <EmailList>{};
    emailList1.Email = [{Email: "tom.holland@det.nsw.edu.au", Type: "Primary"}];
    personInfo1.EmailList = emailList1;
    staffPersonal1.PersonInfo = personInfo1;
    
    let staffPersonal2: StaffPersonal = <StaffPersonal>{};
    staffPersonal2.UserId = 'david.warner';
    staffPersonal2.GivenName = 'david';
    
    let location2: Location = <Location>{};
    location2 = {LocationCode: "8232", LocationType: "", EmploymentStatus: "I", CanBeTimeTabled: true};  
    let locationList2: LocationList = <LocationList>{};
    locationList2.Location = [location2];
    staffPersonal2.LocationList = locationList2;    

    let staffPersonal3: StaffPersonal = <StaffPersonal>{};
    staffPersonal3.UserId = 'robert.downey';
    staffPersonal3.GivenName = 'Robert';
    
    let location3: Location = <Location>{};
    location3 = {LocationCode: "8232", LocationType: "", EmploymentStatus: "A", CanBeTimeTabled: true};  
    let locationList3: LocationList = <LocationList>{};
    locationList3.Location = [location3];
    staffPersonal3.LocationList = locationList3;
    
    let personInfo3: PersonInfo = <PersonInfo>{};
    let emailList3: EmailList = <EmailList>{};
    emailList3.Email = [{Email: "robert.downey@gmail.com", Type: "Primary"}];
    personInfo3.EmailList = emailList3;
    staffPersonal3.PersonInfo = personInfo3;
    
    staffPersonals.StaffPersonal = [staffPersonal1, staffPersonal2, staffPersonal3];
    return Promise.resolve(staffPersonals);
};

const mockIdmResponse = () : Promise<Map<string, string>> => {
    const staffMap = new Map<string, string>();
    staffMap.set('tom.holland', '0456456456');
    return Promise.resolve(staffMap);
} 