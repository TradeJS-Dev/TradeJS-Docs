---
title: MCP for Codex and Claude Code
description: Connect an AI assistant to your self-hosted TradeJS app through OAuth.
---

TradeJS exposes a Streamable HTTP MCP endpoint at `/mcp`. Codex and Claude Code
can inspect markets, charts, runtime strategies, signals, recorded orders and
backtest results, and request bounded background backtests or diagnostics.
The assistant runs in your chosen client. The former dashboard AI chat drawer
is replaced by MCP; runtime AI/ML gates and Telegram workflows remain separate.

## Requirements

Install a coordinated TradeJS release containing the MCP app routes and the
`tradejs mcp-worker` command. Earlier published releases do not expose these
features. Set `MCP_PUBLIC_URL=https://YOUR_APP_HOST/mcp` (or the same public
`APP_URL` origin). HTTPS is required except for localhost development.
`MCP_ENABLED=false` disables new MCP/OAuth requests. Redis persists OAuth grants,
revocations, job state and audit records; use durable Redis storage.

Open **MCP** in the app sidebar to see your endpoint and active connections.
The browser session authorizes your own TradeJS user. You review the client,
redirect address and requested scopes before approving. Clients use OAuth
Authorization Code with S256 PKCE and public dynamic client registration.
Access tokens last 15 minutes; refresh tokens rotate and grants expire after
30 days. Revoking a connection invalidates its tokens on subsequent requests.
The human performs login and consent; an agent must not authorize itself.

## Connect Codex

Run these commands yourself, replacing the host:

```bash
codex mcp add tradejs --url https://YOUR_APP_HOST/mcp
codex mcp login tradejs --scopes market:read,runtime:read,backtests:read,backtests:run,diagnostics:read,diagnostics:run
```

Codex CLI and the desktop app can use the same configured remote server. Restart
or refresh the client if it does not show the new tools. No API key is needed.

## Connect Claude Code

```bash
claude mcp add --transport http tradejs https://YOUR_APP_HOST/mcp
```

In Claude Code open `/mcp`, select TradeJS and complete browser authorization.
Use a current client supporting Streamable HTTP, OAuth discovery, public
registration and S256 PKCE. Actual browser consent is always user-managed.

## Permissions and tools

| Scope | Available operations |
| --- | --- |
| `market:read` | Symbols, current tickers, closed candles and indicators |
| `runtime:read` | Accessible deployments, effective strategies, stored signals/evaluations/orders and skip counters |
| `backtests:read` | Saved configs and results, job status |
| `backtests:run` | Start/cancel your client's cached backtests and read their status |
| `diagnostics:read` | Verified evidence/feedback reports, chunked artifacts and job status |
| `diagnostics:run` | Capture evidence, run isolated feedback replay/parity, cancel your client's jobs |

On the consent page, select only the permissions you need. Run permissions
start unchecked, including when the client requests all scopes. If the client
omits scope, the page offers the supported scopes for your explicit selection.

Tools only appear for granted scopes. Reading a deployment requires a trading
account bound to the authenticated user. Scopes cannot grant live order
placement/cancellation, runtime config writes, deployment or notifications.

First call `tradejs_info` to check the host/user and worker, then
`runtime_get_status` for production questions. Use explicit deployments and
half-open timestamp windows `[startTime,endTime)`. Missing retained records are
not proof of no activity. Runtime list windows are at most seven days. Continue
through empty pages until cursor `0`; runtime cursors expire after ten minutes
and must be reused with identical filters. Aggregate skip counters are debug
telemetry, not immutable composition-bound evidence.

The dashboard's **Copy context for AI** button copies the provider, universe,
symbol, interval, optional backtest selection and page link. Paste it into your
client and state the period you want analyzed. The viewport itself is not
captured. Saved strategy figures are available in `runtime_get_signal`, using
the signal id, timestamp, strategy and deployment returned by the list.

## Background worker

Run `yarn mcp:worker` from the Project after generating its
`runtime-package-manifest.json`. The worker must use the same exact package
composition as the app. Production Compose provides the optional `mcp` profile
with a separate bounded worker and ephemeral `mcp-replay-redis`; enable it as
part of the normal release workflow after publishing a compatible app image.
Set `MCP_WORKER_ENABLED=true` in the Git-owned Project `deploy/runtime.env`
for that release. The rollout stops the old worker, reconciles the new worker
and checks its package manifest; rollback restores the worker with the app.
Interrupted jobs fail instead of automatically restarting. The default is
`false`. Do not start the trading entrypoint as a worker or mount a Docker socket.

`backtest_start` snapshots a named Redis grid and accepts up to 90 past days,
20 symbols and eight config combinations. It uses cached history, one process
and no paid AI calls. Lightweight result summaries are persisted even in fast
mode and are available through the paginated backtest result tools. `diagnostics_start` captures up to seven days of runtime
evidence or replays a verified evidence artifact for its exact deployment.
Replay requires `MCP_REPLAY_REDIS_HOST` pointing at an isolated Redis, read-only
Timescale, stripped credentials, disabled orders and matching recorded
package/image lineage. Existing safety checks reject incompatible evidence.

Jobs return immediately. Keep the job id, poll `job_get` and reuse an
`idempotencyKey` only for an identical request. A client disconnect does not
cancel work. Use `job_cancel` explicitly. Worker restarts mark interrupted
jobs failed and never automatically replay them. Limits: one active computation,
one hour per job and ten submissions per user per hour. Job state expires after
seven days; generated artifacts follow the Project's retention policy.

## Verified reports without SSH

Use `diagnostics_list_reports` before requesting new work. The catalog discovers
sealed runtime-evidence and runtime-feedback bundles under `data/runtime-evidence`,
`data/runtime-feedback` and the user's `data/mcp` directory. It checks ownership,
current deployment access, completion markers, sizes and SHA-256 hashes.
Invalid, incomplete or inaccessible bundles are excluded. Catalog payloads and
logs are limited to 64 MiB each; use the dedicated offline CLI workflow for
larger bundles. The bounded catalog
reports when its scan is truncated; absence is not proof of no production run.

Use `diagnostics_get_report` for a report or summary. `artifact_get` returns
base64 chunks with offsets, total bytes and SHA-256. Concatenate decoded bytes,
check both size and checksum, then analyze locally with the relevant skill.
Original payload downloads are not a substitute for checking lineage and
coverage. Calibration, scorecards, formal strategy research and deployment
still use their dedicated CLI workflows; no arbitrary command or path tool is
exposed. Do not silently fall back to SSH when a scope or artifact is missing.

## Skills and troubleshooting

The canonical skills live in `investing/.codex/skills`; `$tradejs-mcp` describes
the client workflow. Existing Projects update through `create-tradejs
--update-skills` and Project checks. The updater preserves modified managed
files by refusing to overwrite them; reconcile those changes before retrying.
Follow the Project `AGENTS.md` for both clients. `CLAUDE.md` imports that file
and points Claude Code at the same `.codex/skills` source without duplicating it.

A `401` response includes OAuth resource discovery. Reauthorize yourself after
revocation or expiry. `403` for browser origins means the configured public URL
differs from the request origin. An unavailable worker means no job is queued.
Start with a local test user and cached history, then verify consent, refresh,
revocation and cross-user isolation in both installed clients before rollout.
