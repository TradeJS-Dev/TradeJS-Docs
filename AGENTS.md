# AGENTS.md

## Scope

These rules apply to the `TradeJS-Docs` repository.

## Purpose

This repository is the source of truth for `docs.tradejs.dev`.
Keep the docs standalone, buildable with plain `npm`, and publish its immutable
container image without owning production server access.

## Workspace Routing

- This repository is the canonical destination for user-facing documentation,
  “docs”, and “база знаний”. Start from `~/dev/tradejs/AGENTS.md` and do not
  scan sibling repositories unless a documented API must be verified.
- Verify package behavior in its owning source repository, but edit the public
  article here. Internal research notes belong only in
  `tradejs-project/notes/`; marketing/landing copy belongs in `tradejs-site`.
- Use `yarn dev:hot:en` or `yarn dev:hot:ru` for local authoring and
  `yarn checks` for complete verification.

## Audience

- This repo is for external package users.
- Do not document monorepo-only workflows here unless they are explicitly presented as internal-only and clearly labeled.
- Prefer package install flows, public subpath imports, and public URLs.

## Build Rules

- Use `npm install` and `npm run build`.
- Run `yarn checks` before every commit; it typechecks and builds both locales.
- Keep both locales buildable.
- Keep the app runnable with the local `Dockerfile`.
- Treat `ghcr.io/tradejs-dev/tradejs-docs` as the canonical image name.
- If changing deploy automation, keep the production compose service name as `docs`.

## Deploy Rules

- Image publishing runs automatically on pushes to `main` and uses the full
  source SHA as its only image tag.
- Production SSH, Compose, and release state belong to `TradeJS-Deploy`.
- If `GITHUB_TOKEN` cannot publish to GHCR in the organization, use repository secrets `GHCR_USERNAME` and `GHCR_TOKEN`.
- Do not add `SSH_HOST`, `SSH_USER`, or `SSH_KEY` to this repository.
- Deploy the published SHA through the typed `docs` component workflow in
  `TradeJS-Deploy`.

## Editing Policy

- Keep changes focused.
- Preserve stable public URLs whenever possible.
- Keep `static/llms.txt` and `static/llms-full.txt` aligned with current package
  and repository ownership.
- Do not reintroduce `@tradejs/strategies`; strategies are standalone packages,
  with TrendLine and ReverseTrendLine as the only grouped exception.
- Do not reintroduce monorepo-only commands like `yarn workspace @tradejs/docs ...` into the README or workflow examples.
- Document production runtime config as Git-owned
  `tradejs.config.ts` declarations with computed `strategyRevision` and
  `deploymentCompositionId` values. Never document a manually incremented
  runtime version. Do not publish instructions that write
  `users:<user>:strategies:*`, Redis deployment docs, release pointers, or
  evidence artifacts as production config. Redis controls are optional pause
  overrides only.
- Keep the repository-to-repository GitHub secret map aligned with Project and
  Deploy: npm credentials stay in publishing repositories, the immutable
  handoff token is a Project repository secret, and server secrets belong only
  to Deploy repository or Deploy-scoped organization secrets.

## Local Clone Policy

- Keep `TradeJS-Dev` repository clones under `~/dev/tradejs/...`.
- In this environment, use `~/dev/tradejs/investing` for `TradeJS` and
  `~/dev/tradejs/tradejs-docs` for this repo.
- Do not use `/tmp` as a working location for local long-lived clones.
