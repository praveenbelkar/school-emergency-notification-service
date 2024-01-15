env = "Dev"
log_level = "debug"
SystemName = "SchoolCommsAdapter"
PAGE_NUMBER = "12"
DCU_SYSTEM_ID = "sct_dev"

DOMAIN_SCHOOL_TOKEN_SERVICE_URL = "https://icc-domain-api-dev.auth.ap-southeast-2.amazoncognito.com/oauth2/token"
DOMAIN_SCHOOL_TOKEN_AMS_SCOPE = "api/access app:domapi:amsschool/access"
DOMAIN_SCHOOL_TOKEN_SRD_SCOPE = "api/access app:domapi:srdschool/access"
DOMAIN_SCHOOL_ALL_SCHOOL_REQUEST_URL = "https://school.integration.dev.education.nsw.gov.au/v1/schools/search?limit=200&page="
DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL = "https://school.integration.dev.education.nsw.gov.au/v1/schools/search?page=1&limit=200"
DSM_STUDENT_CONTACT_API_URI = "https://3a82n6xa7c.execute-api.ap-southeast-2.amazonaws.com/test"

staff_domain = {
  log_level              = "debug"
  lambda_timeout_in_secs  = "15"  
}

staff_data_lib = {  
  db_host                = "staff-service-datastore.celnbbrrigdm.ap-southeast-2.rds.amazonaws.com"
  db_port                = "5432"
  db_name                = "staff_service_datastore"
  connection_pool_max    = "5"
  connection_acquire_timeout_in_ms = "1000"
  retry_timeout_in_ms     = "3000",
  allowed_doe_email_domains = "@det.nsw.edu.au\\s*$, @tst.det.nsw.edu.au\\s*$"
}

idm_webservice = {
  soap_url = "https://idmsrv-test.apps.d0.ocp.dev.education.nsw.gov.au/IDMService/IDMServiceFacadeService/IDMServiceFacadeBean?wsdl"
  idm_soap_call_timeout = "5000"
}

vpc_id = "vpc-0457ae753c51d7bd3"

vpce_id = "vpce-0aa0a91876a527df1"

dcu_vpce_id = "vpce-0905392389ed680cd"

icc_vpce_id = "vpce-011874783ab159a09"

dcu_lambda_role_arn = "arn:aws:iam::931435798542:role/nswdoe-schoolcomms-api-se-SchoolCommsLambdaExecutio-ZKz0QdRZxBmv"

vpc_subnet_ids = ["subnet-0ac3676ee08c30ecb", "subnet-0a79172ae8e6b328f", "subnet-0f1b7e921d0f717ab"]

vpc_security_group_ids = ["sg-05372648d9cc736b3", "sg-090d3bd5204a04b00"]

azure_tenant_id = "2f3556d6-2e54-4678-abaa-917c9f08a197"

azure_application_id = "21142949-78e7-472e-b3e5-d345646195ff"

logging_version ="10"

nodejs-postgres-layer-version = "3"

tags = {
  cir_app_id                 = "ischem"
  cir_dataclass              = "sensitive"
  Integration-Env            = "Dev"
  Integration-Component-Name = "SchoolNotifyAdapter"
  Integration-Version        = "v1"
  Integration-Branch         = "main"
  Integration-User           = "praveen.belkar@det.nsw.edu.au"
  Integration-Repository     = "https://bitbucket.org/nsw-education/schoolemergencynotificationservice"
}
