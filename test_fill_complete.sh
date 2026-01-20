#!/bin/bash

# Login first to get a valid token
echo "Logging in as depot manager..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "depot_mgr", "password": "depot123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Got token: ${TOKEN:0:20}..."
echo ""

# Test the fill endpoint
echo "Testing fill endpoint..."
curl -s -X PATCH http://localhost:3001/api/parts-orders/4/fill \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "replacement_asset_id": 1,
    "replacement_serno": "CRIIS-001-SPARE",
    "shipper": "FedEx",
    "tracking_number": "FDX-2026-TEST123",
    "ship_date": "2026-01-20"
  }' | python3 -m json.tool

echo ""
echo "Fill operation complete!"
