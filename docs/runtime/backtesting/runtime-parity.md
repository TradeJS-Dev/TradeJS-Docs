---
title: Compare Live and Replayed Entries
---

`runtime-parity` compares recorded live entries with entries reconstructed over
the same symbols and time window. It answers one focused question:

> Did live evaluation and historical reconstruction produce comparable entry
> decisions?

Use [full replay with a runtime record](./replay-evidence) when you need an
exact comparison of package versions, configurations, signals, orders, and
fills.

## Run the Comparison

```bash
npx @tradejs/cli runtime-parity \
  --user root \
  --connector bybit \
  --days 3
```

You can limit the comparison by strategy and symbols or set exact timestamps:

```bash
npx @tradejs/cli runtime-parity \
  --user root \
  --connector bybit \
  --strategy <StrategyName> \
  --tickers BTCUSDT,ETHUSDT \
  --details
```

## Inputs and Gates

The command builds targets from recorded live trades and evaluations, explicit
`--tickers`, and locally saved strategy results when available. By default it
reconstructs the strategy with `ENV=BACKTEST`, so configured external AI/ML
gates are not called.

Use `--runtimeGates` only when you intentionally want the comparison to call
configured AI or ML services. This can create provider cost and makes the run
dependent on external service availability.

When exact deployed versions and settings matter, use a runtime record as
described in [Validate live decisions with replay](./replay-evidence).

## Matching Rules

Entries are matched by strategy, symbol, direction, and timestamp tolerance.
The default tolerance is one 15-minute bar. Change it with
`--toleranceBars <count>`. Entry-price difference is reported for diagnosis but
is not the primary match key.

## Read the Result

- **matched:** a comparable live and reconstructed entry was found;
- **runtime-only:** a live entry exists but reconstruction did not produce it;
- **backtest-only:** reconstruction produced an entry absent from the live
  record.

When possible, reconstructed-only entries are classified as:

- `gated_out` — a gate or policy blocked the live entry;
- `order_failed` — order submission was attempted but failed;
- `core_skipped` — the live strategy calculation skipped the entry;
- `not_evaluated` — no comparable live evaluation was found;
- `true_mismatch` — the available records contain no known explanation.

Investigate differences in candles, timestamps, symbols, configuration,
strategy version, warm-up history, gates, and order lifecycle. A window with
zero live and zero reconstructed entries means only that no comparable entry
occurred in that sample.

Useful options include `--startTime`, `--endTime`, `--strategy`, `--tickers`,
`--cacheOnly`, `--toleranceBars`, `--runtimeGates`, `--details`, and `--notify`.
