interface PersonInfoName {
  Type: string;
  Title: string;
  FamilyName: string;
  GivenName: string;
  FullName: null | string;
}

interface PersonInfoOtherName {
  Type: string;
  FamilyName: string;
  GivenName: string;
}

interface PersonInfoLanguage {
  LanguageType: string;
  Code: string;
}

interface PersonInfoPhoneNumber {
  Type: string;
  Number: string;
  Preference: string;
}

interface PersonInfoEmail {
  Type: string;
  value: string;
}

interface PersonInfoAddress {
  Role: string;
  Type: string;
  EffectiveFromDate: string;
  EffectiveToDate: string;
  Street: {
    Line1: string;
    Line2: null | string;
  };
  City: string;
  StateProvince: string;
  Country: string;
  PostalCode: string;
}

interface Relationship {
  Code: string;
  OtherCodeList: {
    OtherCode: {
      Codeset: string;
      value: string;
    }[];
  };
}

interface ContactFlags {
  LivesWith: string;
  ReceivesAssessmentReport: string;
  EmergencyContact: string;
  HasCustody: string;
  FeesBilling: string;
  InterventionOrder: string;
  financiallyInterested: string;
  blockDigitalAccess: string;
}

interface Relationships {
  StudentContactRelationshipRefId: string;
  StudentPersonalRefId: string;
  SRN: string;
  Relationship: Relationship;
  HouseholdList: {
    Household: string[];
  };
  ContactFlags: ContactFlags;
  ContactSequence: string;
  FamilyId: string;
  RelationshipType: string;
  RelationshipCode: string;
  OtherCourtOrderNonAVO: string;
}

interface PersonInfo {
  Name: PersonInfoName;
  OtherNames: {
    Name: PersonInfoOtherName[];
  };
  Demographics: {
    Sex: string;
    LanguageList: {
      Language: PersonInfoLanguage[];
    };
  };
  PhoneNumberList: {
    PhoneNumber: PersonInfoPhoneNumber[];
  };
  EmailList: {
    Email: PersonInfoEmail[];
  };
  HouseholdContactInfoList: {
    HouseholdContactInfo: {
      PreferenceNumber: string;
      HouseholdContactId: string;
      HouseholdSalutation: string;
      AddressList: {
        Address: PersonInfoAddress[];
      };
      PhoneNumberList: {
        PhoneNumber: PersonInfoPhoneNumber[];
      };
      EmailList: {
        Email: PersonInfoEmail[];
      };
    }[];
  };
}

interface Metadata {
  LastModified: string;
}

/**
 * Represents a contact relationship between a Carer
 * and any students they are related to under relationships.
 */
export interface ContactRelationship {
  RefId: string;
  LocalId: string;
  stampedParentId: string;
  serviceNswTransactionId: string;
  PersonInfo: PersonInfo;
  interpreterRequiredIndicator: string;
  aliveIndicator: string;
  aliveLastModified: string;
  metadata: Metadata;
  /**
   * The students related to the carer.
   */
  Relationships: Relationships[];
}
