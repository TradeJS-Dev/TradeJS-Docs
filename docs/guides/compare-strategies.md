---
title: Compare Strategies
---

Compare strategies on the same inputs and change one group of assumptions at a
time.

## Hold Constant

- symbols and exact historical window;
- timeframe and data provider;
- fees, slippage, latency, and fill model;
- position sizing and risk per trade;
- missing-data and context rules;
- AI/ML filter state when applicable.

## Compare

- net result after modeled costs;
- trade count, exposure, and turnover;
- maximum drawdown and recovery time;
- expectancy and the full trade-return distribution;
- stability across symbols, subperiods, and market regimes;
- concentration of profit and risk;
- reasons for skipped entries;
- agreement between backtest, replay, and live decisions.

If strategies have different turnover, holding periods, or risk, their absolute
profit is not comparable without normalizing for capital, time, and exposure.

## Avoid

- selecting the best symbol or window after inspecting results;
- optimizing many parameters on one sample;
- ignoring loss streaks, tail risk, and drawdown;
- comparing idealized historical prices with live fills without calibration;
- combining strategies without measuring correlation and aggregate exposure.

Related:

- [Understanding the output](../getting-started/understanding-output)
- [Backtesting caveats](../limitations/backtesting-caveats)
- [Compare live and replayed entries](../runtime/backtesting/runtime-parity)
