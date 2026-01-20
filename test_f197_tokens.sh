#!/bin/bash

echo "=== Testing Feature #197: Invalid tokens are rejected ==="
echo ""

BASE_URL="http://localhost:3001"

# Test 1: Malformed JWT - invalid base64
echo "Test 1: Malformed JWT - invalid base64"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer this-is-not-valid-base64!!!@@@")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Status: $STATUS"
echo "Body: $BODY"
if [ "$STATUS" = "401" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED - Expected 401, got $STATUS"
fi
echo ""

# Test 2: Random string token
echo "Test 2: Random string that is not a valid token"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer randomjunktoken123456789")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Status: $STATUS"
echo "Body: $BODY"
if [ "$STATUS" = "401" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED - Expected 401, got $STATUS"
fi
echo ""

# Test 3: Valid base64 but invalid JSON
echo "Test 3: Valid base64 encoding but not JSON"
INVALID_JSON_TOKEN=$(echo -n "not valid json at all" | base64)
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer ${INVALID_JSON_TOKEN}")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Status: $STATUS"
echo "Body: $BODY"
if [ "$STATUS" = "401" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED - Expected 401, got $STATUS"
fi
echo ""

# Test 4: Expired token
echo "Test 4: Expired token"
NOW=$(date +%s)000
PAST=$((NOW - 3600000))  # 1 hour ago
EXPIRED=$((NOW - 1800000))  # Expired 30 minutes ago
EXPIRED_TOKEN=$(echo -n "{\"userId\":1,\"iat\":${PAST},\"exp\":${EXPIRED}}" | base64)
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer ${EXPIRED_TOKEN}")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Status: $STATUS"
echo "Body: $BODY"
if [ "$STATUS" = "401" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED - Expected 401, got $STATUS"
fi
echo ""

# Test 5: Missing userId field
echo "Test 5: Valid JSON but missing required userId field"
NOW=$(date +%s)000
FUTURE=$((NOW + 1800000))
MISSING_USERID=$(echo -n "{\"iat\":${NOW},\"exp\":${FUTURE}}" | base64)
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer ${MISSING_USERID}")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Status: $STATUS"
echo "Body: $BODY"
if [ "$STATUS" = "401" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED - Expected 401, got $STATUS"
fi
echo ""

# Test 6: Empty token
echo "Test 6: Empty string as token"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/auth/me" \
  -H "Authorization: Bearer ")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Status: $STATUS"
echo "Body: $BODY"
if [ "$STATUS" = "401" ]; then
  echo "✅ PASSED"
else
  echo "❌ FAILED - Expected 401, got $STATUS"
fi
echo ""

echo "=== Test Complete ==="
