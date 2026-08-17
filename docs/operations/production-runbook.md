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

The official repository split uses `TradeJS-Project` for package composition,
`tradejs.config.ts`, secret-free runtime defaults, and the app image.
`TradeJS-Deploy` owns production Compose, TLS, volumes, SSH, resource policy,
and secrets. The Project dispatches an immutable image tag and Project revision
to Deploy; Deploy does not rebuild application source. See
[Repository and package ownership](../advanced/repository-ownership).

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

The `research:auto` and `agent-run` launchers are maintainer workflows, not a
supported external npm deployment flow. The agent image is built from TradeJS,
but a strategy change is committed and proposed in that strategy's standalone
repository. Its machine identity therefore needs access only to the engine and
the strategy repositories in scope, not application or deployment secrets.

## Rollback

- Keep previous image tags for `app` and `ml-infer`.
- Roll back app and model aliases independently when required.
- Verify runtime with `doctor` and smoke checks after rollback.
