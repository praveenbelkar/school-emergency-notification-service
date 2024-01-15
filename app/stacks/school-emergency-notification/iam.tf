data "aws_iam_policy_document" "lambda_assume_role_document" {
  version = "2012-10-17"

  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    effect = "Allow"
  }
}

# school Handler Lambda
data "aws_iam_policy_document" "schem_school_lambda_cloudwatch_policy" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["${aws_cloudwatch_log_group.schem_school_lambda_log_group.arn}:*"]
  }
}

resource "aws_iam_role_policy" "schem_school_lambda_cloudwatch_policy" {
  name   = "SchemService-SchoolHandlerLambda-${var.env}-Cloudwatch-IamPolicy"
  policy = "${data.aws_iam_policy_document.schem_school_lambda_cloudwatch_policy.json}"
  role   = aws_iam_role.schem_school_lambda_role.id
}

resource "aws_iam_role" "schem_school_lambda_role" {
  name               = "SchemService-SchoolHandlerLambda-${var.env}-IamRole"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume_role_document.json}"
  managed_policy_arns = ["arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess", "arn:aws:iam::aws:policy/SecretsManagerReadWrite"]

  tags = var.tags
}


data "aws_iam_policy_document" "staff_lambda_cloudwatch_policy" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["${aws_cloudwatch_log_group.staff_lambda_log_group.arn}:*"]
  }
}

resource "aws_iam_role_policy" "staff_lambda_cloudwatch_policy" {
  name   = "SchemService-StaffHandlerLambda-${var.env}-Cloudwatch-IamPolicy"
  policy = "${data.aws_iam_policy_document.staff_lambda_cloudwatch_policy.json}"
  role   = aws_iam_role.staff_lambda_role.id
}

resource "aws_iam_role" "staff_lambda_role" {
  name               = "SchemService-StaffHandlerLambda-${var.env}-IamRole"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume_role_document.json}"
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole", "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess", "arn:aws:iam::aws:policy/SecretsManagerReadWrite"]

  tags = var.tags
}

data "aws_iam_policy_document" "staff_domain_token_secret_policy" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    actions   = ["secretsmanager:GetSecretValue"]
    resources = ["${aws_secretsmanager_secret.staff_domain_token_secret.arn}"]
  }
}


data "aws_iam_policy_document" "student_lambda_cloudwatch_policy" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["${aws_cloudwatch_log_group.student_lambda_log_group.arn}:*"]
  }
}

resource "aws_iam_role_policy" "student_lambda_cloudwatch_policy" {
  name   = "SchemService-StudentHandlerLambda-${var.env}-Cloudwatch-IamPolicy"
  policy = "${data.aws_iam_policy_document.student_lambda_cloudwatch_policy.json}"
  role   = aws_iam_role.student_lambda_role.id
}

resource "aws_iam_role" "student_lambda_role" {
  name               = "SchemService-StudentHandlerLambda-${var.env}-IamRole"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume_role_document.json}"
  managed_policy_arns = ["arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"]

  tags = var.tags
}