---
title: Environment Variables Reference
---

This page groups the most important environment variables by area.

## Application

- `APP_URL` - public app URL.
- `HOST` / `PORT` - HTTP binding for app process.
- `NODE_ENV` - `development` or `production`.
- `NEXTAUTH_SECRET` - required for session/token security.
- `NEXTAUTH_URL` - public URL used by auth callbacks.

## Per-User Settings in Redis

TradeJS also stores account-specific settings in the Redis user record (`users:index:<user>`):

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `token`
- `OPENAI_API_KEY`
- `OPENAI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

The web app manages these values from the account settings drawer opened by the gear icon in the left sidebar.

## Data Services

- `REDIS_HOST`, `REDIS_PORT`
- `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
- `ML_GRPC_ADDRESS` (for runtime inference)

## ML Training

- `ML_TRAIN_RECENT_DAYS`
- `ML_TRAIN_TEST_DAYS`
- `ML_TRAIN_WALK_FORWARD_FOLDS`
- `ML_TRAIN_FEATURE_PROFILE` (`all` or `robust`)
- `ML_TRAIN_FEATURE_SET` (`legacy` or `enriched`)
- `ML_TRAIN_ENSEMBLE`
- `ML_TRAIN_ENSEMBLE_MEMBERS`

## Practical Recommendations

- Keep `.env.example` safe and generic; never commit secrets.
- In production, inject secrets from a secret manager.
- For local setup, run `npx @tradejs/cli infra-init` once, then `npx @tradejs/cli infra-up`.
- Validate environment with `npx @tradejs/cli doctor` before enabling live orders.
- Prefer the account settings drawer for user-scoped API keys and tokens instead of sharing one global `.env` secret across operators.
- `OPENAI_*` and `TG_*` are not app environment variables anymore; store them on the user record in Redis.
