/*export interface StaffPersonalEntities {
    staffPersonalEntityList: StaffPersonalEntity[];
}*/

export interface StaffPersonalEntity {
  staff_personal_id: string
  birth_date: any
  title: string
  given_name: string
  other_name: string
  family_name: string
  full_name: string
  sex: number
  can_be_time_tabled: boolean
  user_id: string
  user_guid: string
  active_employments: any
  position_name: string
  position_title: any
  active_entitlements: any
  status_auth: any
  associations: string
  sap_employee_id: string
  roles: any
  peps_employee_id: any
  gender: any
  employment_status: any
  source_system: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  version: string
  StaffPersonalSexType: StaffPersonalSexType
  StaffPersonalEmails: StaffPersonalEmail[]
  StaffPersonalPhoneNumbers: StaffPersonalPhoneNumber[]
  StaffPersonalOtherNames: StaffPersonalOtherName[]
  StaffPersonalLocations: StaffPersonalLocation[]
  StaffPersonalOtherIdentifiers: StaffPersonalOtherIdentifier[]
  StaffAssignments: StaffAssignment[]
}

export interface StaffPersonalSexType {
  id: number
  name: string
  code: string
  description: any
}

export interface StaffPersonalEmail {
  id: string
  staff_personal_id: string
  email: string
  staff_personal_email_type_id: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  StaffPersonalEmailType: StaffPersonalEmailType
}

export interface StaffPersonalEmailType {
  id: number
  name: string
  code: string
  description: any
}

export interface StaffPersonalPhoneNumber {
  id: string
  staff_personal_id: string
  phone_number: string
  staff_personal_phone_number_type_id: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  StaffPersonalPhoneNumberType: StaffPersonalPhoneNumberType
}

export interface StaffPersonalPhoneNumberType {
  id: number
  name: string
  code: string
  description: any
}

export interface StaffPersonalOtherName {
  id: string
  staff_personal_id: string
  type: string
  given_name: string
  other_name: any
  family_name: string
  full_name: any
  title: any
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface StaffPersonalLocation {
  id: string
  staff_personal_id: string
  location_code: string
  location_type: any
  can_be_time_tabled: boolean
  employment_status: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface StaffPersonalOtherIdentifier {
  id: string
  staff_personal_id: string
  type: string
  other_identifier: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface StaffAssignment {
  id: string,
  staff_personal_id: string,
  location_code: string,
  start_date: string,
  end_date: string,
  description: string,
  employment_status: string,
  school_info_ref_id: string,
  primary_assignment: string,
  can_be_time_tabled: boolean
}