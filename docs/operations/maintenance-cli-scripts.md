---
title: Maintenance and Debug CLI Scripts
---

Use these commands to start and stop local services, check a project, or maintain
its data.

## Dev Infra

Initialize local dev compose file (one-time):

```bash
npm exec -- tradejs infra-init
```

Start infra:

```bash
npm exec -- tradejs infra-up
```

Stop local infra:

```bash
npm exec -- tradejs infra-down
```

## Cleanups

Clean local files under `data/*`:

```bash
npm exec -- tradejs clean-dir --dir cache
npm exec -- tradejs clean-dir --dir ml/export
```

Clean Redis area/prefix:

```bash
npm exec -- tradejs clean-redis --area cache
```

For the local `root` user, the first command removes saved tests and their cache. The second removes only the cache.

```bash
npm exec -- tradejs clean-tests --user root
npm exec -- tradejs clean-tests --user root --cache
```

## User Management

For account setup or password changes, see [Local Root User](../getting-started/root-user).

## Environment Health

```bash
npm exec -- tradejs doctor
npm exec -- tradejs doctor --require-ml
npm exec -- tradejs doctor --skip-ml
```
