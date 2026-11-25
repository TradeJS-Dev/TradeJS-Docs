---
title: Develop with an agent
description: Give your coding agent the public TradeJS documentation and a task it can check in your project.
---

Use this guide when you want an agent to write or test a strategy in your
TradeJS project. Start with your project folder open in the agent.

[Connect through MCP](./mcp) when the agent needs data from a running TradeJS app.

## Give the agent the documentation

Send it the [documentation index](https://docs.tradejs.dev/llms.txt) and the page for the job.
The [TypeScript guide](../strategies/authoring/typescript-strategy-step-by-step)
covers writing a strategy. The [strategy catalog](https://tradejs.dev/marketplace)
links to the rules and settings for existing strategies.

## Run strategy research

Specify the strategy, dates, and market. You can start from an existing
configuration. Codex users can use the [TradeJS research skills](./codex-strategy-skills).

```text
Research an existing HeadAndShoulders configuration. Read earlier runs first.
Use USDT contracts and locally
cached history. Record the exchange, symbols, dates, fees, and settings before
running. Split the data by date. Choose a variant on the earlier period, then
check it on the later period. Report trade count, drawdown, and result after
costs for each period, with the report path.
```

## Create a strategy

Give the agent exact entry, exit, and invalidation rules. Ask it to read the
[public strategy API guide](../strategies/authoring/typescript-strategy-step-by-step) first.

```text
Create a separate TypeScript strategy. After each candle closes, check whether
price broke above the high of the previous 20 closed candles. Exclude the
current candle from the range. Add settings for the stop and target.
Test an entry, a skipped entry, and missing history. Add the strategy to
the local project and run a short backtest. Show the code, tests, and result.
```

## Improve an existing strategy

Ask the agent to reproduce the current behavior first. Compare one rule change
at a time on the same data and settings.

```text
Prepare one HeadAndShoulders change. In an alternative configuration, require
two consecutive closes below the neckline. Keep the current version as the baseline.
Test confirmation, a false break, and expiry. Backtest both variants on the
same candles, dates, and execution settings. Show what changed and save the
report locally.
```

## Run one backtest

Give the agent the strategy name, exchange, symbol, candle interval, and dates.
Ask it to record the settings and report path. The
[HeadAndShoulders example](https://tradejs.dev/marketplace/head-and-shoulders#backtest)
has a complete command.
