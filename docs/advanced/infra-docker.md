---
title: Infra / Docker
---

TradeJS uses two services in Docker for local work. Redis stores application
data and PostgreSQL with TimescaleDB stores market history.

## Local Dev

```bash
npm exec -- tradejs infra-init
npm exec -- tradejs infra-up
npm exec -- tradejs doctor --skip-ml
```

`infra-init` creates `docker-compose.dev.yml` in your project root. `infra-up` starts the dev services.

To stop the local services later, run `npm run infra-down`.

## Runtime Services

Typical local endpoints:

- Redis: `127.0.0.1:6379`
- PostgreSQL/Timescale: `127.0.0.1:5432`
- ML gRPC, если настроен: `127.0.0.1:50051`

## Production Docs Deployment

This documentation repository publishes `ghcr.io/tradejs-dev/tradejs-docs` and refreshes the production compose service named `docs`.

For TradeJS runtime deployment, use your own deployment controls and review the operations pages.

Related:

- [Production runbook](../operations/production-runbook)
- [Env reference](../operations/env-reference)
- [Security hardening](../operations/security-hardening)
