#!/bin/bash
curl -s -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); console.log(data.token || 'NO_TOKEN');"
