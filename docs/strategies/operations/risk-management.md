---
title: Risk Management
---

Risk controls should be explicit, testable, and independent of the entry
signal. A strategy with positive expectancy can still fail through excessive
size, correlated exposure, execution problems, or an uncontrolled loss path.

## Position Risk

Define the maximum loss allowed when the initial stop is reached. For a simple
linear instrument:

```text
risk per unit = |entry price - stop price| × contract multiplier
quantity      = loss budget / risk per unit
```

Adjust this calculation for fees, expected slippage, inverse contracts, lot
size, minimum notional, and venue rounding. Leverage changes margin usage and
liquidation distance; it does not reduce the economic risk of the position.

Reject an entry when the stop is invalid, the calculated quantity is below
venue minimums, the loss budget would be exceeded after rounding, or liquidity
cannot support the order.

## Portfolio Exposure

Set limits above the individual strategy:

- gross and net notional exposure;
- long and short exposure by asset class;
- concurrent positions and pending orders;
- exposure to correlated symbols or common risk factors;
- concentration by strategy, venue, and account;
- margin use and distance to liquidation;
- daily and rolling drawdown.

Two strategies with independent entry logic can still produce the same
underlying market exposure. Apply portfolio rules after strategy decisions and
before order placement.

## Loss and Frequency Limits

Useful controls include:

- maximum loss per trade, strategy, day, and account;
- maximum consecutive losses;
- cooldown after an exit or loss;
- maximum new entries per time window;
- reduced size after a volatility or drawdown threshold;
- a hard block on new entries after data, connector, or reconciliation failure.

Define reset conditions explicitly. A daily limit needs an agreed timezone and
a process for handling positions that remain open across the boundary.

## Execution Controls

- Require a valid protective exit for every entry.
- Check spread, liquidity, stale quotes, and maximum price deviation.
- Make order submission idempotent and reconcile unknown outcomes before retrying.
- Treat partial fills, rejections, cancellations, and exchange timeouts as
  separate states.
- Continue managing open positions while new entries are paused.
- Do not assume that an accepted order is filled or that a local timeout means
  the venue rejected it.

## Operational Controls

Keep pause, rollback, monitoring, and account reconciliation available without
editing strategy logic. Test these controls before enabling order placement.
Alert on stale candles, failed cycles, rejected orders, position mismatches,
loss-limit breaches, and unavailable dependencies.

Review risk limits after material changes in volatility, liquidity, account
size, strategy behavior, connector behavior, or venue rules. Version the
configuration and record why each limit changed.

See [Pre-live checklist](./pre-live-checklist) and
[How live signals work](../../runtime/execution/signals).
