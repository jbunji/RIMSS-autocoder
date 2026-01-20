#!/bin/bash

# Test the fill endpoint
curl -X PATCH http://localhost:3001/api/parts-orders/4/fill \
  -H "Authorization: Bearer eyJ1c2VySWQiOjIsImlhdCI6MTczODg4NjAyOTU1NiwiZXhwIjoxNzM4ODg3ODI5NTU2fQ==" \
  -H "Content-Type: application/json" \
  -d '{
    "replacement_asset_id": 1,
    "replacement_serno": "CRIIS-001-SPARE",
    "shipper": "FedEx",
    "tracking_number": "FDX-2026-TEST123",
    "ship_date": "2026-01-20"
  }'

echo ""
