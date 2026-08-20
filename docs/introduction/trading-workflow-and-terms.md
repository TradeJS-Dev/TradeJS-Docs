---
title: Trading Workflow and Terms
---

TradeJS uses standard systematic-trading terminology wherever possible. This
page defines the few terms needed to follow the documentation and separates
research, validation, and live execution.

## Trading Objects

- **Strategy:** deterministic rules that transform market data and current
  state into a decision.
- **Configuration:** the parameters used by a strategy, including risk and exit
  rules. A configuration is meaningful only with its strategy version,
  timeframe, and market universe.
- **Universe:** the set of symbols eligible for evaluation. A deployment or an
  individual strategy can narrow this set.
- **Signal:** a strategy decision such as a possible long entry, short entry,
  exit, or no action. A signal is not proof that an order was accepted or
  filled.
- **Order:** an instruction sent to a venue. Its lifecycle includes submission,
  acknowledgement, rejection, partial fills, fills, and cancellation.
- **Position:** the resulting market exposure. Position management continues
  even when new entries are paused.

## Research and Validation

- **Backtest:** a simulation over historical data. Its result depends on data
  quality, fees, slippage, latency, fill rules, and other execution assumptions.
- **Parameter grid:** a set of parameter combinations evaluated by a backtest.
  Searching a large grid increases overfitting risk and requires independent
  validation.
- **Out-of-sample test:** evaluation on data that was not used to select or tune
  the configuration.
- **Replay:** evaluation of a specific deployed configuration over historical
  closed candles. Replay is used to reproduce decisions and diagnose
  differences; it is not a substitute for a robust research design.
- **Runtime parity:** comparison between decisions recorded during live
  evaluation and decisions reconstructed for the same symbols and time window.

## Live Trading

- **Deployment:** a named live setup in `tradejs.config.ts` that binds a
  connector, account, strategies, configurations, and symbol selection.
- **Live evaluation:** processing newly closed candles and recording strategy
  decisions without necessarily placing orders.
- **Live execution:** live evaluation with order placement explicitly enabled.
- **Runtime record:** a timestamped record of live decisions, orders, or fills,
  together with the strategy, package, and configuration versions needed for
  diagnosis.

The documentation uses **live** for activity driven by current market data and
**production** for the deployed environment. Neither word implies that order
placement is enabled.

## Recommended Sequence

1. Define the hypothesis and execution assumptions.
2. Backtest a limited, justified parameter set.
3. Validate out of sample and across relevant market regimes.
4. Freeze the strategy version and complete configuration.
5. Replay the deployed configuration and verify decision parity.
6. Run live evaluation without order placement.
7. If risk controls and evidence are acceptable, begin a bounded live rollout.

See [How backtests work](../runtime/backtesting/overview) and
[From backtest to live trading](../runtime/backtesting/strategy-playbook) for
the corresponding TradeJS commands.
