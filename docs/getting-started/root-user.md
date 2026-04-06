---
title: Root User Setup
---

TradeJS CLI defaults to `--user root`, so creating a valid `root` account is the fastest way to start.

## 1. Create or Update Root User

```bash
npx @tradejs/cli user-add -u root -p 'StrongPassword123!'
```

What this does:

- hashes password with `bcrypt`
- writes user record to Redis key `users:index:root`
- creates a persistent token automatically for `root` if it is missing
- keeps account-level settings in the same Redis user record

## 2. Check User in Redis

```bash
redis-cli JSON.GET users:index:root
```

You should see at least:

- `userName`
- `passwordHash`
- `updatedAt`
- `token` (for `root`)

After you save account settings in the UI, the same record can also contain:

- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_API_ENDPOINT`
- `TG_BOT_TOKEN`
- `TG_CHAT_ID`

## 3. Sign In to the App

1. Open your TradeJS sign-in page (or your API client).
2. Log in with `root` and your password.
3. Open the account settings drawer from the gear icon in the left sidebar.
4. Configure the settings you need for this user:
   - Bybit API key/secret
   - password rotation
   - persistent token for passwordless auth
   - OpenAI API key/endpoint
   - Telegram bot token/chat id
5. For API-only flows, use the persistent token from Redis or from the account settings drawer.

## 4. Rotate Password or Token

Set new password:

```bash
npx @tradejs/cli user-add -u root -p 'NewStrongPassword456!'
```

Set explicit token:

```bash
npx @tradejs/cli user-add -u root -p 'NewStrongPassword456!' -t 'my-static-token'
```

Notes:

- Password and token can also be rotated from the account settings drawer after sign-in.
- Secret values are stored in Redis per user and shown masked in the UI.
