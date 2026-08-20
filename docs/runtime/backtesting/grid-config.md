---
title: Search a Backtest Parameter Grid
---

A parameter search compares predefined strategy variants under the same market
data and execution assumptions. TradeJS builds the Cartesian product of the
arrays in a saved backtest grid and evaluates each combination for each symbol.

## Estimate the Search Size

If `MA_FAST` has three values and `MA_SLOW` has two, the grid has six parameter
combinations. Across 20 symbols, the full suite contains 120 tests before the
`--tests` limit.

Keep the grid small enough to explain. A larger search increases compute cost
and the chance of selecting noise. Parameters and ranges should follow from the
strategy hypothesis rather than from repeated inspection of the same period.

## Example Grid

```json
{
  "INTERVAL": ["15"],
  "MAX_LOSS_VALUE": [10],
  "MA_FAST": [14, 21, 34],
  "MA_SLOW": [55, 89],
  "LONG": [
    { "enable": true, "direction": "LONG", "TP": 2, "SL": 1 }
  ],
  "SHORT": [
    { "enable": true, "direction": "SHORT", "TP": 2, "SL": 1 }
  ]
}
```

Every value must be an array. See
[Define a backtest parameter grid](../../getting-started/backtest-config) for
storage and naming.

## Run the Search

```bash
npx @tradejs/cli backtest \
  --user root \
  --config MaStrategy:grid-v1 \
  --connector bybit \
  --timeframe 15 \
  --tickers BTCUSDT,ETHUSDT \
  --tests 12 \
  --parallel 4 \
  --cacheOnly
```

Useful controls:

- `--tickers` selects explicit symbols;
- `--tickersLimit` caps a connector-derived symbol set;
- `--exclude` removes symbols;
- `--tests` caps the complete symbol × parameter suite;
- `--parallel` controls worker count;
- `--skip` and `--continue` help resume planned work.

Use `--cacheOnly` when comparing configurations on a fixed historical dataset.
If you refresh history, record that change as a new experiment input.

## Select and Validate

Inspect the saved results and symbol coverage:

```bash
npx @tradejs/cli results \
  --strategy MaStrategy \
  --coverage \
  --user root
```

When selection uses the same period as evaluation, the reported best result is
in-sample. Reserve an independent period, test nearby parameter values, and
stress costs before considering a live evaluation.

`results --merge` can keep a local list of the highest recorded result for each
symbol. It does not update `tradejs.config.ts` or create a portfolio decision.

## Common Mistakes

- using a scalar instead of an array;
- leaving an empty array, which creates zero combinations;
- omitting the strategy prefix from `StrategyName:label`;
- changing the grid after seeing results without starting a new experiment;
- searching too many combinations without an independent validation set;
- ranking by profit alone.

## Related Guides

- [How backtests work](./overview)
- [Use a tested configuration in live trading](./results-runtime-config)
- [From backtest to live trading](./strategy-playbook)
