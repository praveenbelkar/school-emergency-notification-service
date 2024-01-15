variable "env" {
  type = string
}

variable "vpc_id" {
  type = string
  description = "VPC ID where this API Gateway should be accessed from"
}

variable "vpce_id" {
  type = string
  description = "VPC Endpoint ID where this API Gateway should be accessed from"
}

variable "tags" {
  description = "A mapping of tahs to assign the resource"
  type = map(string)
  default = {}
}

variable "azure_tenant_id" {
  type = string
  description = "Azure Tentnat ID"
}

variable "azure_application_id" {
  type = string
  description = "Azure Application ID"
}

variable "icc_vpce_id" {
  type = string
  description = "icc VPC Endpoint ID where this API Gateway should be accessed from"
}

variable "dcu_vpce_id" {
  type = string
  description = "dcu VPC Endpoint ID where this API Gateway should be accessed from"
}

variable "dcu_lambda_role_arn" {
  type = string
  description = "ARN of the role assumed by the dcu lambda invoking API gateway"
}

variable "SystemName" {
  type = string
}

variable "logging_version" {
  type = string
  description = "Structured Logging lib version for the lambda deployment dependency layer "
}

variable "nodejs-postgres-layer-version" {
  type = string
  description = "nodejs-postgres-layer lib version for the lambda deployment dependency layer "
}

variable "log_level" {
  type = string
  description = "Log level for lambda functions"
  default = "info"
}

variable "PAGE_NUMBER" {
  type = string
  description = "Total number of pages to be queried to get paginated response for school"
}

variable "DCU_SYSTEM_ID" {
  type = string
  description = "The value for the header X-System-ID"
}

variable "DOMAIN_SCHOOL_TOKEN_SERVICE_URL" {
  type = string
  description = "The url to get the authentication token needed for domain school api"
}

variable "DOMAIN_SCHOOL_TOKEN_AMS_SCOPE" {
  type = string
  description = "The ams value used in scope while fetching the token needed for domain school api"
}

variable "DOMAIN_SCHOOL_TOKEN_SRD_SCOPE" {
  type = string
  description = "The srd value used in scope while fetching the token needed for domain school api"
}

variable "DOMAIN_SCHOOL_ALL_SCHOOL_REQUEST_URL" {
  type = string
  description = "The domain school service url to get all the school information"
}

variable "DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL" {
  type = string
  description = "The domain school service url to get a single school information"
}

variable "DSM_STUDENT_CONTACT_API_URI" {
  type = string
  description = "The dsm student contact api url to get list of contacts of all the students in a given school"
}

variable "staff_db_username" {
  type = string
  default = "dummy"
}

variable "staff_db_password" {
  type = string
  default = "dummy"
}

variable "staff_domain" {
  description = "The staff domain API configuration"
  type = map(string)
}

variable "staff_data_lib" {
  description = "The staff data access library configuration"
  type = map(string)
}

variable "idm_webservice" {
  description = "idm web service configuration"
  type = map(string)
}

variable "node_options" {
  type = string
  description = "Node options for lambda functions"
  default = "--enable-source-maps"
}

variable "secrets_manager_endpoint" {
  type = string
  description = "The of secrets manager endpoint"
  default = null
}

variable "vpc_subnet_ids" {
  type = list
  description = "The vpc subnet ids"
  default = null
}

variable "vpc_security_group_ids" {
  type = list
  description = "The vpc security group ids"
  default = null
}

variable "relative_project_path" {
  description = "The relative path to the project root"
  type = string
  default = "../../../../.."
}

