---
title: Telegram Notifications
---

TradeJS can send signal messages to Telegram from `npx @tradejs/cli signals --notify`.

## 1. Configure Telegram

Preferred setup for app users:

1. Sign in to TradeJS.
2. Open the account settings drawer from the gear icon in the left sidebar.
3. Save:
   - `TG_BOT_TOKEN`
   - `TG_CHAT_ID`

These values are stored in the current Redis user record.

`@tradejs/node` / `@tradejs/cli` resolve settings in this order:

- `TG_BOT_TOKEN` from user settings
- `TG_CHAT_ID` from user settings
- `APP_URL` from environment

Notes:

- TradeJS uploads the rendered screenshot to Telegram with the signal caption.
- If `APP_URL` is a public HTTPS URL, the Telegram message also includes a dashboard button.
- If screenshot rendering fails or the PNG is missing, TradeJS falls back to a text message instead of dropping the notification.
- `TG_CHAT_ID` is not masked in the settings UI; secrets like bot token are masked until you explicitly edit them.

## 2. Quick Bot Check

```bash
curl -s -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\":\"${TG_CHAT_ID}\",\"text\":\"TradeJS test message\"}"
```

## 3. Send Notifications from Signals

```bash
npx @tradejs/cli signals --user root --notify --tickers BTC --cacheOnly
```

Flow:

1. Script finds signals.
2. Script loads AI analysis from Redis key `analysis:<symbol>:<signalId>` if present.
3. TradeJS sends the main signal message and uploads the screenshot when available.
4. If AI analysis exists, TradeJS sends one follow-up analysis message.

Use the same `--user` value that owns the Telegram settings in Redis.

## 4. Common Troubleshooting

- No messages at all:
  check the saved account settings for that user and whether bot is added to chat/channel.
- Message without image:
  check screenshot generation and whether the app can render the dashboard page configured by `APP_URL`.
- Missing AI follow-up:
  check that `analysis:<symbol>:<signalId>` exists in Redis.
