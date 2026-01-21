#!/bin/bash

# Login and get token
LOGIN_RESPONSE=$(curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"field_tech","password":"field123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
echo ""
echo "Parts Orders:"
curl -s "http://localhost:3001/api/parts-orders?limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
