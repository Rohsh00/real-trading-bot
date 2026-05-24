# Trading Bot

Production-grade algorithmic trading platform built with Python, FastAPI, PostgreSQL, Redis, Docker, and Binance WebSocket streams.

---

# Current Status

Current Phase:

Phase 9.6 – Position Persistence

Status:

🚧 In Progress

---

# Features

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

## Strategies

- EMA Strategy
- RSI Strategy
- MACD Strategy
- Strategy Registry
- YAML Configuration

## Execution

- Broker Factory
- Paper Broker
- Risk Manager
- Portfolio Manager
- Signal Execution

## Persistence

- Orders
- Trades
- Candles
- PostgreSQL Storage

---

# Architecture

## Trading Flow

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

---

## Candle Pipeline

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
```

# Active Services

Start each service in a separate terminal.

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

# Redis Channels

```text
market_ticks
trading_signals
candle_events
```

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

# Database

Container:

```text
tradingbot-postgres
```

Connect:

```bash
docker exec -it tradingbot-postgres psql -U trader -d tradingbot
```

# Redis

Container:

```text
tradingbot-redis
```

Connect:

```bash
redis-cli
```

# Completed Phases

- Phase 1 – Infrastructure
- Phase 2 – Core Backend
- Phase 3 – Trading Models
- Phase 4 – Market Data Layer
- Phase 5 – Strategy Engine
- Phase 6 – Execution Layer
- Phase 7 – Persistence & Analytics
- Phase 8A – Multi-Symbol Architecture
- Phase 8B – Live Candle Infrastructure
- Phase 9 – Redis Candle Pipeline
- Phase 9.5 – Cleanup & Hardening

# Current Work

Phase 9.6

Position Persistence

Pending:

- Persist BUY positions
- Remove positions on SELL
- Load positions from DB on startup
- Make Portfolio API DB-backed
- Restart recovery

# Future Roadmap

## Phase 10

Fyers Integration Foundation

- Authentication
- OAuth
- Token Management
- REST Client
- WebSocket Client
- Broker Factory Integration

## Phase 11

NSE + MCX Trading

## Phase 12

Portfolio Engine

## Phase 13

Optimization Engine

## Phase 14

Quant Research

## Phase 15

Dashboard

## Phase 16

AI Layer

## Phase 17

Production Deployment

# License

Private Project
