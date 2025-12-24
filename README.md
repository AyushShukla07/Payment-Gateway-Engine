# Payment Gateway Engine (Simulation)

A **payment gateway engine** built from scratch to simulate how real-world payment processors (Stripe/Razorpay) work internally.  
This project focuses on **correctness, reliability, and financial integrity**, not UI or SDK integrations.

This is a simulation for learning and demonstration purposes. No real payments are processed.

## Features

- Payment Intents with strict state machine
- Two-phase payments (Authorization → Capture)
- Idempotent APIs using Idempotency-Key
- Mock Bank / PSP simulator (timeouts & failures)
- Event-driven webhook system (async)
- Signed webhooks with retries & DLQ
- Double-entry ledger accounting
- Partial & full refunds
- Reconciliation engine (ledger vs bank)
- Financially correct, audit-ready design

---

## Architecture Overview

Client
↓
Payment Intent API
↓
Authorization (Mock Bank)
↓
Capture
↓
Event Queue (BullMQ)
↓
Webhook Worker
↓
Merchant Webhook

Ledger System (Append-Only)
↓
Reconciliation Engine

## Tech Stack

- Node.js, Express
- MongoDB
- Redis, BullMQ
- Docker
- Event-driven architecture
- Double-entry accounting


## Payment Intent State Machine

created → authorized → captured
↘ failed
↘ cancelled

- Capture only after authorization  
- Refund only after capture  
- Illegal transitions rejected  


## Idempotency

All write APIs require an `Idempotency-Key` header to ensure:
- Safe retries
- No duplicate payments
- No duplicate refunds

## Ledger System

- Immutable, append-only ledger
- Every transaction has:
  - One debit
  - One credit
- Balances are derived from ledger history

Example (Capture ₹5000):
customer_wallet → debit 5000
merchant_wallet → credit 5000

## Webhooks

- Asynchronous delivery
- HMAC-SHA256 signed payloads
- Retry with exponential backoff
- Failed deliveries sent to DLQ

## Reconciliation

Compares internal ledger entries with simulated bank settlements to detect:
- Missing records
- Amount mismatches
- Settlement inconsistencies

## Testing

End-to-end testing covers:
- Payment creation & idempotency
- Authorization (success/failure/timeout)
- Capture (full & partial)
- Refunds (idempotent)
- Ledger integrity
- Webhook retries & DLQ
- Reconciliation reports

All test scenarios pass successfully.

## Running the Project

```bash
docker-compose up
npm install
npm run dev
