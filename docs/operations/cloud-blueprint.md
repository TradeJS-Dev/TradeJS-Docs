---
sidebar_label: Cloud Deployment Blueprint
title: Self-Hosted Trading Infrastructure
description: 'Plan a self-hosted TradeJS deployment with Nginx, Redis, TimescaleDB, application services, ML inference, backups, monitoring, and horizontal scaling.'
---

Start with one host. Follow the [production runbook](./production-runbook) to set it up.

## Single-Node Setup

- TradeJS runs the web app and evaluates signals for the configured deployments.
- Redis stores account settings and runtime records. TimescaleDB stores market history.
- A proxy terminates HTTPS. Keep Redis and PostgreSQL on the private network.
- The ML service is needed only when you use models.

## Multi-Node Setup

Measure where the host runs out of resources before moving services. Start with
the database or ML service if it is the bottleneck. After the move, verify
storage connectivity, market history, and processing of new candles.

## Non-Functional Requirements

Record the exact image version and test [backup restoration](./backup-restore).
Use the [monitoring guide](./monitoring-alerts) to verify the running system.
