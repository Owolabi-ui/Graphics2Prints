#!/bin/bash

# Script to run the customer addresses migration

# Change to the project directory if needed
# cd /path/to/your/project

# Export DATABASE_URL from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  echo "Please set it in your .env file or export it before running this script."
  exit 1
fi

echo "Running customer addresses migration..."

# Run the SQL file using psql
psql "$DATABASE_URL" -f prisma/migrations/customer_addresses.sql

# Check if the migration was successful
if [ $? -eq 0 ]; then
  echo "Migration completed successfully."
else
  echo "Migration failed. Please check the error messages above."
  exit 1
fi

# Update Prisma schema to match the database
echo "Updating Prisma client..."
npx prisma generate

echo "All done! The customer addresses table has been created."
