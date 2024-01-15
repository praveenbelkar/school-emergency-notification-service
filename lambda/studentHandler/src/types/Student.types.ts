export interface StudentResponse {
  Carers: Carer[]
}

export interface Carer {
  RefId: string
  FullName: string
  Contacts: Contact[]
}

export interface Contact {
  Value: string
  Type: string
}

