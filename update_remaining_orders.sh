#!/bin/bash

# Update order 4
sed -i.bak '6709a\
      filled_date: null,\
      filled_by: null,\
      filled_by_name: null,\
      replacement_asset_id: null,\
      replacement_serno: null,\
      shipper: null,\
      ship_date: null,
' /Users/justinbundrick/Documents/ALAESolutions/RIMSS/RIMSS-autocoder/backend/src/index.ts

echo "Updated orders with fill fields"
