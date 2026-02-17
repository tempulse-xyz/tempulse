# Tempulse Architecture

## 1. Overview

**Tempulse** is a high-performance indexer and analytics platform designed to track all stablecoin activity on the Tempo blockchain. It ingests blockchain events, processes them into queryable data models, and exposes metrics via a REST/GraphQL API.

### Core Goals
- **Real-time Indexing:** Ingest `Transfer`, `Mint`, and `Burn` events with minimal latency.
- **Analytics:** Compute TVL (Total Value Locked), Velocity, Holder Distribution, and Volume.
- **Reliability:** Handle blockchain reorgs and node failures gracefully.

## 2. High-Level Architecture

The system follows a classic **Extract-Transform-Load (ETL)** pattern adapted for event-driven blockchain architecture.

```mermaid
graph TD
    subgraph Blockchain
        TempoNode[Tempo RPC Node]
    end

    subgraph Ingestion Layer [bin/fin]
        Watcher[Event Watcher / Poller]
        Decoder[Log Decoder]
        ReorgHandler[Reorg Handler]
    end

    subgraph Storage Layer [PostgreSQL]
        RawLogs[Raw Events Table]
        Balances[Current Balances]
        Snapshots[Hourly/Daily Snapshots]
    end

    subgraph API Layer [bin/api]
        RestAPI[REST Server (Axum)]
        Cache[Redis Cache]
    end

    TempoNode -->|Logs & Blocks| Watcher
    Watcher --> Decoder
    Decoder --> ReorgHandler
    ReorgHandler --> RawLogs
    ReorgHandler --> Balances
    
    RawLogs -->|Aggregation Job| Snapshots
    
    RestAPI -->|Read| Snapshots
    RestAPI -->|Read| Balances
    RestAPI -->|Read| Cache
```

## 3. Core Components

### A. The Indexer (`bin/fin`)
The primary binary responsible for data ingestion.

1.  **Block Listener:** Connects to Tempo RPC via `alloy`. Listens for new block headers.
2.  **Log Filter:** Scans blocks for events emitted by known Stablecoin contracts (or a Factory contract).
    *   **Transfer (0xddf252...):** Tracks movement between accounts.
    *   **Minting:** Transfers from `0x00...00`.
    *   **Burning:** Transfers to `0x00...00`.
3.  **Processor:** 
    *   Decodes raw log data into structured Rust types.
    *   Normalizes token decimals (e.g., converting everything to raw units or `BigDecimal`).
    *   Updates user balances atomically.

### B. The Storage Layer (PostgreSQL)
We use a relational database to store normalized data.

**Key Tables:**
*   `blocks`: Tracks indexed blocks (height, hash, timestamp) for reorg detection.
*   `tokens`: Registry of tracked stablecoins (address, symbol, decimals).
*   `transfers`: Immutable log of all transfer events.
*   `accounts`: Current balance state for every address holding stablecoins.
*   `hourly_stats`: Aggregated volume, mint/burn counts per token.

### C. The API Server
A separate service (or module within `fin`) that serves data to the frontend.

*   **Endpoints:**
    *   `GET /stats/tvl`: Total stablecoin supply over time.
    *   `GET /token/{address}/holders`: Top holders.
    *   `GET /activity/recent`: Latest transfers.

## 4. Data Flow & Logic

### 1. Stablecoin Detection
*   **Static List:** Start with known stablecoins on Tempo.
*   **Factory Watcher (Future):** Listen to a `StablecoinFactory` contract for `NewStablecoin` events to automatically index new tokens.

### 2. Handling Reorgs
The indexer must handle chain reorganizations (where the canonical chain changes).
*   **Strategy:** Keep a buffer of the last N blocks in the database.
*   **Detection:** If the parent hash of a new block doesn't match the hash of the stored tip, a reorg occurred.
*   **Resolution:** Delete/Revert data in the DB back to the fork point and re-index the new canonical chain.

### 3. Analytics Aggregation
Heavy queries (e.g., "Volume over the last 30 days") should not run on raw `transfers` tables on every request.
*   **Materialized Views:** Use Postgres Materialized Views for common aggregations.
*   **Background Workers:** A cron job in `fin` updates `hourly_stats` tables.

## 5. Technology Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| **Language** | Rust | Performance, Type Safety, Concurrency. |
| **Blockchain Client** | `alloy` | Modern, type-safe interaction with EVM chains. |
| **Specific Chain Support** | `tempo-alloy` | Specialized types/RPC methods for Tempo. |
| **Database** | PostgreSQL + `sqlx` | ACID compliance, robust indexing, async Rust support. |
| **API Framework** | `axum` | High performance, ergonomic, built on Tokio. |
| **Migrations** | `sqlx-cli` | Manage DB schema changes. |

## 6. Project Structure

```text
.
├── Cargo.toml          # Workspace root
├── bin
│   └── fin             # The Indexer Binary
│       ├── src
│       │   ├── ingestion/  # Log fetching & decoding
│       │   ├── db/         # Database repositories
│       │   └── models/     # Domain entities
│       └── main.rs
├── crates
│   └── core            # Shared types (Errors, Config, Common Utils)
├── docker-compose.yml  # DB & Redis setup
└── migrations/         # SQLx migrations
```
