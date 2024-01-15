import { StaffPersonalGetService } from 'staffpersonalshandler';
import { StaffPersonalDto, StaffResponse } from './../schema/response.js';
import {StaffPersonals, StaffPersonal, OtherIdList, OtherId, OtherNames, PersonInfo, PhoneNumberList, EmailList, LocationList, AssignmentList, Email} from "../libschema/StaffPersonal.js";
import { IdmService } from './idm.service.js';
import { getLogger } from 'logging';
import * as dotenv from 'dotenv';
dotenv.config();


export class StaffService {
    private staffPersonalGetService: StaffPersonalGetService;
    private idmService: IdmService;
    private static DOE_EMAIL_DOMAIN_PATTERNS_ENV_STR = process.env.ALLOWED_DOE_EMAIL_DOMAINS || '@det.nsw.edu.au\s*$';
    private static DOE_EMAIL_DOMAIN_PATTERNS: RegExp[] = this.DOE_EMAIL_DOMAIN_PATTERNS_ENV_STR.split(", ").map(e => new RegExp(e, "i"));

    constructor(staffPersonalGetService: StaffPersonalGetService, idmService: IdmService) {
        this.staffPersonalGetService = staffPersonalGetService;
        this.idmService = idmService;
    }

    public getStaffsBySchoolCode= async (schoolCode: string): Promise<any> => {
        const logger = getLogger();
        let staffResponse: StaffResponse = <StaffResponse>{};
        
        const staffDataStorePromise:Promise<StaffPersonals> = this.staffPersonalGetService.getAllStaffPersonalByLocationCode(schoolCode);
        const idmDataPromise: Promise<Map<string, string>> =  this.idmService.getIdmData(schoolCode);

        const staffDataPromises = await Promise.allSettled([staffDataStorePromise, idmDataPromise]);
        logger.debug('staffDataPromises status ' + staffDataPromises[0].status + " " + staffDataPromises[1].status)
        try {
            //TODO handle situation when status for these promises is not fulfilled and either or both are in rejected status
            if(staffDataPromises[0].status == 'fulfilled' && (staffDataPromises[1].status == 'fulfilled' || staffDataPromises[1].status == 'rejected')) {
                const staffEntities: StaffPersonals = staffDataPromises[0].value;
                logger.debug('data got from datastore: '+JSON.stringify(staffEntities, null, 2));

                let staffMap  = new Map<string, string>();
                if(staffDataPromises[1].status == 'fulfilled') {
                    staffMap = staffDataPromises[1].value;
                }
                //logger.debug('staffMap.size ' + staffMap.size + " " + JSON.stringify(Array.from(staffMap.entries()), null, 2) );
                const staffPersonalDtos: StaffPersonalDto[] = staffEntities.StaffPersonal
                                                                                         .filter( (staffEntity: StaffPersonal) => this.isNonDoeEmailAddress(staffEntity.PersonInfo?.EmailList))
                                                                                         .filter( (staffEntity: StaffPersonal) => this.isActive(staffEntity?.AssignmentList, staffEntity?.LocationList, schoolCode))
                                                                                         .map( (staffEntity: StaffPersonal) => this.extractStaffEntityData(staffEntity, staffMap, schoolCode));

                staffResponse.Staffs = staffPersonalDtos;
                logger.debug('staffPersonals response ' + JSON.stringify(staffResponse, null, 2));
            }
        } catch(error) {
            logger.error('error ' + error);
        }
        return staffResponse;

    }

    private extractStaffEntityData = (staffEntity: StaffPersonal, staffMap: Map<string, string>, schoolCode: string): StaffPersonalDto => { 
        let staffPersonal: StaffPersonalDto = <StaffPersonalDto>{};
        staffPersonal.StaffIdentifier = staffEntity.StaffPersonalId;
        staffPersonal.StaffTitleTypeCode =  staffEntity.Title;
        staffPersonal.StaffGivenName = staffEntity.GivenName;
        staffPersonal.StaffMiddleName = staffEntity.OtherName;
        staffPersonal.StaffFamilyName = staffEntity.FamilyName;
        staffPersonal.StaffFullName = staffEntity.FullName;
    
        const email: string | undefined = this.getEmail(staffEntity.PersonInfo?.EmailList);
        staffPersonal.StaffDoEEmailAddress = (email != undefined) ? email : null;
    
        staffPersonal.StaffDoEUserIdentifier = staffEntity.UserId;
    
        const phone: string | undefined = this.getPhoneNumber(staffEntity.PersonInfo?.PhoneNumberList);
        staffPersonal.StaffPhoneNumber = (phone != undefined) ? phone : null;
    
        const mobile: string | undefined = staffMap?.get(staffEntity.UserId);
        staffPersonal.StaffMobileNumber = (mobile != undefined) ? mobile : null;
    
        staffPersonal.EmploymentStatus = 'Active'; 
    
        return staffPersonal;
    }
    
    private getEmail = (emailList: EmailList): string | undefined => {        
        return (emailList?.Email?.find( (email:Email) => email.Type == 'Primary')?.Email);
    }
    
    private getPhoneNumber(phoneNumberList: PhoneNumberList): string | undefined  {        
        return phoneNumberList?.PhoneNumber?.find(phoneNumber => phoneNumber.Type == 'Work' || phoneNumber.Type == 'WorkMobile')?.Number;
    }
    
    private isActive = (assignmentList: AssignmentList, locationList: LocationList, schoolCode: string): boolean => {
        let activeInAssignmentList: boolean = false;
        let activeInLocationList: boolean = false;
    
        activeInAssignmentList = assignmentList?.Assignment?.find(assignment => assignment.LocationCode == schoolCode)?.EmploymentStatus == 'A';
        activeInLocationList = locationList?.Location?.find(location => location.LocationCode == schoolCode)?.EmploymentStatus == 'A';
        return activeInLocationList || activeInAssignmentList;
    }

    private isNonDoeEmailAddress = (emailAddressList: EmailList): boolean => {
        //return emailAddressList?.Email?.find(email => StaffService.DOE_EMAIL_DOMAIN_PATTERN.test(email.Email))? true: false; 
        //return emailAddressList?.Email?.some(email => StaffService.DOE_EMAIL_DOMAIN_PATTERNS.test(email.Email))
        return emailAddressList?.Email?.some(email =>
            StaffService.DOE_EMAIL_DOMAIN_PATTERNS.some(DOE_EMAIL_DOMAIN_PATTERN => DOE_EMAIL_DOMAIN_PATTERN.test(email.Email)));
    }
    
    
    
    private removeWhiteSpaces = (str: any): string => {            
      return JSON.stringify(str);
    }
  
}
