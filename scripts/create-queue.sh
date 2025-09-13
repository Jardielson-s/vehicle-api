#!/bin/bash
echo "Creating SQS queue: vehicles-queue"
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name vehicle-fifo
