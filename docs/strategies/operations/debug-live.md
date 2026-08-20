---
title: Diagnose Live Trading Behavior
---

Diagnose an unexpected result by following the decision and order lifecycle in
order. First define the exact strategy, account, symbol, candle timestamp, and
expected outcome.

## 1. Verify the Deployed Setup

```bash
npx @tradejs/cli runtime-control verify \
  --user <user> \
  --deployment <deployment>
```

Confirm the strategy package version, strategy `version`, complete
configuration, account, connector, timeframe, symbol selection, enabled state,
and pause state. Compare them with the reviewed revision, not with a local draft.

## 2. Verify Market Data

Check that the decision candle is closed, present once, timestamped correctly,
and identical across the live record and replay source. Verify warm-up history
and any required derivatives, spread, global-market, or on-chain context.

If the strategy was not evaluated, investigate symbol selection, candle
freshness, timeframe, process health, and data gaps before inspecting entry
logic.

## 3. Trace the Strategy Decision

Determine whether the strategy returned `skip`, `entry`, or `exit` and inspect
the recorded reason and inputs. Recalculate the relevant indicators and state
at that timestamp. Do not use data from later candles during diagnosis.

If replay and live evaluation disagree, compare package/configuration versions,
warm-up length, timestamp alignment, and external context first.

## 4. Trace Filters and Risk Controls

When an `entry` exists but no order was submitted, inspect each subsequent
decision:

- strategy and project hooks;
- account and portfolio exposure limits;
- pause state and order-placement permission;
- AI/ML or other policy filters;
- sizing, minimum notional, price deviation, and liquidity checks.

Record which control rejected the entry. A missing order is not necessarily a
strategy mismatch.

## 5. Trace the Order Lifecycle

If submission was attempted, follow the client order id through request,
acknowledgement, rejection, partial fill, fill, cancellation, and
reconciliation. Compare local state with the venue before retrying an unknown
outcome. Check permissions, rate limits, precision, margin, position mode, and
connector errors.

## 6. Reproduce the Window

Use a narrow replay for the same strategy, symbols, and timestamps. For an
entry-only comparison:

```bash
npx @tradejs/cli runtime-parity \
  --user <user> \
  --connector <connector> \
  --strategy <StrategyName> \
  --tickers <SYMBOLS> \
  --startTime <ms> \
  --endTime <ms> \
  --details \
  --cacheOnly
```

For exact version and execution comparison, collect a runtime record and follow
[Validate live decisions with replay](../../runtime/backtesting/replay-evidence).

## 7. Close the Diagnosis

Document the observed behavior, expected behavior, exact versions and
configuration, evidence, root cause, and corrective action. If the cause is
uncertain or can create uncontrolled exposure, pause new entries while
continuing to manage open positions.
