# Terraspace Project

This is a Terraspace project. It contains code to provision Cloud infrastructure built with [Terraform](https://www.terraform.io/) and the [Terraspace Framework](https://terraspace.cloud/).

## Deploy

To deploy all the infrastructure stacks:

    terraspace all up

To deploy individual stacks:

    terraspace up demo # where demo is app/stacks/demo

## Terrafile

To use more modules, add them to the [Terrafile](https://terraspace.cloud/docs/terrafile/).

## Lambda

### Staff Handler

#### Config

The Staff Domain API is secured with OAuth and the secret is retrieved from AWS Secrets Manager with a key. Example:
"SchoolCommsAdapter-StaffDomainSecret-{env}-Secret".

The Terraspace stack will create an empty secret in Secrets Manager with the key above, but the value will be empty. The value must be set manually in the AWS console or via the AWS CLI.

Example:

```shell
aws secretsmanager update-secret \
    --secret-id SchoolCommsAdapter-StaffDomainSecret-Dev-Secret \
    --secret-string file://$HOME/.secrets/staff_domain.dev.json
```

The JSON secret must be in the form:

```json
{
    "clientId": "123***",
    "clientSecret": "456***"
}
```
