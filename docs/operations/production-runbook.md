---
title: Production Runbook
---

Use this runbook as a daily operational checklist.

## Daily Health Checks

1. `docker compose ps` or service manager status.
2. `npx @tradejs/cli doctor` (or equivalent in runtime environment).
3. Verify API responsiveness and basic UI pages.
4. Check Redis/Postgres connectivity and resource usage.

## Incident Triage

1. Identify failing layer: app, connectors, Redis, Postgres, ML, AI provider.
2. Capture logs first (do not restart immediately unless severe).
3. Confirm whether issue is global or symbol/strategy-specific.
4. Apply scoped mitigation.

## Restart Order (Typical)

1. Data services (`timescale`, `redis`)
2. ML inference service
3. App service
4. Reverse proxy / ingress if needed

## Nightly Research Automation

If you run automated strategy research in production, keep it in a separate
`agent` container rather than inside the main app process.

Recommended pattern:

- `app` container handles UI, APIs, runtime signals, and normal operational cron.
- `agent` container runs only the nightly research/agent cron.
- nightly flow starts with `npx @tradejs/cli research:auto` on a fixed schedule
  such as `00:00` in `Europe/Moscow`.
- `research:auto` picks the strategy with the stalest or missing research run,
  snapshots the effective strategy config into `<Strategy>:research`, runs
  `backtest --ai -> ai-export -> ai-train --localOnly`, saves the run in Redis,
  sends a Telegram report, and then invokes `npx @tradejs/cli agent-run`.
- `agent-run` uses OpenRouter with `openai/gpt-5.4`, reasoning effort `medium`,
  creates a review branch from `stable`, validates the patch, and pushes a
  separate branch for manual inspection.

Deployment requirements:

- Mount a writable repo clone with `.git` into the `agent` container.
- Provide GitHub push credentials to the `agent` container, typically via an SSH
  key dedicated to branch pushes.
- Store OpenRouter and Telegram credentials in the runtime user settings used by
  the CLI.

Minimum settings:

- `OPENAI_API_ENDPOINT=https://openrouter.ai/api/v1`
- `OPENAI_API_KEY=<OpenRouter key>`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

## Rollback

- Keep previous image tags for `app` and `ml-infer`.
- Roll back app and model aliases independently when required.
- Verify runtime with `doctor` and smoke checks after rollback.
