---
title: Orders / positions
---

An order tells an exchange what to buy or sell. A position records the trade
exposure after orders fill. The strategy proposes an `orderPlan`, then TradeJS
and the exchange connector handle the request and track the result.

## Order Plan

An entry decision should provide:

- `direction`
- `qty`
- `stopLossPrice`
- take-profit prices when the strategy uses fixed targets

The shared runtime resolves execution fields such as timestamp, current price, and signal metadata from runtime context.

## Position Lifecycle

A position can close through:

- take-profit
- stop-loss
- strategy `exit`
- runtime hook
- connector or exchange-side status

Backtest fills are approximations. Live fills depend on exchange liquidity, latency, order type, and connector behavior.

When a connector supports combined position protection, TradeJS can apply a
full take-profit and stop-loss in one exchange request. On Bybit, a plan with
one 100% target and a stop uses Full protection with `LastPrice` triggers.
Plans with partial or multiple targets continue to use separate protective
updates.

## Automation Safety

Before enabling order placement:

- verify config and position sizing
- account for fees and slippage
- start with a small, fixed risk allocation
- monitor connector errors
- keep a rollback path

See [Pre-Live Strategy Checklist](../strategies/operations/pre-live-checklist).
