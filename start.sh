#!/bin/bash
# Kill any process currently running on port 8085
fuser -k 8085/tcp > /dev/null 2>&1

# Start the server in the background
nohup python3 -m http.server 8085 > /dev/null 2>&1 &

echo "Server started at http://localhost:8085"
echo "Process running in background. Use 'fuser -k 8085/tcp' to stop it."
