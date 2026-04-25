---
title: Руководство по эксплуатации продакшена
---

Этот runbook можно использовать как ежедневный шаблон эксплуатации.

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

## Ночная автоматизация исследований

Если вы запускаете автоматические исследования стратегий в продакшене, держите
их в отдельном контейнере `agent`, а не внутри основного процесса приложения.

Рекомендуемый паттерн:

- контейнер `app` обслуживает UI, API, runtime signals и обычные operational cron-задачи
- контейнер `agent` запускает только ночной research/agent cron
- nightly flow стартует с `npx @tradejs/cli research:auto` по фиксированному расписанию,
  например в `00:00` по `Europe/Moscow`
- `research:auto` выбирает стратегию с самым старым или отсутствующим research run,
  сохраняет эффективный config как `<Strategy>:research`, выполняет
  `backtest --ai -> ai-export -> ai-train --localOnly`, пишет run в Redis,
  отправляет Telegram-отчет и затем вызывает `npx @tradejs/cli agent-run`
- `agent-run` использует OpenRouter с `openai/gpt-5.4`, `reasoning effort=medium`,
  создаёт review-ветку от `stable`, валидирует патч и пушит отдельную ветку
  для ручного разбора

Требования к deployment:

- смонтировать в `agent` контейнер полноценный clone репозитория с `.git`
- передать в `agent` контейнер GitHub credentials для push, обычно через
  отдельный SSH key только для branch pushes
- хранить OpenRouter и Telegram credentials в runtime user settings, которые
  использует CLI

Минимальные настройки:

- `OPENAI_API_ENDPOINT=https://openrouter.ai/api/v1`
- `OPENAI_API_KEY=<OpenRouter key>`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

## Rollback

- Храните предыдущие теги образов `app` и `ml-infer`.
- При необходимости откатывайте приложение и модельные alias независимо.
- После отката прогоняйте `doctor` и smoke-проверки.
