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
and secrets. The Project supplies a versioned image tag and project revision
to Deploy; Deploy does not rebuild application source. See
[Repository and package ownership](../advanced/repository-ownership).

## Configuration and rollout

- Keep full deployment and strategy config in `tradejs.config.ts`.
- Increment only the affected strategy's `version` when its package, config,
  or ticker selection changes; exact npm versions remain in the lockfile and
  image manifest.
- Use stable package versions for live trading. Test upgrades in an isolated
  environment before building the application image.
- After deploy, run `runtime-control verify`. Redis is not a deployment/config
  source; it holds accounts, optional pause overrides, audit events, heartbeat,
  signals, evaluations, and trades.
- The UI is read-only for config and may only pause/resume new entries.

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

## Rollback

- Keep previous image tags for `app` and `ml-infer`.
- Pause entries when operationally necessary, then roll back the Project image;
  do not move a Redis release pointer.
- Roll back app and model aliases independently when required.
- Verify runtime with `doctor` and smoke checks after rollback.
