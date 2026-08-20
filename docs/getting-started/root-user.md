---
title: Local Root User
---

TradeJS CLI commands default to `--user root`. In a project created with
`npx create-tradejs`, the installation page creates this local user and asks you
to choose its password.

Use the steps below only when setting up an existing project manually or
rotating the password from the command line.

## Create or Update the User

```bash
npx @tradejs/cli user-add \
  --user root \
  --password 'StrongPassword123!'
```

The command hashes the password with bcrypt and saves the local user record in
Redis. Do not put the password in scripts, version control, screenshots, or
shared shell history.

## Sign In and Configure Services

1. Open the TradeJS sign-in page.
2. Sign in as `root` with the selected password.
3. Open account settings from the gear icon in the left sidebar.
4. Add only the settings you need, such as exchange credentials, an AI provider
   key, or Telegram settings.

Secrets are stored per user and displayed masked in the web app. Exchange keys
should have only the permissions required for the intended workflow; withdrawal
permission is not required for trading.

## Rotate the Password

Change it from account settings or run:

```bash
npx @tradejs/cli user-add \
  --user root \
  --password 'NewStrongPassword456!'
```

## Diagnose Manual Setup

If sign-in fails after manual setup, confirm that Redis is running, the command
used the intended Redis instance, and the selected username is `root`. The
stored record contains a password hash rather than the original password.

For a normal first installation, return to
[Run your first backtest](./first-backtest).
