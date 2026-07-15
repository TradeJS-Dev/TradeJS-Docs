---
title: Production Runbook
---

Use this runbook as a daily operational checklist.

## Self-Hosted Deployment Model

TradeJS is distributed as public npm packages, not as a managed trading service. A production installation runs in an environment you operate and connects to Redis and PostgreSQL/Timescale services you control.

Build and start the installable app from your project:

```bash
npx tradejs-app build
npx tradejs-app start
```

Use your own process supervisor or container platform for the app and scheduled runtime commands. Provide TLS, ingress, backups, secrets management, and service monitoring according to your environment.

The public packages do not provision a turnkey production environment. Start with the local [Quickstart](../getting-started/quickstart), then replace local infrastructure with your production services deliberately.

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

## Repository Research Automation

The `research:auto` and `agent-run` launchers are maintainer workflows for the
TradeJS source repository. They require repository-specific branches,
worktrees, checks, and push credentials, so they are not a supported external
npm deployment flow. Keep source-repository automation in the internal TradeJS
runbook rather than adding it to an application deployment based on the public
packages.

## Rollback

- Keep previous image tags for `app` and `ml-infer`.
- Roll back app and model aliases independently when required.
- Verify runtime with `doctor` and smoke checks after rollback.
