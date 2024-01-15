resource "aws_api_gateway_rest_api" "school_comms_adapter_rest_api" {
  name        = "SchoolNotifyAdapter-Api-${var.env}-ApiGw-V1"
  description = "The service allows authorised clients to fetch the school, staff and students' parent carer data "

  endpoint_configuration {
    types            = ["PRIVATE"]
    vpc_endpoint_ids = [var.vpce_id, var.dcu_vpce_id, var.icc_vpce_id]
  }

  tags = var.tags
}

data "aws_iam_policy_document" "school_comms_adapter_rest_api_iam_policy_document" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["${var.dcu_lambda_role_arn}"]
    }

    actions   = ["execute-api:Invoke"]
    resources = ["${aws_api_gateway_rest_api.school_comms_adapter_rest_api.execution_arn}/*/*/*"]

    condition {
      test     = "StringEquals"
      variable = "aws:sourceVpce"
      values   = ["${var.dcu_vpce_id}"]
    }
  }

  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions   = ["execute-api:Invoke"]
    resources = ["${aws_api_gateway_rest_api.school_comms_adapter_rest_api.execution_arn}/*/*/*"]

    condition {
      test     = "StringEquals"
      variable = "aws:sourceVpce"
      values   = ["${var.vpce_id}"]
    }
  }

}

resource "aws_api_gateway_rest_api_policy" "school_comms_adapter_rest_api_policy" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  policy      = data.aws_iam_policy_document.school_comms_adapter_rest_api_iam_policy_document.json
}

resource "aws_api_gateway_request_validator" "api_gateway_method_getSchoolBySchoolCode_request_validator" {
  name                        = "getSchoolBySchoolCode_method_request_validator"
  rest_api_id                 = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  validate_request_parameters = true
}

resource "aws_api_gateway_request_validator" "api_gateway_method_getStaffBySchoolCode_request_validator" {
  name                        = "getStaffBySchoolCode_method_request_validator"
  rest_api_id                 = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  validate_request_parameters = true
}

# school resource (corresponding to path /schoolnotify)
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  parent_id   = aws_api_gateway_rest_api.school_comms_adapter_rest_api.root_resource_id
  path_part   = "schoolnotify"
}

resource "aws_api_gateway_request_validator" "api_gateway_method_getStudentBySchoolCode_request_validator" {
  name                        = "getStudentBySchoolCode_method_request_validator"
  rest_api_id                 = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  validate_request_parameters = true
}

# school resource (corresponding to path /schoolnotify/v1)
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  parent_id   = aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter.id
  path_part   = "v1"
}

# school resource (corresponding to path /schoolnotify/v1/schools)
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1_schools" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  parent_id   = aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1.id
  path_part   = "schools"
}

# school resource (corresponding to path /schoolnotify/v1/schools/{schoolCode})
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1_schools_schoolCode" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  parent_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_schools.id}"
  path_part   = "{schoolCode}"
}

#GET method for - /schoolnotify/v1/schools/
resource "aws_api_gateway_method" "api_gateway_method_getAllSchools" {
  rest_api_id   = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_schools.id}"
  http_method   = "GET"
  authorization = "AWS_IAM"
}

#integration of GET /schoolnotify/v1/schools/ with the lambda
resource "aws_api_gateway_integration" "api_gateway_integration_getAllSchools" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id = "${aws_api_gateway_method.api_gateway_method_getAllSchools.resource_id}"
  http_method = "${aws_api_gateway_method.api_gateway_method_getAllSchools.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${module.schem_school_lambda_function.lambda_function_invoke_arn}"

  depends_on = [
    aws_lambda_permission.schoolComms_school_lambda_function_permission
  ]
}

#GET method for - /schoolnotify/v1/schools/{schoolCode}
resource "aws_api_gateway_method" "api_gateway_method_getSchoolBySchoolCode" {
  rest_api_id   = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_schools_schoolCode.id}"
  http_method   = "GET"
  authorization = "AWS_IAM"
  request_validator_id  = aws_api_gateway_request_validator.api_gateway_method_getSchoolBySchoolCode_request_validator.id
  request_parameters = {"method.request.path.schoolCode" = true}
}

