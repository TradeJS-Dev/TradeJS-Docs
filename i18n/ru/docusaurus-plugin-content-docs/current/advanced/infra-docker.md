---
title: Infra / Docker
---

Для локальной работы TradeJS запускает в Docker два сервиса. В Redis хранятся
данные приложения, а в PostgreSQL с TimescaleDB — история рынка.

```bash
npm exec -- tradejs infra-init
npm exec -- tradejs infra-up
npm exec -- tradejs doctor --skip-ml
```

Позже остановить локальные сервисы можно командой `npm run infra-down`.

Адреса по умолчанию:

- Redis: `127.0.0.1:6379`;
- PostgreSQL/Timescale: `127.0.0.1:5432`;
- ML gRPC, если настроен: `127.0.0.1:50051`.

Docs repo публикует `ghcr.io/tradejs-dev/tradejs-docs` и обновляет production compose service `docs`.

См. [руководство по эксплуатации](../operations/production-runbook).
