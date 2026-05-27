# Getting Started Guide

This guide provides end-to-end setup instructions to get the **Trading Bot** workspace up and running. It describes the modern, unified Node.js and React monorepo architecture.

---

## Architecture Overview

The Trading Bot application is organized as an npm workspaces monorepo:
1. **`backend/`**: Node.js & Express REST/WS API server utilizing a Prisma ORM client and a Redis event pipeline for real-time market streams, candle persistence, strategy execution, risk checking, and portfolio tracking.
2. **`frontend/`**: React SPA built with TypeScript, Vite, Material-UI (MUI), and lightweight-charts to render real-time charts, positions, and logs.

```mermaid
graph TD
    subgraph Services [Background Workers]
        Stream[Market Stream Runner]
        Candle[Candle Persistence]
        Strategy[Strategy Runner]
        Execution[Execution Engine]
        Monitor[Position Monitor]
      end

    Binance[Binance WebSocket] -->|Live Ticks| Stream
    Stream -->|Redis: market_ticks| Strategy
    Strategy -->|Redis: trading_signals| Execution
    Stream -->|Redis: candle_events| Candle
    Candle -->|Prisma client| DB[(PostgreSQL)]
    
    API[Express Server] -->|Reads / Writes| DB
    API -->|Reads / Writes| Redis[(Redis)]
    
    UI[Vite React Frontend] -->|HTTP / WebSockets| API
```

---

## 1. Prerequisites

Ensure you have the following installed:
- **Node.js (LTS v18 or newer)**
- **npm (v9 or newer)**
- **Docker Desktop** (used to run PostgreSQL and Redis in containers)
- **Git**

---

## 2. Initial Setup

### Step A: Clone the Repository
Clone the repository and enter the project folder:
```bash
git clone <your-repository-url>
cd trading-bot
```

### Step B: Configure Environment Variables
Copy the template configuration file to create the root `.env` file:

**macOS / Linux / Git Bash:**
```bash
cp .env.example .env
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

---

## 3. Database & Cache Setup

Start the PostgreSQL and Redis containers using Docker Compose from the root directory:
```bash
docker-compose up -d
```

Verify that both containers are running:
```bash
docker ps
```
You should see:
* `tradingbot-postgres` listening on port `5432`
* `tradingbot-redis` listening on port `6379`

---

## 4. Install Dependencies

Install all dependencies for the workspace (this automatically installs dependencies for both `backend` and `frontend` packages using npm workspaces):
```bash
npm install
```

---

## 5. Running the Application

### Option A: Unified Dev Startup (Recommended)
You can run the entire workspace (both frontend and backend runners/server) using a single command from the root directory:
```bash
npm run dev
```
This runs the Express API, the five background workers, and the React Vite client concurrently. Open the frontend at `http://localhost:5173`.

### Option B: Running Projects Separately
If you prefer to run or monitor components separately:

#### Run Backend Server & Background Workers
```bash
# In backend folder
cd backend
npm run dev
```

#### Run Frontend Client
```bash
# In frontend folder
cd frontend
npm run dev
```

---

## 6. Verification & Testing

### Test Backend
Run backend integration and unit tests:
```bash
npm run test --workspace=backend
```

### Test Frontend
Run frontend React test suites:
```bash
npm run test --workspace=frontend
```

### Verification Endpoints
Verify that the services are online and healthy:
* **Health API Check**: Request `http://localhost:8000/api/v1/health` in your browser. It should return a success JSON payload confirming connections to Redis and Postgres.
* **REST Candles API**: Request `http://localhost:8000/api/v1/candles?symbol=BTCUSDT&timeframe=1m` to verify historical retrieval.

---

## 7. Connecting to Database / Cache

* **Connect to PostgreSQL Database CLI**:
  ```bash
  docker exec -it tradingbot-postgres psql -U trader -d tradingbot
  ```
* **Connect to Redis CLI**:
  ```bash
  docker exec -it tradingbot-redis redis-cli
  ```
