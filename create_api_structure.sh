#!/bin/bash

# Navigate to the pages/api directory of your Next.js project
cd pages/api

# Create directories for companies and nested resources
mkdir -p companies/[companyId]/accounts/[accountId]/users
mkdir -p companies/[companyId]/accounts/[accountId]/bills
mkdir -p companies/[companyId]/accounts/[accountId]/lines

# Create index.js files for managing companies
touch companies/index.js
touch companies/[companyId].js

# Create index.js and specific ID handlers for accounts
touch companies/[companyId]/accounts/index.js
touch companies/[companyId]/accounts/[accountId].js

# Create index.js and specific ID handlers for users under accounts
touch companies/[companyId]/accounts/[accountId]/users/index.js
touch companies/[companyId]/accounts/[accountId]/users/[userId].js

# Create index.js and specific ID handlers for bills
touch companies/[companyId]/accounts/[accountId]/bills/index.js
touch companies/[companyId]/accounts/[accountId]/bills/[billId].js

# Create index.js and specific ID handlers for lines
touch companies/[companyId]/accounts/[accountId]/lines/index.js
touch companies/[companyId]/accounts/[accountId]/lines/[lineId].js

echo "API structure created successfully."