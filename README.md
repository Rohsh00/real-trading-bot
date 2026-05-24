# Trading Bot

Production-grade multi-user algorithmic trading platform built with Python, FastAPI, PostgreSQL, Redis, Docker, and Binance WebSocket streams.

---

# Vision

Build a commercial-grade trading platform capable of supporting:

- Multiple users
- Multiple broker integrations
- Real-money trading
- Portfolio management
- Risk management
- Strategy deployment
- Monitoring & observability
- SaaS architecture

The goal is to build a scalable trading product, not just a personal trading bot.

---

# Current Status

Current Phase:

Phase 9.6 – Position Persistence

Status:

🚧 In Progress

Next Phase:

Phase 10A – Production Core Foundation

---

# Current Features

## Infrastructure

- FastAPI
- PostgreSQL
- Redis
- Docker
- AsyncIO
- SQLAlchemy
- Alembic Migrations

## Market Data

- Binance WebSocket Streaming
- Multi-Symbol Support
- Tick Processing
- Live Candle Generation
- 1m Candles
- 5m Candles
- 15m Candles

## Strategy Engine

- EMA Strategy
- RSI Strategy
- MACD Strategy
- Strategy Registry
- YAML Configuration

## Execution

- Broker Factory
- Paper Broker
- Risk Manager
- Execution Engine
- Portfolio Manager

## Persistence

- Orders
- Trades
- Candles
- PostgreSQL Storage
- Redis Event Pipeline

---

# Architecture

## Trading Flow

```text
Binance WebSocket
        ↓
Market Stream
        ↓
Tick Processor
        ↓
Strategy Engine
        ↓
Redis trading_signals
        ↓
Execution Engine
        ↓
Broker Factory
        ↓
Paper Broker
        ↓
Portfolio Manager
        ↓
PostgreSQL
```

## Candle Pipeline

```text
Market Stream
        ↓
Timeframe Candle Engine
        ↓
Redis candle_events
        ↓
Candle Persistence Runner
        ↓
PostgreSQL
        ↓
Candle API
```

---

# Tech Stack

| Layer | Technology |
|---------|------------|
| Backend | Python |
| API | FastAPI |
| Database | PostgreSQL |
| Cache / Messaging | Redis |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Containers | Docker |
| Market Data | Binance WebSocket |
| Concurrency | AsyncIO |

---

# Project Structure

```text
app/
├── api/
├── brokers/
├── cache/
├── candles/
├── core/
├── execution/
├── models/
├── portfolio/
├── repositories/
├── risk/
├── services/
├── strategy_engine/
├── tasks/
├── websockets/

config/
alembic/
docs/
tests/
```

---

# Active Services

Run each service in a separate terminal.

## Market Stream

```bash
python -m app.tasks.stream_runner
```

## Strategy Engine

```bash
python -m app.tasks.strategy_runner
```

## Execution Engine

```bash
python -m app.tasks.execution_runner
```

## Candle Persistence

```bash
python -m app.tasks.candle_persistence_runner
```

## API

```bash
uvicorn app.main:app --reload
```

---

# Redis Channels

```text
market_ticks
trading_signals
candle_events
```

---

# API Endpoints

## Root

```http
GET /
```

## Health

```http
GET /api/v1/health
```

## Candles

```http
GET /api/v1/candles?symbol=BTCUSDT&timeframe=1m
```

## Portfolio

```http
GET /api/v1/portfolio
```

---

# Database

Container:

```text
tradingbot-postgres
```

Connect:

```bash
docker exec -it tradingbot-postgres psql -U trader -d tradingbot
```

---

# Redis

Container:

```text
tradingbot-redis
```

Connect:

```bash
redis-cli
```

---

# Completed Phases

## Phase 1

Infrastructure

- FastAPI
- PostgreSQL
- Redis
- Docker
- Environment Configuration

## Phase 2

Core Backend

- SQLAlchemy
- Async Database
- Alembic
- Logging
- Health APIs

## Phase 3

Trading Models

- Orders
- Trades
- Strategies
- Positions
- Candles

## Phase 4

Market Data Layer

- Binance WebSocket
- Tick Processing
- Candle Builder

## Phase 5

Strategy Engine

- EMA
- RSI
- MACD
- Signal Generation

## Phase 6

Execution Layer

- Paper Broker
- Execution Engine
- Risk Manager
- Portfolio Manager

## Phase 7

Persistence & Analytics

- Orders
- Trades
- Backtesting
- Analytics

## Phase 8A

Multi-Symbol Architecture

- BTCUSDT
- ETHUSDT
- SOLUSDT

## Phase 8B

Live Candle Infrastructure

- Multi-Timeframe Candles
- Candle Repository
- Candle Service
- Candle API

## Phase 9

Redis Candle Event Pipeline

## Phase 9.5

Cleanup & Hardening

- Candle Timestamp Persistence
- Health Checks
- Unique Constraints
- Redis Cleanup

---

# Current Work

## Phase 9.6

Position Persistence

### Completed

- Position Model Extended
- stop_loss Added
- take_profit Added
- Position Migration Created

### In Progress

- Persist BUY Positions
- Remove Positions On SELL
- Position Repository
- Position Service
- Load Positions On Startup
- Portfolio API DB-backed
- Restart Recovery

### Exit Criteria

- Open positions survive restart
- Portfolio API loads from database
- Positions stored in PostgreSQL
- No in-memory-only positions

---

# Future Roadmap

## Phase 10A

Production Core Foundation

- Audit Trail
- Risk Controls
- Service Recovery
- Enhanced Health Checks
- Idempotency Protection

## Phase 10B

Broker Framework

- Broker Interface
- Multi-Broker Support
- Broker Factory Refactor

## Phase 11

Fyers Integration

- Authentication
- OAuth
- Token Storage
- REST Client
- WebSocket Client

## Phase 12

User & Account System

- Users
- Accounts
- Broker Accounts
- Authentication
- Authorization

## Phase 13

Portfolio Engine

- Multi-User Portfolio
- Exposure Management
- Capital Allocation
- Margin Tracking

## Phase 14

Observability

- Prometheus
- Grafana
- Loki
- Metrics
- Alerting

## Phase 15

Dashboard

- React Frontend
- Live Charts
- Portfolio Screen
- Orders Screen
- Trade Journal

## Phase 16

AI Layer

- Feature Engineering
- Prediction Models
- Signal Ranking
- Regime Detection

## Phase 17

Production Deployment

- Nginx
- CI/CD
- Monitoring
- Alerting
- Backups
- Disaster Recovery

---

# License

Private Project

Copyright © Trading Bot Project