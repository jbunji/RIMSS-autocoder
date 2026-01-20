#!/bin/bash
TOKEN="eyJ1c2VySWQiOjEsImlhdCI6MTczNzM5MDMyNTgzOCwiZXhwIjoxNzM3MzkyMTI1ODM4fQ=="

for i in {1..30}; do
  SERIAL="TEST-SPARE-$(printf "%03d" $i)"
  PART_NUM="PN-TEST-$(printf "%03d" $i)"
  
  curl -s -X POST http://localhost:3001/api/spares \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"serno\": \"$SERIAL\",
      \"partno\": \"$PART_NUM\",
      \"status\": \"FMC\",
      \"loc_id\": 1,
      \"pgm_id\": 1
    }"
  
  echo "Created spare $i"
done

echo "Done creating 30 spares"
