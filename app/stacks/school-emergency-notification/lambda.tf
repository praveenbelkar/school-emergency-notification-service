# School Handler Lambda
data "archive_file" "schem_school_lambda_function_archive" {
  type        = "zip"
  source_dir  = "${path.module}/${var.relative_project_path}/lambda/schoolHandler/dist/"
  output_path = "${path.module}/${var.relative_project_path}/lambda/schoolHandler/function.zip"
  excludes    = ["${path.module}/${var.relative_project_path}/lambda/schoolHandler/dist/tests"]
}

data "archive_file" "staff_lambda_function_archive" {
  type        = "zip"
  source_dir  = "${path.module}/${var.relative_project_path}/lambda/staffHandler/dist/"
  output_path = "${path.module}/${var.relative_project_path}/lambda/staffHandler/function.zip"
  excludes    = [
    "${path.module}/${var.relative_project_path}/lambda/staffHandler/dist/meta.json",
  ]
}

data "archive_file" "student_lambda_function_archive" {
  type        = "zip"
  source_dir  = "${path.module}/${var.relative_project_path}/lambda/studentHandler/dist/"
  output_path = "${path.module}/${var.relative_project_path}/lambda/studentHandler/function.zip"
  excludes    = [
    "${path.module}/${var.relative_project_path}/lambda/studentHandler/dist/meta.json",
  ]
}

module "schem_school_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "SchoolNotifyAdapter-School-${var.env}-Lambda-V1"
  description   = "School Emergency Notification SchoolHandler ${var.env} Lambda function"
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  create_role   = false
  lambda_role   = aws_iam_role.schem_school_lambda_role.arn
  timeout       = 15
  reserved_concurrent_executions = 10
  memory_size                    = 512

  use_existing_cloudwatch_log_group = true

  create_package         = false
  local_existing_package = data.archive_file.schem_school_lambda_function_archive.output_path

  tracing_mode = "Active"

  depends_on = [
    aws_cloudwatch_log_group.schem_school_lambda_log_group
  ]

  environment_variables = {
    #RestApiEndpoint = "https://${aws_api_gateway_rest_api.payload_rest_api.id}-${var.vpce_id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${lower(var.env)}"
    env =  var.env
    SystemName =  var.SystemName
    LOG_LEVEL      = var.log_level
    ComponentName = "SchoolHandler"
    PAGE_NUMBER = var.PAGE_NUMBER
    DOMAIN_SCHOOL_TOKEN_SERVICE_URL = var.DOMAIN_SCHOOL_TOKEN_SERVICE_URL
    DOMAIN_SCHOOL_TOKEN_AMS_SCOPE = var.DOMAIN_SCHOOL_TOKEN_AMS_SCOPE
    DOMAIN_SCHOOL_TOKEN_SRD_SCOPE = var.DOMAIN_SCHOOL_TOKEN_SRD_SCOPE
    DOMAIN_SCHOOL_ALL_SCHOOL_REQUEST_URL = var.DOMAIN_SCHOOL_ALL_SCHOOL_REQUEST_URL
    DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL = var.DOMAIN_SCHOOL_SINGLE_SCHOOL_REQUEST_URL
    DCU_SYSTEM_ID = var.DCU_SYSTEM_ID
    NODE_OPTIONS = var.node_options
  }

  tags = var.tags
}

resource "aws_lambda_permission" "schoolComms_school_lambda_function_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.schem_school_lambda_function.lambda_function_name}"
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "schem_school_lambda_log_group" {
  name = "/aws/lambda/SchoolNotifyAdapter-School-${var.env}-Lambda-V1"
}

