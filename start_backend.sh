#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Error: Virtual environment 'venv' not found."
    exit 1
fi

echo "====================================="
echo " Starting Trading Bot Backend System "
echo "====================================="

# Start all processes in the background
uvicorn app.main:app --reload --port 8000 &
PID_API=$!
echo "Started API Server (PID: $PID_API)"

python -m app.tasks.stream_runner &
PID_STREAM=$!
echo "Started Stream Runner (PID: $PID_STREAM)"

python -m app.tasks.candle_persistence_runner &
PID_PERSIST=$!
echo "Started Candle Persistence (PID: $PID_PERSIST)"

python -m app.tasks.strategy_runner &
PID_STRAT=$!
echo "Started Strategy Runner (PID: $PID_STRAT)"

python -m app.tasks.execution_runner &
PID_EXEC=$!
echo "Started Execution Engine (PID: $PID_EXEC)"

python -m app.tasks.position_monitor &
PID_MONITOR=$!
echo "Started Position Monitor (PID: $PID_MONITOR)"

echo "====================================="
echo " All systems running!"
echo " Press Ctrl+C to cleanly stop everything."
echo "====================================="

# Clean up function to kill all background processes when the script exits
cleanup() {
    echo ""
    echo "Stopping all backend processes..."
    pkill -f 'uvicorn app.main:app' 2>/dev/null
    pkill -f 'python -m app.tasks.' 2>/dev/null
    echo "All processes stopped."
    exit
}

# Catch Ctrl+C (SIGINT) and termination signals (SIGTERM)
trap cleanup SIGINT SIGTERM

# Wait indefinitely so the script stays alive and the trap can catch Ctrl+C
wait
