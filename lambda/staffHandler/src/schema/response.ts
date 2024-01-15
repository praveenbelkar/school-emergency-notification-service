export interface StaffPersonalDto {
    StaffTitleTypeCode: string | null
    StaffGivenName: string | null
    StaffMiddleName: string | null
    StaffFamilyName: string | null
    StaffFullName: string | null
    StaffDoEEmailAddress?: string | null
    StaffDoEUserIdentifier: string
    StaffPhoneNumber?: string | null
    StaffMobileNumber?: string | null
    StaffIdentifier: string
    EmploymentStatus: string | null
}

export interface StaffResponse {
    Staffs: StaffPersonalDto[]
}