module "staff_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "SchoolNotifyAdapter-Staff-${var.env}-Lambda-V1"
  description   = "School Emergency Notification StaffHandler ${var.env} Lambda function"
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  create_role   = false
  lambda_role   = aws_iam_role.staff_lambda_role.arn
  timeout       = 20
  reserved_concurrent_executions = 10
  memory_size                    = 512

  use_existing_cloudwatch_log_group = true

  create_package         = false
  local_existing_package = data.archive_file.staff_lambda_function_archive.output_path

  tracing_mode = "Active"

  vpc_subnet_ids         = var.vpc_subnet_ids
  vpc_security_group_ids = var.vpc_security_group_ids

  depends_on = [
    aws_cloudwatch_log_group.staff_lambda_log_group,
    aws_secretsmanager_secret.staff_domain_token_secret
  ]

  layers = [
    "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:layer:nodejs-postgres-lambda-layer:${var.nodejs-postgres-layer-version}"
  ]

  environment_variables = {
    env            = var.env
    SystemName     = var.SystemName
    ComponentName  = "StaffHandler"
    LOG_LEVEL      = var.log_level
    NODE_OPTIONS   = var.node_options
    DCU_SYSTEM_ID = var.DCU_SYSTEM_ID

    DB_USER="${var.staff_db_username}"
    DB_PASSWORD="${var.staff_db_password}"
    DB_HOST=var.staff_data_lib["db_host"]
    DB_PORT=var.staff_data_lib["db_port"]
    DB_NAME=var.staff_data_lib["db_name"]
    CONNECTION_POOL_MAX=var.staff_data_lib["connection_pool_max"]
    CONNECTION_ACQUIRE_TIMEOUT_IN_MS=var.staff_data_lib["connection_acquire_timeout_in_ms"]
    LAMBDA_TIMEOUT_IN_SECS=var.staff_domain["lambda_timeout_in_secs"]
    RETRY_TIMEOUT_IN_MS=var.staff_data_lib["retry_timeout_in_ms"]

    SOAP_URL = var.idm_webservice["soap_url"]
    IDM_SOAP_CALL_TIMEOUT = var.idm_webservice["idm_soap_call_timeout"]
    ALLOWED_DOE_EMAIL_DOMAINS = var.staff_data_lib["allowed_doe_email_domains"]
  }

  tags = var.tags
}

resource "aws_lambda_permission" "schoolComms_staff_lambda_function_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.staff_lambda_function.lambda_function_name}"
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "staff_lambda_log_group" {
  name = "/aws/lambda/SchoolNotifyAdapter-Staff-${var.env}-Lambda-V1"
}

module "student_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "SchoolNotifyAdapter-Student-${var.env}-Lambda-V1"
  description   = "School Emergency Notification StudentHandler ${var.env} Lambda function"
  handler       = "src/index.handler"
  runtime       = "nodejs18.x"

  create_role   = false
  lambda_role   = aws_iam_role.student_lambda_role.arn
  timeout       = 20
  reserved_concurrent_executions = 10
  memory_size                    = 512

  use_existing_cloudwatch_log_group = true

  create_package         = false
  local_existing_package = data.archive_file.student_lambda_function_archive.output_path

  tracing_mode = "Active"

  depends_on = [
    aws_cloudwatch_log_group.student_lambda_log_group
  ]

  environment_variables = {
    env            = var.env
    SystemName     = var.SystemName
    ComponentName  = "StudentHandler"
    LOG_LEVEL      = var.log_level
    NODE_OPTIONS   = var.node_options
    DCU_SYSTEM_ID = var.DCU_SYSTEM_ID
    DSM_STUDENT_CONTACT_API_URI = var.DSM_STUDENT_CONTACT_API_URI
    VALID_SCHOLASTIC_YEARS = "1,2,3,4,5,6,7,8,9,10,11,12,K,P"
  }

  tags = var.tags
}

resource "aws_lambda_permission" "schoolComms_student_lambda_function_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.student_lambda_function.lambda_function_name}"
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "student_lambda_log_group" {
  name = "/aws/lambda/SchoolNotifyAdapter-Student-${var.env}-Lambda-V1"
}
