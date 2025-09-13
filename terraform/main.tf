terraform {
  required_version = ">= 1.2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws",
      version = "~> 4.16"
    }
  }
}

provider "aws" {
  access_key                  = "localstack"
  secret_key                  = "localstack"
  region                      = "us-east-1"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  endpoints {
    sqs = "http://localhost:4566"
  }
}

resource "aws_sqs_queue" "test_queue" {
  name = "vehicle-fifo"
}



output "sqs_queue_url" {
  value = aws_sqs_queue.test_queue.id
}

