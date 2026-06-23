---
title: Backtesting caveats
---

Backtests are useful, but they are not evidence that a strategy will make money in the future.

Use them to research, test, compare, and analyze strategy behavior under explicit assumptions.

## Fees

Every trade can pay exchange fees. A strategy with many small trades may look acceptable before fees and weak after fees.

Check whether your config includes fee assumptions and whether those assumptions match the venue and account tier you care about.

## Slippage

Backtest prices are approximations. Live orders may fill worse than the candle price because of spread, latency, order book depth, volatility, and order type.

Recent TradeJS runtime work includes slippage telemetry and execution calibration, but you still need to compare assumptions against real fills.

## Data Quality

Historical data can have:

- missing candles
- duplicate candles
- wrong volume
- provider-specific symbol mapping
- timezone or timestamp alignment issues
- unavailable context rows for derivatives, global market, or onchain data

Validate data before trusting any metric.

## Look-Ahead Bias

Look-ahead bias happens when a decision uses information that was not available at the decision timestamp.

Common sources:

- using the still-forming candle
- aligning context data to a future timestamp
- using final trade outcome fields as signal-time features
- training ML features with future labels mixed into inputs

TradeJS has causality guardrails in several AI/ML workflows, but strategy and data design still matter.

## Overfitting

Overfitting happens when a strategy is tuned too closely to one historical sample.

Warning signs:

- too many parameters
- optimizing on one symbol or short period
- selecting only the best historical window
- ignoring out-of-sample or walk-forward checks
- changing risk settings after seeing results

## Execution Assumptions

Backtest fills may differ from live execution because:

- the order may not fill
- entry delay changes price
- stop-loss and take-profit handling differs by venue
- liquidity can disappear
- connector errors can block or delay execution

## Practical Checklist

Before using a backtest result:

- inspect chart figures and trade logs
- verify data continuity
- include realistic fees
- model or measure slippage
- test multiple windows and symbols
- compare runtime/replay behavior
- keep position sizing and risk limits conservative

Good backtest results are research inputs. They are not a promise of live results.
