# How to Stop the Uvicorn Server

## Method 1: If running in foreground (terminal)
If you started the server with:
```bash
uvicorn app.main:app --reload --port 8000
```

Simply press:
```
Ctrl + C
```

## Method 2: Find and kill the process
```bash
# Find the process ID
ps aux | grep uvicorn

# Kill by process ID (replace PID with actual number)
kill PID

# Or force kill if it doesn't stop
kill -9 PID
```

## Method 3: Kill by port
```bash
# Find what's using port 8000
lsof -ti:8000

# Kill it
kill $(lsof -ti:8000)

# Or force kill
kill -9 $(lsof -ti:8000)
```

## Method 4: Kill all uvicorn processes
```bash
# Kill all uvicorn processes
pkill -f uvicorn

# Or force kill
pkill -9 -f uvicorn
```

## Method 5: One-liner to stop server on port 8000
```bash
lsof -ti:8000 | xargs kill -9
```

## Verify it's stopped
```bash
# Check if port 8000 is free
lsof -i:8000

# Or test the endpoint
curl http://localhost:8000/health
# Should return: "Connection refused" or timeout
```

