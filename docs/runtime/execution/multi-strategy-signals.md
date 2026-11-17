---
title: Running Multiple Strategies
---

The server evaluates enabled strategies when candles close. To run strategies
for different accounts or candle intervals, define the deployments in
`tradejs.config.ts`.

## How Setups Are Separated

For each enabled strategy, TradeJS resolves:

- strategy name, version, and complete configuration;
- timeframe and market universe;
- connector and trading account;
- deployment-level symbols and any strategy-specific `selection.tickers`;
- risk and policy settings.

Each unique combination is evaluated independently. A command-line filter can
narrow the current run, and `--tickers` can temporarily replace its resolved
symbol set.

If a removed symbol still has an open position, it remains active for exit and
position-management decisions.

## Decisions on the Same Symbol

Every applicable strategy evaluates the same latest closed candle and records
its own decision. Separate strategies may produce opposing signals. TradeJS does
not assume that these signals form a portfolio decision: account-level risk
rules and project hooks must define net exposure, position limits, hedging, and
conflict handling.

Two enabled instances of the same strategy cannot target the same account in
one process because their positions and decisions would be ambiguous. Use a
different account or disable one instance.

## Examples

The app container starts signal evaluation for the configured deployments.
Open **Strategies** to see their state and settings. Use
[replay](../backtesting/replay-evidence) to investigate past decisions.
