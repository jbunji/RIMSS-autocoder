#!/bin/bash
RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s -X DELETE http://localhost:3001/api/reference/locations/admin/TEST-LOC-DELETE \
  -H "Authorization: Bearer $TOKEN"
