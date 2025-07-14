#!/bin/bash

# Start the backend server
cd backend
npm run dev &
BACKEND_PID=$!

# Start the frontend server
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep the script running
echo "Servers started. Press Ctrl+C to stop."
wait