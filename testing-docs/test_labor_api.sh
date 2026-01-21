#!/bin/bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Testing labor API..."
echo "Token: ${TOKEN:0:30}..."

# Test GET labor for repair 2
echo ""
echo "=== GET /api/repairs/2/labor ==="
curl -s http://localhost:3001/api/repairs/2/labor \
  -H "Authorization: Bearer $TOKEN"
