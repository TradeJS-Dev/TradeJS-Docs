---
title: Local Root User
---

The local setup page creates the `root` account and asks you to choose its
password. TradeJS commands use `--user root` by default.

Use the steps below only when setting up an existing project manually or
rotating the password from the command line.

## Create or Update the User

Run this in Bash from the project folder with Redis running:

```bash
read -r -s -p 'New TradeJS password: ' tradejs_password
printf '\n'
npm exec -- tradejs user-add --user root --password "$tradejs_password"
unset tradejs_password
```

The command hashes the password with bcrypt and saves the local user record in
Redis. Do not put the password in scripts, version control, screenshots, or
shared shell history.

## Sign In and Configure Services

1. Open the TradeJS sign-in page.
2. Sign in as `root` with the selected password.
3. Open account settings from the gear icon in the left sidebar.
4. Use **Integrations** for exchange accounts, provider keys and Telegram
   credentials. Use **Notifications** to choose Telegram message types, and
   **Security** to change your password.

Secrets are stored per user and displayed masked in the web app. Exchange keys
should have only the permissions required for the intended workflow; withdrawal
permission is not required for trading.

## Rotate the Password

Change the password in account settings or reuse the command in the first section.

## Diagnose Manual Setup

If sign-in fails after manual setup, confirm that Redis is running, the command
used the intended Redis instance, and the selected username is `root`. The
stored record contains a password hash rather than the original password.

For a normal first installation, return to
[Run your first backtest](./first-backtest). Before live execution, add the
intended exchange account and continue with
[Run a Strategy in Production](./run-strategy-in-production).
