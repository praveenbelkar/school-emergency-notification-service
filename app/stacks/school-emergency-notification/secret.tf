
resource "aws_secretsmanager_secret" "staff_domain_token_secret" {
  name          = "SchoolCommsAdapter-StaffDomainSecret-${var.env}-Secret"
  description   = "The secret for Staff Domain API"

  recovery_window_in_days = 0

  tags = var.tags
}