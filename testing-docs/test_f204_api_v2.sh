#!/bin/bash

# Login as depot_mgr and extract the token
echo "=== Logging in as depot_mgr ==="
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"depot_mgr","password":"depot123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# Try to create a user with the depot manager token
echo "=== Attempting to create user as depot_mgr ==="
CREATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"username":"test_new_user","password":"test123","fullName":"Test User","role":"VIEWER","programId":1}')

echo "$CREATE_RESPONSE"
echo ""

# Try to delete a user with the depot manager token
echo "=== Attempting to delete user as depot_mgr ==="
DELETE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE http://localhost:3001/api/users/3 \
  -H "Authorization: Bearer $TOKEN")

echo "$DELETE_RESPONSE"
