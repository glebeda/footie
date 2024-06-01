#!/bin/bash

# Define variables
BACKEND_DIR="../../backend"
APP_NAME="footie-backend"
ENV_NAME="Footie-backend-env"
ZIP_FILE="footie-backend.zip"
VERSION=$(date +%Y%m%d%H%M)
S3_BUCKET="footie-backend-distrib"

# Navigate to the backend directory
echo "Navigating to backend directory..."
cd $BACKEND_DIR || exit

# Disable AWS CLI pager
export AWS_PAGER=""

# Create a zip of the backend excluding node_modules and .env
echo "Creating zip file of the backend..."
zip -r $ZIP_FILE . -x "node_modules/*" -x ".env"
echo "Zip file created: $ZIP_FILE"

# Upload zip to S3
echo "Uploading zip file to S3..."
aws s3 cp $ZIP_FILE s3://$S3_BUCKET/$ZIP_FILE
echo "Zip file uploaded to S3"

# Deploy the new version to Elastic Beanstalk
echo "Deploying new version to Elastic Beanstalk..."
aws elasticbeanstalk create-application-version --application-name $APP_NAME --version-label $VERSION --source-bundle S3Bucket=$S3_BUCKET,S3Key=$ZIP_FILE
aws elasticbeanstalk update-environment --application-name $APP_NAME --environment-name $ENV_NAME --version-label $VERSION
echo "Deployment initiated. Waiting for the environment to update..."

while true; do
    STATUS=$(aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --query 'Environments[0].Status' --output text)
    if [ "$STATUS" == "Ready" ]; then
        echo "Deployment completed successfully."
        break
    elif [ "$STATUS" == "Terminated" ]; then
        echo "Environment update failed."
        exit 1
    else
        echo "Environment status: $STATUS. Checking again in 30 seconds..."
        sleep 20
    fi
done

# Clean up
echo "Cleaning up zip file..."
rm $ZIP_FILE
echo "Clean up done"

echo "Deployment completed successfully with version: $VERSION"