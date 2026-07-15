---
title: What TradeJS is not
---

TradeJS is intentionally scoped as a research, backtesting, signal, and automation framework. It does not remove trading risk.

## Not a Hosted Trading SaaS

TradeJS is distributed as public npm packages and is designed to run locally or on infrastructure you operate. You are responsible for deployment, data services, credentials, monitoring, and upgrades.

## Not HFT

TradeJS is not a high-frequency trading engine. It is built around candle-based strategy workflows and is best treated as a slower systematic research/runtime tool. Recommended strategy timeframes start at `5m+`; many examples use `15m`.

## Not Financial Advice

TradeJS does not tell you what to buy or sell. Strategy code, configuration, data selection, and risk decisions remain your responsibility.

## No Assured Returns

Backtests and AI/ML scores are historical analysis tools. They can help you compare behavior, but they do not predict future returns.

Avoid treating any backtest result as proof that a strategy will work live. Market structure, liquidity, fees, fills, latency, and data quality can all change the outcome.

## Not a Magic Trading Bot

TradeJS can automate parts of a trading workflow, but automation only executes configured logic. It does not create a robust strategy by itself.

Before live execution, validate:

- strategy logic
- data quality
- fee and slippage assumptions
- risk limits
- exchange connector behavior
- monitoring and rollback paths

## Main Focus

TradeJS focuses on:

- research
- backtesting
- signal generation
- strategy comparison
- controlled automation
- analysis of AI/ML-assisted workflows

Read [Backtesting caveats](../limitations/backtesting-caveats) before interpreting results.
