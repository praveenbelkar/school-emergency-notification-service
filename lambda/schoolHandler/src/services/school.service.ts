import { DomainApiService } from "./domainApi.service.js";
import { SchoolDetails } from "./../models/schoolDetails.model.js";
import { SchoolMetaData, SchoolAllMetaData } from "./../models/schoolAllMetadata.model.js";
import { Service } from 'typedi';
import { createLogger, getLogger, LogLevel } from 'logging';
import { Utils } from "./../common/utils.js";

@Service({ id: 'school.service'})
class SchoolService {

    constructor(
        private readonly domainApiService: DomainApiService
    ) {}


    async getSingleSchool(schoolCode: string): Promise<SchoolDetails> {
        const logger = Utils.createLogger();
        logger.debug('inside schoolService: getSingleSchool');

        const srdSchoolDataPromise = this.domainApiService.getSingleSchoolData(schoolCode, "SRD");
        const amsSchoolDataPromise = this.domainApiService.getSingleSchoolData(schoolCode, "AMS");

        try {
            const schoolDataPromises = await Promise.allSettled([srdSchoolDataPromise, amsSchoolDataPromise]);
            const aggregateData = [];
            if(schoolDataPromises[0].status == 'fulfilled') {
                aggregateData.push(schoolDataPromises[0].value);
            }
            if(schoolDataPromises[0].status == 'fulfilled' && schoolDataPromises[1].status == 'fulfilled') {
                aggregateData.push(schoolDataPromises[1].value);
            }

            const schoolDatas = aggregateData.flat();

            if(!schoolDatas || schoolDatas.length == 0) {
                logger.error('no data');
                throw ({
                    statusCode: '400',
                    detail: 'No school found'
                });
            }
            const srdSchoolData = schoolDatas[0];
            const amsSchoolData = schoolDatas.length > 1 ? schoolDatas[1]: {};

            let schoolDetails: SchoolDetails = new SchoolDetails();
            schoolDetails.SchoolCode = srdSchoolData.schoolCode;
            schoolDetails.SchoolFullName = srdSchoolData.schoolFullName;
            schoolDetails.SchoolPreschoolIndicator = srdSchoolData.schoolPreschoolIndicator;
            schoolDetails.SchoolLevelSubtypeCode = srdSchoolData.schoolLevelSubtypeCode;
            schoolDetails.SchoolLevelSubtypeName = srdSchoolData.schoolLevelSubtypeName;  // scope - 2
            schoolDetails.SchoolPhoneNumber = srdSchoolData.schoolPhoneNumber;
            schoolDetails.SchoolEmailAddress = srdSchoolData.schoolEmailAddress;
            schoolDetails.SchoolSuburbName = srdSchoolData.schoolSuburbName;
            schoolDetails.SchoolPrincipalName = srdSchoolData.schoolPrincipalName; // scope - 2
            schoolDetails.SchoolTotalStudents = srdSchoolData.schoolTotalStudents; // scope - 2

            schoolDetails.SchoolEmployeeTeachingCount = amsSchoolData.schoolEmployeeTeachingCount;

            return schoolDetails;

        } catch(e) {
            logger.error('SchoolService: getSingleSchool - Error when domainApiService is invoked with schoolCode ' + schoolCode );

            //TODO throw error indicating error 500
            throw e;
        }

    }

    async getAllSchools(): Promise<SchoolAllMetaData> {
        const schoolAllMetadata:SchoolAllMetaData = new SchoolAllMetaData();
        const allSchoolMetaData = await this.domainApiService.getAllSchoolMetaData();
        schoolAllMetadata.Schools = allSchoolMetaData.flat()
                                                     .filter(apiSchoolMetaData => apiSchoolMetaData.schoolSectorTypeName == 'Government')
                                                     .map(apiSchoolMetaData => {
                                                            const schoolMetaData: SchoolMetaData = new SchoolMetaData();
                                                            schoolMetaData.SchoolCode = apiSchoolMetaData.schoolCode;
                                                            schoolMetaData.SchoolFullName = apiSchoolMetaData.schoolFullName;
                                                            schoolMetaData.SchoolEmailAddress = apiSchoolMetaData.schoolEmailAddress;
                                                            return schoolMetaData;
                                                     });
        return schoolAllMetadata;
    }

}

export { SchoolService };