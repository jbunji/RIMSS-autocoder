#!/bin/bash
# Test labor parts API

# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"
echo ""
echo "Getting labor parts for labor #1:"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/labor/1/parts | python3 -m json.tool 2>/dev/null || curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/labor/1/parts
