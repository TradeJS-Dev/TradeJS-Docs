---
title: 'MaStrategy'
---

`MaStrategy` is a built-in TypeScript strategy from `@tradejs/strategy-ma-strategy` based on fast/slow moving average crossover.

## Visual overview

![MaStrategy strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MaStrategy/main/docs/strategy-logic.svg)

![MaStrategy signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MaStrategy/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Reads indicator snapshot (`maFast[]`, `maSlow[]`).
2. Detects crossover on last two values:

- bullish: fast crosses above slow
- bearish: fast crosses below slow

3. Selects side config (`LONG` or `SHORT`).
4. Computes TP/SL/qty.
5. Checks `minRiskRatio`, cooldown, and `MAX_CORRELATION`.
6. Returns `entry`.

## Exits

If a position exists, opposite MA cross closes it with `CLOSE_BY_OPPOSITE_MA_CROSS`.
Otherwise strategy returns `POSITION_HELD`.

## Configuration keys

Keys are grouped by the part of the strategy they control. A value of `0` or
`false` disables the corresponding optional filter unless stated otherwise.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Select the runtime mode, candle interval, order behavior, and backtest fill price. |
| AI and ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Control optional AI and ML enrichment and their acceptance thresholds. |
| Risk | `FEE_PERCENT`, `MAX_LOSS_VALUE`, `TRADE_COOLDOWN_MS` | Account for fees, size positions by maximum loss, and pause between entries. |
| Moving averages | `MA_FAST`, `MA_SLOW` | Set the fast and slow average periods used to detect a cross. |
| Cross gap | `MA_MIN_CROSS_GAP_ATR`, `MA_MIN_CROSS_GAP_ATR_LONG`, `MA_MIN_CROSS_GAP_ATR_SHORT`, `MA_MAX_CROSS_GAP_ATR`, `MA_MAX_CROSS_GAP_ATR_LONG`, `MA_MAX_CROSS_GAP_ATR_SHORT` | Limit the post-cross distance between the averages in ATR units, globally or by direction. |
| Signal quality | `MA_MIN_FAST_SLOPE_ATR`, `MA_REQUIRE_SLOW_SLOPE_ALIGNMENT`, `MA_REQUIRE_DIRECTIONAL_BODY`, `MA_MIN_BODY_ATR`, `MA_MIN_VOLUME_REL20`, `MA_MIN_VOLUME_REL20_LONG`, `MA_MIN_VOLUME_REL20_SHORT`, `MA_MAX_PRICE_DISTANCE_FAST_ATR` | Require sufficient slope, candle direction and size, relative volume, and proximity to the fast average. |
| Benchmark filter | `MA_MAX_CORRELATION`, `MA_MAX_CORRELATION_LONG`, `MA_MAX_CORRELATION_SHORT` | Reject signals whose BTC correlation is above the global or directional limit. |
| Exit policy | `MA_EXIT_ON_OPPOSITE_CROSS_LONG`, `MA_EXIT_ON_OPPOSITE_CROSS_SHORT` | Choose whether an opposite average cross closes each side. |
| Direction policy | `LONG.*`, `SHORT.*` | Enable each direction and set its order direction, take-profit, stop-loss, and minimum risk/reward ratio. |

## Indicators Used (What Each One Means)

- `maFast` — fast MA, used for cross detection.
- `maSlow` — slow MA, used for cross detection.
- `correlation` — BTC correlation, used as risk guard.

## Signal Payload

`figures`:

- `ma-fast` line
- `ma-slow` line
- `ma-cross` point

`additionalIndicators`:

- `crossKind`
- `maFastPrev`, `maFastCurrent`
- `maSlowPrev`, `maSlowCurrent`
- `maGap`
- `correlation`

## Example Runtime Config

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "MA_FAST": 21,
  "MA_SLOW": 55,
  "TRADE_COOLDOWN_MS": 0,
  "LONG": {
    "enable": true,
    "direction": "LONG",
    "TP": 2,
    "SL": 1,
    "minRiskRatio": 1.5
  },
  "SHORT": {
    "enable": true,
    "direction": "SHORT",
    "TP": 2,
    "SL": 1,
    "minRiskRatio": 1.5
  }
}
```

## Run

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
