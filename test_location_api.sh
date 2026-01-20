#!/bin/bash

# Login and get token
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Create test location
echo -e "\nCreating test location..."
curl -s -X POST http://localhost:3001/api/reference/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"admin","loc_cd":"TEST-F282","loc_name":"Test Location F282"}'

echo -e "\n\nGetting all locations..."
curl -s http://localhost:3001/api/reference/locations \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\nDeleting test location..."
curl -s -X DELETE http://localhost:3001/api/reference/locations/admin/TEST-F282 \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\nGetting locations after delete..."
curl -s http://localhost:3001/api/reference/locations \
  -H "Authorization: Bearer $TOKEN"
