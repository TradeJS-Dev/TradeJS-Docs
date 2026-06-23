---
title: Infra / Docker
---

Local TradeJS development uses Docker-managed infrastructure for Redis and PostgreSQL/Timescale.

## Local Dev

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
npx @tradejs/cli infra-down
```

`infra-init` creates `docker-compose.dev.yml` in your project root. `infra-up` starts the dev services.

## Runtime Services

Typical local endpoints:

- Redis: `127.0.0.1:6379`
- PostgreSQL/Timescale: `127.0.0.1:5432`
- ML gRPC, optional: `127.0.0.1:50051`

## Production Docs Deployment

This documentation repository publishes `ghcr.io/tradejs-dev/tradejs-docs` and refreshes the production compose service named `docs`.

For TradeJS runtime deployment, use your own deployment controls and review the operations pages.

Related:

- [Production runbook](../operations/production-runbook)
- [Env reference](../operations/env-reference)
- [Security hardening](../operations/security-hardening)
