#!/bin/bash
TOKEN="eyJ1c2VySWQiOjEsImlhdCI6MTc2OTA1NDA3Mjk4MCwiZXhwIjoxNzY5MDU1ODcyOTgwfQ=="
curl -s "http://localhost:3001/api/configurations/145/bom" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | head -c 3000
