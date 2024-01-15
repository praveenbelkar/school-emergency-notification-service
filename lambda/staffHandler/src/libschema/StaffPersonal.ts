export interface StaffPersonal {
  StaffPersonalId: string
  LocalId: string
  BirthDate: string
  Title: string
  GivenName: string
  OtherName: string
  FamilyName: string
  FullName: string
  Sex: number
  CanBeTimeTabled: boolean
  UserId: string
  UserGuid: string
  ActiveEmployments: string
  PositionName: string
  PositionTitle: string
  ActiveEntitlements: string
  StatusAuth: string
  Associations: string
  SapEmployeeId: string
  Roles: string
  PepsEmployeeId: string
  Gender: string
  EmploymentStatus: string
  SourceSytem: string
  CanBeTimetabled: boolean
  OtherIdList: OtherIdList
  PersonInfo: PersonInfo
  LocationList: LocationList
  AssignmentList: AssignmentList
}

export interface StaffPersonals {
  StaffPersonal: StaffPersonal[]
}

export interface OtherIdList {
  OtherId: OtherId[]
}

export interface OtherId {
  Type: string
  OtherIdentifier: string
}

export interface PersonInfo {
  OtherNames: OtherNames
  PhoneNumberList: PhoneNumberList
  EmailList: EmailList
}

export interface Email {
  Email: string
  Type: string
}

export interface EmailList {
  Email: Email[]
}

/*export interface Locations {
  ActivePEPLocation: string
  ActiveCEPLocations: number[]
}*/

export interface OtherNames {
  Name: Name[]
}

export interface Name {
  Type: string
  GivenName: string
  FamilyName: string
  OtherName: string
  FullName: string
  Title: string
}

export interface PhoneNumber {
  Type: string
  Number: string
}

export interface PhoneNumberList {
  PhoneNumber: PhoneNumber[]
}

export interface Location {
  LocationCode: string
  LocationType: string
  EmploymentStatus: string
  CanBeTimeTabled: boolean
}

export interface LocationList {
  Location: Location[]
}

export interface AssignmentList {
  Assignment: Assignment[]
}

export interface Assignment {
  LocationCode: string,
  StartDate: string,
  EndDate: string,
  Description: string,
  EmploymentStatus: string,
  PrimaryAssignment: string,
  CanBeTimeTabled: boolean
}