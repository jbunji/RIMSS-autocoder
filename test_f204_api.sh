#!/bin/bash

# First, login as depot_mgr and get the session cookie
echo "=== Logging in as depot_mgr ==="
LOGIN_RESPONSE=$(curl -s -c /tmp/depot_cookie.txt -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"depot_mgr","password":"depot123"}')

echo "Login response: $LOGIN_RESPONSE"
echo ""

# Now try to create a user with the depot manager session
echo "=== Attempting to create user as depot_mgr ==="
CREATE_RESPONSE=$(curl -s -b /tmp/depot_cookie.txt -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_new_user","password":"test123","fullName":"Test User","role":"VIEWER","programId":1}')

echo "$CREATE_RESPONSE"
echo ""

# Try to delete a user with the depot manager session
echo "=== Attempting to delete user as depot_mgr ==="
DELETE_RESPONSE=$(curl -s -b /tmp/depot_cookie.txt -w "\nHTTP_STATUS:%{http_code}" -X DELETE http://localhost:3001/api/users/3)

echo "$DELETE_RESPONSE"
