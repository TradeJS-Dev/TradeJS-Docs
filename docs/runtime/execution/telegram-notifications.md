---
title: Telegram Notifications
---

TradeJS can send signal messages, optional charts and AI commentary, daily
operational summaries, and live/replay comparison reports to Telegram.

## Configure Telegram

1. Sign in to TradeJS.
2. Open account settings from the gear icon in the left sidebar.
3. Save `TG_BOT_TOKEN` and `TG_CHAT_ID`.

The values belong to the current TradeJS user. The bot token is masked in the
web app; the chat id is visible. Set `APP_URL` in the server environment if
messages should include a link to a publicly reachable HTTPS dashboard.

You can test the bot independently:

```bash
curl -s -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\":\"${TG_CHAT_ID}\",\"text\":\"TradeJS test message\"}"
```

Keep the bot token out of shell history, screenshots, logs, and version control.

## Signal Notifications

```bash
npx @tradejs/cli signals \
  --user root \
  --notify \
  --tickers BTCUSDT \
  --cacheOnly
```

Use the same `--user` that owns the Telegram settings. TradeJS stores the
strategy decision before sending the message. Signals blocked or canceled
before order submission remain available for diagnosis but are not sent as
trade notifications.

An accepted signal message can contain its chart and optional AI commentary.
If chart rendering fails, TradeJS sends text instead of dropping the
notification. A failed order attempt can still be reported; the message status
must not be interpreted as a fill confirmation.

## Daily Operational Summary

```bash
npx @tradejs/cli signals-summary \
  --user root \
  --connector bybit
```

The default period is 24 hours. `--hours <count>` changes it, and `--printOnly`
prints the report without sending it.

The summary includes:

- signal counts by strategy and status;
- trade counts and active/closed status;
- current PnL for active trades and closed PnL for closed trades;
- evaluation counts and skip reasons when available.

PnL reconciliation depends on connector support and on orders being tracked by
TradeJS. Always use the venue or broker as the final source for account and
position state.

## Live/Replay Comparison

The production daily comparison is sent only from a verified, sealed runtime
feedback replay bundle:

```bash
npx @tradejs/cli runtime-feedback-notify \
  --bundle <verified-replay-bundle>
```

Use `--dryRun` to verify the bundle and print the message without sending it.
The command checks the manifest, files, and checksums before delivery. It stops
if the replay comparison is missing instead of sending a clean report.

The report shows the time window, connector, deployment and composition,
runtime record counts, comparable entries, matches, failed orders, runtime-only
and backtest-only entries, lineage coverage, excluded runtime trades, and
per-strategy differences.

`runtime-parity` remains available for manual entry diagnostics. Its `--notify`
option can send that manual result, but it is not the source of the production
daily comparison.

See [Compare live and replayed entries](../backtesting/runtime-parity) before
using the report for diagnosis.

## Delivery Behavior

Long reports are split into numbered Telegram messages. Signal messages are
sent one at a time so the chart and optional AI commentary remain adjacent.
Failed delivery is a notification problem and does not change the recorded
strategy or order state.

## Troubleshooting

- **No messages:** verify the settings for the selected TradeJS user and add the
  bot to the intended chat or channel.
- **Text but no image:** check chart rendering and whether `APP_URL` is reachable
  from the TradeJS host.
- **No AI commentary:** confirm that AI evaluation is enabled and completed for
  that signal.
- **Missing PnL:** verify connector reconciliation support and compare with the
  venue's authoritative positions and fills.
- **Several report messages:** this is expected when the report exceeds
  Telegram's message-size limit.
