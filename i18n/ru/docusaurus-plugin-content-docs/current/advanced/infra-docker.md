---
title: Infra / Docker
---

Локальный TradeJS использует Docker-инфраструктуру для Redis и PostgreSQL/Timescale.

```bash
npx @tradejs/cli infra-init
npx @tradejs/cli infra-up
npx @tradejs/cli doctor
npx @tradejs/cli infra-down
```

Типичные endpoints:

- Redis: `127.0.0.1:6379`;
- PostgreSQL/Timescale: `127.0.0.1:5432`;
- ML gRPC, optional: `127.0.0.1:50051`.

Docs repo публикует `ghcr.io/tradejs-dev/tradejs-docs` и обновляет production compose service `docs`.

См. [Production runbook](../operations/production-runbook).