#integration of GET /schoolnotify/v1/schools/{schoolCode} with the lambda
resource "aws_api_gateway_integration" "api_gateway_integration_getSchoolBySchoolCode" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id = "${aws_api_gateway_method.api_gateway_method_getSchoolBySchoolCode.resource_id}"
  http_method = "${aws_api_gateway_method.api_gateway_method_getSchoolBySchoolCode.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${module.schem_school_lambda_function.lambda_function_invoke_arn}"

  depends_on = [
    aws_lambda_permission.schoolComms_school_lambda_function_permission
  ]
}

########
# Staff
########

resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1_staff" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  parent_id   = aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1.id
  path_part   = "staffs"
}

# school resource (corresponding to path /schoolnotify/v1/staff/{schoolCode})
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1_staff_schoolCode" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  parent_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_staff.id}"
  path_part   = "{schoolCode}"
}

#GET method for - /schoolnotify/v1/staffs/{schoolCode}
resource "aws_api_gateway_method" "api_gateway_method_getStaffBySchoolCode" {
  rest_api_id   = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_staff_schoolCode.id}"
  http_method   = "GET"
  authorization = "AWS_IAM"
  request_validator_id  = aws_api_gateway_request_validator.api_gateway_method_getStaffBySchoolCode_request_validator.id
  request_parameters = {"method.request.path.schoolCode" = true}
}

#integration of GET /schoolnotify/v1/staffs/{schoolCode} with the lambda
resource "aws_api_gateway_integration" "api_gateway_integration_getStaffBySchoolCode" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id = "${aws_api_gateway_method.api_gateway_method_getStaffBySchoolCode.resource_id}"
  http_method = "${aws_api_gateway_method.api_gateway_method_getStaffBySchoolCode.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${module.staff_lambda_function.lambda_function_invoke_arn}"

  depends_on = [
    aws_lambda_permission.schoolComms_staff_lambda_function_permission
  ]
}

##########
# Student
##########
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1_student" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  parent_id   = aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1.id
  path_part   = "students"
}

# school resource (corresponding to path /schoolnotify/v1/students/{schoolCode})
resource "aws_api_gateway_resource" "api_gateway_resource_schoolcommsadapter_v1_student_schoolCode" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  parent_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_student.id}"
  path_part   = "{schoolCode}"
}

#GET method for - /schoolnotify/v1/students/{schoolCode}
resource "aws_api_gateway_method" "api_gateway_method_getStudentBySchoolCode" {
  rest_api_id   = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.api_gateway_resource_schoolcommsadapter_v1_student_schoolCode.id}"
  http_method   = "GET"
  authorization = "AWS_IAM"
  request_validator_id  = aws_api_gateway_request_validator.api_gateway_method_getStudentBySchoolCode_request_validator.id
  request_parameters = {"method.request.path.schoolCode" = true}
}

#integration of GET /schoolnotify/v1/students/{schoolCode} with the lambda
resource "aws_api_gateway_integration" "api_gateway_integration_getStudentBySchoolCode" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  resource_id = "${aws_api_gateway_method.api_gateway_method_getStudentBySchoolCode.resource_id}"
  http_method = "${aws_api_gateway_method.api_gateway_method_getStudentBySchoolCode.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${module.student_lambda_function.lambda_function_invoke_arn}"

  depends_on = [
    aws_lambda_permission.schoolComms_student_lambda_function_permission
  ]
}
# API Gateway Deployment
resource "aws_api_gateway_deployment" "api_gateway_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}"
  stage_description = "${timestamp()}"

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.school_comms_adapter_rest_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.api_gateway_integration_getSchoolBySchoolCode,
    aws_api_gateway_integration.api_gateway_integration_getAllSchools,
    aws_api_gateway_integration.api_gateway_integration_getStaffBySchoolCode,
    aws_api_gateway_integration.api_gateway_integration_getStudentBySchoolCode
  ]
}

resource "aws_api_gateway_stage" "api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.api_gateway_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id

  stage_name  = lower(var.env)
  xray_tracing_enabled = true

  depends_on = [aws_cloudwatch_log_group.cloudwatch_log_group]

  tags = var.tags
}

resource "aws_api_gateway_method_settings" "api_gateway_method_settings" {
  rest_api_id = aws_api_gateway_rest_api.school_comms_adapter_rest_api.id
  stage_name  = aws_api_gateway_stage.api_gateway_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}


resource "aws_cloudwatch_log_group" "cloudwatch_log_group" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}/${var.env}"
  retention_in_days = 7

  tags = var.tags
}
