#!/bin/bash

# Login first to get a valid token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "depot_mgr", "password": "depot123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Get the order details
echo "Fetching order #4 details..."
curl -s -X GET http://localhost:3001/api/parts-orders/4 \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
