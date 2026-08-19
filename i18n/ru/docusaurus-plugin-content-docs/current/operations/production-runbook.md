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

В официальной схеме `TradeJS-Project` владеет package composition,
`tradejs.config.ts`, secret-free runtime defaults и app image.
`TradeJS-Deploy` владеет production Compose, TLS, volumes, SSH, resource policy
и secrets. Project передаёт в Deploy immutable image tag и revision проекта;
Deploy не пересобирает application source. Подробнее:
[Владение репозиториями и пакетами](../advanced/repository-ownership).

## Config и rollout

- Полные deployment и strategy configs храните в `tradejs.config.ts`.
- При изменении package или config увеличивайте `version` только затронутой
  стратегии; exact npm versions остаются в lockfile и image manifest.
- Beta packages проверяйте в isolated production-like Project image. Stable
  packages промоутятся scheduled release channel, после чего собирается один
  Project image со stable composition.
- После deploy выполняйте `runtime-control verify`. Redis не является source
  конфигов: он хранит accounts, optional pause overrides, audit events,
  heartbeat, signals, evaluations и trades.
- UI показывает config read-only и может только pause/resume новые входы.

При breaking migration перед удалением старых `users:<user>:strategies*` и
Redis deployment docs создайте backup и пройдите restore drill. Allowlisted
cleanup должен сохранить controls, control events, accounts, heartbeats,
signals, evaluations и trades.

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

Launchers `research:auto` и `agent-run` являются maintainer workflows, а не
поддерживаемым внешним npm deployment flow. Agent image собирается из TradeJS,
но изменение стратегии коммитится и предлагается в отдельном репозитории этой
стратегии. Machine identity нужен доступ только к движку и strategy repositories
в scope, но не к application или deployment secrets.

## Rollback

- Храните предыдущие теги образов `app` и `ml-infer`.
- При необходимости поставьте entries на pause и откатите Project image; Redis
  release pointer больше нет.
- При необходимости откатывайте приложение и модельные alias независимо.
- После отката прогоняйте `doctor` и smoke-проверки.
