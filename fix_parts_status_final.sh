#!/bin/bash

# This script will use sed to replace all status values in the parts orders section
# We need to be very careful to only replace within the initializePartsOrders function

# Backup first
cp backend/src/index.ts backend/src/index.ts.backup_status

# Update the interface (line 6571 area)
sed -i.bak1 "s/status: 'pending' | 'ACKNOWLEDGE' | 'FILL' | 'DELIVER' | 'cancelled';/status: 'REQUEST' | 'ACKNOWLEDGE' | 'FILL' | 'DELIVER' | 'cancelled';/" backend/src/index.ts

# Now replace all the actual status values between lines 6590 and 6800
# This is the initializePartsOrders function
sed -i.bak2 '6590,6800s/status: .pending.,/status: '\''REQUEST'\'',/' backend/src/index.ts
sed -i.bak3 '6590,6800s/status: .acknowledged.,/status: '\''ACKNOWLEDGE'\'',/' backend/src/index.ts
sed -i.bak4 '6590,6800s/status: .shipped.,/status: '\''FILL'\'',/' backend/src/index.ts
sed -i.bak5 '6590,6800s/status: .received.,/status: '\''DELIVER'\'',/' backend/src/index.ts

echo "✓ Updated status values in backend/src/index.ts"
echo "Verifying changes..."
grep -c "status: 'REQUEST'" backend/src/index.ts
grep -c "status: 'ACKNOWLEDGE'" backend/src/index.ts
