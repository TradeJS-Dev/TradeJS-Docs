---
title: Руководство по эксплуатации продакшена
---

Этот runbook можно использовать как ежедневный шаблон эксплуатации.

## Self-hosted модель deployment

TradeJS распространяется как набор публичных npm-пакетов, а не как managed trading service. Production-инсталляция запускается в среде под вашим управлением и подключается к вашим Redis и PostgreSQL/Timescale.

Соберите и запустите installable app из своего проекта:

```bash
npx tradejs-app build
npx tradejs-app start
```

Используйте собственный process supervisor или container platform для приложения и runtime-команд по расписанию. TLS, ingress, backups, secrets management и monitoring настраиваются в вашей среде.

Публичные пакеты не разворачивают готовую production-инфраструктуру автоматически. Начните с локального [Быстрого старта](../getting-started/quickstart), затем осознанно замените локальные сервисы production-инфраструктурой.

## Ежедневные проверки

1. Проверка статуса сервисов (`docker compose ps` или оркестратор).
2. Проверка зависимостей через `npx @tradejs/cli doctor`.
3. Smoke-проверка API и базовых страниц UI.
4. Контроль доступности Redis/Postgres и нагрузки.

## Диагностика инцидента

1. Определите проблемный слой: app, connectors, Redis, Postgres, ML, AI.
2. Снимите логи до рестарта (если ситуация не критическая).
3. Поймите масштаб: глобально или только часть стратегий/символов.
4. Примените локальную меру и оцените эффект.

## Рекомендуемый порядок рестарта

1. `timescale`, `redis`
2. `ml-infer`
3. `app`
4. `nginx`/ingress при необходимости

## Автоматизация research в source repository

Launchers `research:auto` и `agent-run` являются maintainer workflows основного
TradeJS source repository. Им нужны repo-specific branches, worktrees, checks и
push credentials, поэтому они не поддерживаются как внешний npm deployment
flow. Такую автоматизацию следует держать во внутреннем runbook TradeJS, а не
добавлять в deployment приложения на публичных пакетах.

## Rollback

- Храните предыдущие теги образов `app` и `ml-infer`.
- При необходимости откатывайте приложение и модельные alias независимо.
- После отката прогоняйте `doctor` и smoke-проверки.
