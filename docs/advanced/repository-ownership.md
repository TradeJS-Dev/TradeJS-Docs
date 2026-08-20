---
title: Repository and Package Ownership
---

TradeJS is a multi-repository system. The repository that owns a behavior is
also where that behavior is tested, versioned, and released.

## From generator to production

1. `npx create-tradejs` creates a standalone npm project.
2. `@tradejs/base` supplies a non-empty default preset.
3. The preset installs public strategy packages, indicators, and connectors.
4. The project owns `tradejs.config.ts`, its lockfile, local data and backtest
   artifacts, and any private strategy dependencies.
5. For self-hosting, `TradeJS-Project` builds a versioned application image and
   supplies its tag and project revision to `TradeJS-Deploy`.
6. `TradeJS-Deploy` owns Compose, TLS, persistent volumes, SSH, server resource
   limits, and production secrets.

The framework repository does not own a user's production config or backtest
artifacts. A deployment repository does not build strategy or application
source.

## Package boundaries

- `TradeJS` publishes the framework engine and shared runtime packages.
- `TradeJS-Base` publishes `@tradejs/base`, the default package composition.
- `TradeJS-Strategy-Kit` publishes strategy-neutral helpers through explicit
  `@tradejs/strategy-kit/*` subpaths.
- Each `TradeJS-Strategy-*` repository publishes its own
  `@tradejs/strategy-*` package.
- `TradeJS-Strategy-Template` and `TradeJS-Workflows` standardize new strategy
  repositories, CI, and publication.

TrendLine and ReverseTrendLine are the only grouped exception. Both live in
`TradeJS-Strategy-TrendLine` and are released together as
`@tradejs/strategy-trend-line` because they share family mechanics. There is no
separate trendline-kit package.

Published Base, Kit, and strategy packages declare their TradeJS runtime
requirements as `peerDependencies`; matching `devDependencies` exist only so
each source repository can build and test independently. The generated project
installs one exact package composition. A package must not hide a second copy of
the engine under `dependencies`.

## Public and private strategies

The default preset depends on the complete public catalog. A project can use
the preset, list only selected public packages, or add a private package:

```ts
import { basePreset } from '@tradejs/base';
import { defineConfig } from '@tradejs/core/config';

export default defineConfig(basePreset, {
  strategies: ['@your-scope/private-strategy'],
});
```

Private registry authentication belongs to the generated project or its build
environment. A publishing token for public TradeJS packages should never be
copied into a runtime or deployment repository.

## Updating packages in a deployed project

Use stable package versions for live trading. Update the exact dependency and
lockfile in the project, update the complete strategy declaration, and run the
project checks. Every strategy parser rejects unknown fields and materializes
defaults. Validation computes `strategyRevision` from the exact strategy
package, its direct TradeJS dependencies, the runtime package, and parsed
effective config. `deploymentCompositionId` binds the deployment target,
enabled state, selections, and all strategy revisions. There is no manual
runtime version.

A push to Project updates source only. Publishing its immutable application
image and dispatching that exact SHA to Deploy is a separate explicit workflow.
Publishing a strategy package does not change a running TradeJS installation.

## Where to make a change

- Change strategy decisions, figures, adapters, or family helpers in that
  strategy repository.
- Change a helper shared by unrelated strategies in `TradeJS-Strategy-Kit`.
- Change the default public composition in `TradeJS-Base`.
- Change personal composition, runtime defaults, or the app image in
  `TradeJS-Project`.
- Change server topology, credentials, TLS, volumes, or rollout policy in
  `TradeJS-Deploy`.
- Change shared runtime semantics and public framework contracts in `TradeJS`.
