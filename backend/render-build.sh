#!/bin/bash
echo "Starting Render deployment..."

# Install dependencies
npm install

# Run database setup if needed
echo "Database should be already configured in Supabase"

echo "Deployment completed successfully"