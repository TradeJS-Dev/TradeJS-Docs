---
title: MCP for Codex and Claude Code
description: Connect Codex or Claude Code to TradeJS to read data and run backtests.
---

Connect Codex or Claude Code to your TradeJS app to discuss markets, strategy
signals and backtest results with an assistant. Through MCP, the assistant can
read app data and run backtests or diagnostics if you grant permission.

The MCP address is `https://YOUR_APP_HOST/mcp`. Replace `YOUR_APP_HOST` with
your app's host. Open **MCP** in the TradeJS sidebar to find the address
and view your connections.

## Connect Codex

Run these commands in your terminal, using your app's address:

```bash
codex mcp add tradejs --url https://YOUR_APP_HOST/mcp
codex mcp login tradejs --scopes market:read,runtime:read,backtests:read,backtests:run,diagnostics:read,diagnostics:run
```

Sign in to TradeJS in the browser and choose the assistant's permissions.
Permissions ending in `:read` are enough to inspect data. Permissions ending
in `:run` allow background jobs and start unchecked on the consent page.

Codex CLI and the Codex desktop app can use the same connection. Refresh the
connection or restart the client if the TradeJS tools do not appear.
No separate API key is needed.

## Connect Claude Code

Run this command in your terminal:

```bash
claude mcp add --transport http tradejs https://YOUR_APP_HOST/mcp
```

In Claude Code, open `/mcp`, select TradeJS and complete authorization in the
browser. Check the client name, redirect address and requested permissions
before approving. Complete sign-in and consent yourself.

## Make your first request

Ask a specific question and include the period you want to examine. For example:

> Show the saved TrendShift signals for BTCUSDT over the last 24 hours
> in the production deployment.

The assistant should first call `tradejs_info` to check the connection and user. Questions about the running app also require
`runtime_get_status`.

The dashboard's **Copy context for AI** button copies the market data provider,
symbol universe, selected symbol, interval, backtest and page link. Paste the
text into your chat and add your question. The visible chart range is not
copied. The assistant can retrieve saved strategy figures with
`runtime_get_signal`, using the details returned by the signal list.

When reading runtime data, specify the deployment and period. Tools accept
`[startTime,endTime)`: the start is included and the end is excluded. Runtime
list requests can cover at most seven days. An empty page does not end the
results; continue until cursor `0`. Cursors last ten minutes and require the
same filters.

Missing saved records alone do not show that a strategy did not run. Skip
counters help with debugging, but checking execution requires reports that
record the exact package versions and configuration.

## Permissions

| Scope | What the assistant can access |
| --- | --- |
| `market:read` | Symbols, current prices, closed candles and indicators |
| `runtime:read` | Deployments, strategy settings, saved signals, evaluations, orders and skip counters |
| `backtests:read` | Backtest configurations, results and job status |
| `backtests:run` | Start and cancel backtests created by this client |
| `diagnostics:read` | Verified reports, their files and job status |
| `diagnostics:run` | Capture runtime evidence, replay it, check parity and cancel this client's jobs |

The assistant sees only tools allowed by the connection's permissions. Reading
a deployment requires a trading account owned by the authenticated user.
MCP cannot place, cancel or close live orders, change strategy configuration,
deploy releases or send notifications.

Revoke access in **MCP**. Revoked tokens stop working on subsequent requests.
Access tokens last 15 minutes, and connection grants last up to 30 days.
The client receives a new refresh token on each refresh.

## Backtests and diagnostics

`backtest_start` runs a backtest using a snapshot of a named configuration
saved in Redis. It uses cached historical data in one process and makes no paid
AI calls.
Each run is limited to 90 past days, 20 symbols and eight parameter
combinations. Result summaries are saved even in `fast` mode.

Before starting diagnostics, check existing reports with
`diagnostics_list_reports`. If no suitable report exists, `diagnostics_start`
can capture up to seven days of runtime evidence or replay a verified evidence
bundle from the same deployment.

Starting a job returns its `jobId`. Use it to check status with `job_get`, read
logs with `job_get_logs` or cancel with `job_cancel`. Disconnecting the client
does not cancel a job. When repeating an identical request, reuse its
`idempotencyKey` to avoid creating a duplicate.

Each user can have one active job and submit ten jobs per hour. Jobs have a
one-hour time limit, and their state is retained for seven days. Restarting
the worker marks interrupted jobs as `failed`; they do not restart automatically.

### Job logs

Call `job_get_logs` with the `jobId` and `offset: 0`. Set `limit` to between
1 and 100 entries; the default is 50. Pass `nextOffset` to read the next page.
A value of `null` means the end of the log.

Logs contain stdout and stderr with secrets redacted, including after a job
fails. Only the last 150 entries are kept, with up to 1,000 characters per
entry. Offsets may change while the job runs. The `retainedLines` field shows
the number of retained entries.

### Report files

`diagnostics_get_report` returns a report or summary. Use `artifact_get` to
download files. It returns base64 chunks of up to 48,000 bytes. Continue with
`nextOffset` until it is `null`, decode the chunks and concatenate the bytes.
Before analysis, verify the total size and SHA-256 from the response, as well
as the report's period and package versions.

The catalog includes completed `runtime-evidence` and `runtime-feedback`
reports that pass ownership, access, size and checksum checks. Each data or
log file is limited to 64 MiB. Use local TradeJS commands for larger files.
The catalog reports when its search was truncated.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| `401` response | Access may have expired or been revoked. Complete authorization again yourself. |
| `403` for a browser origin | Compare the request address with the server's configured public address. |
| A tool is missing | Check the granted permissions in **MCP**. |
| A job will not start | Check background job availability with `tradejs_info`. If unavailable, contact the app owner. |

Use the Project's `AGENTS.md` and the `$tradejs-mcp` skill in `.codex/skills`
to give the assistant Project instructions. In Claude Code, `CLAUDE.md` imports
the same instructions. Update installed skills with
`create-tradejs --update-skills`. If managed files have local changes,
reconcile those changes before retrying the update and running Project checks.
