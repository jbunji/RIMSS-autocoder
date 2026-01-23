#!/bin/bash

# Login and get token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Token: ${TOKEN:0:20}..."

# Get program locations
LOCATIONS=$(curl -s http://localhost:3001/api/locations?program_id=2 \
  -H "Authorization: Bearer $TOKEN")

echo "Locations: $LOCATIONS" | head -c 200

# Get admin location ID
ADMIN_LOC_ID=$(echo $LOCATIONS | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

# Get custodial location ID
CUST_LOC_ID=$(echo $LOCATIONS | grep -o '"id":[0-9]*' | tail -1 | cut -d':' -f2)

echo "Admin Loc ID: $ADMIN_LOC_ID"
echo "Cust Loc ID: $CUST_LOC_ID"

if [ -z "$ADMIN_LOC_ID" ] || [ -z "$CUST_LOC_ID" ]; then
  echo "Failed to get location IDs"
  exit 1
fi

# Create test assets
echo "Creating test assets..."

# FMC assets
for i in 1 2 3; do
  curl -s -X POST http://localhost:3001/api/assets \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"asset_sn\": \"TEST_F454_FMC_${i}\",
      \"asset_pn\": \"TEST-PN-FMC-${i}\",
      \"asset_name\": \"Test FMC Asset ${i}\",
      \"status_cd\": \"FMC\",
      \"pgm_id\": 2,
      \"admin_loc_id\": $ADMIN_LOC_ID,
      \"cust_loc_id\": $CUST_LOC_ID,
      \"uii\": \"TEST-UII-FMC-${i}\"
    }"
  echo " ✓ Created FMC asset ${i}"
done

# PMC assets
for i in 1 2; do
  curl -s -X POST http://localhost:3001/api/assets \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"asset_sn\": \"TEST_F454_PMC_${i}\",
      \"asset_pn\": \"TEST-PN-PMC-${i}\",
      \"asset_name\": \"Test PMC Asset ${i}\",
      \"status_cd\": \"PMC\",
      \"pgm_id\": 2,
      \"admin_loc_id\": $ADMIN_LOC_ID,
      \"cust_loc_id\": $CUST_LOC_ID,
      \"uii\": \"TEST-UII-PMC-${i}\"
    }"
  echo " ✓ Created PMC asset ${i}"
done

# NMC assets
for i in 1 2; do
  curl -s -X POST http://localhost:3001/api/assets \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"asset_sn\": \"TEST_F454_NMC_${i}\",
      \"asset_pn\": \"TEST-PN-NMC-${i}\",
      \"asset_name\": \"Test NMC Asset ${i}\",
      \"status_cd\": \"NMCM\",
      \"pgm_id\": 2,
      \"admin_loc_id\": $ADMIN_LOC_ID,
      \"cust_loc_id\": $CUST_LOC_ID,
      \"uii\": \"TEST-UII-NMC-${i}\"
    }"
  echo " ✓ Created NMC asset ${i}"
done

echo ""
echo "Done! Created 7 test assets (3 FMC, 2 PMC, 2 NMC)"
