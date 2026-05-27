#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")"

echo "====================================="
echo " Starting Trading Bot Backend (Node) "
echo "====================================="

# Run all backend services concurrently
npm run dev
