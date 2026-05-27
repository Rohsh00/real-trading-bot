# Trading Bot Workspace

A production-grade, commercial-ready algorithmic trading platform built with Node.js/Express, TypeScript, Prisma ORM, React, Redux, Redis event pipelines, and Dockerized PostgreSQL.

---

## Workspace Vision

This platform is architected to support:
- **Multiple Users / Accounts**: Segregated portfolio, API keys, and margin management.
- **Multi-Broker Framework**: Clean abstraction layers allowing dry paper trading or live deployment (e.g. Fyers integration).
- **Scalable Algorithmic Execution**: High-throughput tick ingestion, real-time candle creation, and plug-and-play strategies.
- **observability & Guardrails**: Integrated risk management checks, structured audit trails, and health diagnostics.

---

## Workspace Architecture

This repository is structured as an npm workspaces monorepo:

```text
├── backend/            # Express REST/WS API & background worker runners (TypeScript)
│   ├── src/
│   │   ├── api/        # Routers, controllers, and middlewares
│   │   ├── core/       # Configurations, logging, Prisma db, and Redis client
│   │   ├── services/   # Business logic (PositionService, StrategyService, etc.)
│   │   ├── repositories/# Direct DB access layer (CandleRepository, OrderRepository, etc.)
│   │   ├── trading/    # Core algorithmic logic (brokers, strategies, portfolio, execution)
│   │   └── workers/    # Continuous background worker runners
│   └── prisma/         # PostgreSQL schema definition
│
├── frontend/           # SPA React client dashboard (Vite + TypeScript)
│   ├── src/
│   │   ├── components/ # Modular UI components (layout vs features/pages)
│   │   ├── store/      # Redux toolkit state stores
│   │   └── hooks/      # Custom state hooks (useTradingData)
│
├── legacy/             # Legaced archived files
├── docker-compose.yml  # Root orchestrator for Postgres & Redis services
└── package.json        # Workspace manager defining workspaces & concurrently dev runners
```

---

## Tech Stack

| Layer | Technology |
|---------|------------|
| Backend API / WS | Node.js (TypeScript, Express) |
| Frontend | React (TypeScript, Vite, Redux Toolkit) |
| Database | PostgreSQL |
| Cache / Pub-Sub | Redis |
| ORM | Prisma ORM |
| Containers | Docker / Docker Compose |
| Live Data Ingestion | Binance WebSocket Client |

---

## Quick Start

### 1. Database & Cache
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Dev Server
Starts both the Express backend server (with its 5 background workers) and the React frontend concurrently:
```bash
npm run dev
```

---

## Workspace Verification

To verify that tests are running cleanly across the workspace:

* **Test Backend**: `npm run test --workspace=backend`
* **Test Frontend**: `npm run test --workspace=frontend`
* **Health API Check**: Request `http://localhost:8000/api/v1/health` in your browser.

---

## License

Private Project

Copyright © Trading Bot Project