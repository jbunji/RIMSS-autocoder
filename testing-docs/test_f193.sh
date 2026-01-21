#!/bin/bash

echo "=== Testing Feature #193: API returns 401 for unauthenticated requests ==="
echo ""

echo "Test 1: GET /api/assets without token"
response=$(curl -s -w "\n%{http_code}" http://localhost:3001/api/assets)
status=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
echo "Status: $status"
echo "Body: $body"
echo ""

echo "Test 2: POST /api/events without token"
response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d '{"asset_id":1}' http://localhost:3001/api/events)
status=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
echo "Status: $status"
echo "Body: $body"
echo ""

echo "Test 3: GET /api/users without token"
response=$(curl -s -w "\n%{http_code}" http://localhost:3001/api/users)
status=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
echo "Status: $status"
echo "Body: $body"
echo ""

echo "All tests completed!"
