#!/bin/bash

# Variables
FRONTEND_DIR="../../frontend"
S3_BUCKET="footie-frontend"
CLOUDFRONT_DISTRIBUTION_ID="E1NQSW27M2VMO3"

# Navigate to the backend directory
echo "Navigating to frontent directory..."
cd $FRONTEND_DIR || exit

# Disable AWS CLI pager
export AWS_PAGER=""

# Build the frontend
echo "Building frontend..."
npm run build || { echo 'Build failed'; exit 1; }
echo "Frontend built successfully."

# Upload the build to S3
echo "Uploading build to S3..."
aws s3 sync build s3://$S3_BUCKET --delete || { echo 'S3 sync failed'; exit 1; }
echo "Build uploaded to S3."

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" || { echo 'CloudFront invalidation failed'; exit 1; }
echo "CloudFront cache invalidation request initiated."

echo "Frontend deployment completed successfully."