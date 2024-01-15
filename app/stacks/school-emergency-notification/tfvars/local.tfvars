env = "Local"
SystemName = "SchoolCommsAdapter"
PAGE_NUMBER = "12"
DCU_SYSTEM_ID = "sct_dev"


DOMAIN_SCHOOL_TOKEN_SERVICE_URL = "https://icc-domain-api-dev.auth.ap-southeast-2.amazoncognito.com/oauth2/token"
DOMAIN_SCHOOL_TOKEN_SERVICE_CLIENT_ID = "55v9stn01d8gc1p050v6139ou7"
DOMAIN_SCHOOL_TOKEN_SERVICE_CLIENT_SECRET = "7hbtimvp6edr6vtdvoc185nvc163f9u3lqekssb9jkvdhisb4pr"
DOMAIN_SCHOOL_TOKEN_AMS_SCOPE = "api/access app:domapi:amsschool/access"
DOMAIN_SCHOOL_TOKEN_SRD_SCOPE = "api/access app:domapi:srdschool/access"
DOMAIN_SCHOOL_ALL_SCHOOL_REQUEST_URL = "https://school.integration.dev.education.nsw.gov.au/v1/schools/search?limit=200&page="
DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL = "https://school.integration.dev.education.nsw.gov.au/v1/schools/search?page=1&limit=200"

staff_domain = {
  token_url = "https://icc-staff-dev-tf.auth.ap-southeast-2.amazoncognito.com/oauth2/token"
  token_client_id = "3d26o0ojqddmpbdiolq548472t"
  token_scope = "app:domapi:staff:v2/access app:domapi:staff:v2/staff.read"
  api_url = "https://api.integration.dev.education.nsw.gov.au/xfi/staff/v2/staff/search"
}

staff_core = {
  api_url = "https://pzd1czjctl-vpce-0aa0a91876a527df1.execute-api.ap-southeast-2.amazonaws.com/dev/staff/v1"
}

vpc_id = "vpc-0457ae753c51d7bd3"

vpce_id = "vpce-0aa0a91876a527df1"

dcu_vpce_id = "vpce-0905392389ed680cd"

icc_vpce_id = "vpce-011874783ab159a09"

azure_tenant_id = "2f3556d6-2e54-4678-abaa-917c9f08a197"

azure_application_id = "21142949-78e7-472e-b3e5-d345646195ff"

log_level = "debug"
logging_version ="1"

secrets_manager_endpoint = "http://localstack:4566"

tags = {
  cir_app_id                 = "ischem"
  cir_dataclass              = "sensitive"
  Integration-Env            = "Dev"
  Integration-Component-Name = "SchoolCommsAdapter"
  Integration-Version        = "v1"
  Integration-Branch         = "main"
  Integration-User           = "praveen.belkar@det.nsw.edu.au"
  Integration-Repository     = "https://bitbucket.det.nsw.edu.au/projects/ENTINT/repos/SchoolEmergencyNotificationService"
}

relative_project_path = "../../.."

