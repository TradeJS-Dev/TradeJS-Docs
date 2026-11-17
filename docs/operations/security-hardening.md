---
title: Security Hardening Checklist
---

Use these checks when you set up a server for TradeJS and after you put it into
use.

## Secrets

- No plaintext secrets in git.
- Rotate API keys and auth secrets periodically.
- Use per-environment secret scopes.

## Network

- Expose only required ports.
- Keep DB/Redis private.
- Restrict SSH access and use key auth.

## Application

- Set strong `NEXTAUTH_SECRET`.
- Keep dependencies updated.
- Log security-relevant events.

## Operations

- Enforce least privilege for service accounts.
- Keep backup encryption and retention policy.
- Run periodic vulnerability and dependency audits.
