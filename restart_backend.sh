#!/bin/bash

# Find and kill the backend process
PID=$(ps aux | grep "node.*backend/src/index.ts" | grep -v grep | head -1 | tr -s ' ' | cut -d' ' -f2)

if [ -n "$PID" ]; then
  echo "Killing backend process (PID: $PID)..."
  kill $PID
  sleep 2
fi

# Start backend
echo "Starting backend..."
npx tsx backend/src/index.ts > backend-restart.log 2>&1 &

echo "Waiting for backend to start..."
sleep 3

# Check if it started
if curl -s http://localhost:3001/api/health > /dev/null; then
  echo "Backend started successfully!"
  tail -5 backend-restart.log
else
  echo "Backend failed to start. Check log: backend-restart.log"
fi
