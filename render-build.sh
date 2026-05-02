#!/bin/bash
echo "Starting Render deployment..."

# Navigate to backend directory
cd truck-driver-platform/backend || exit 1

# Install dependencies
npm install

# Run database setup if needed
echo "Database should be already configured in Supabase"

echo "Deployment completed successfully"