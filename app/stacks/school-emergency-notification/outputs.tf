# This is where you put your outputs declaration
output "api_endpoint" {
  value = "https://${aws_api_gateway_rest_api.school_comms_adapter_rest_api.id}-${var.vpce_id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${lower(var.env)}"
}
