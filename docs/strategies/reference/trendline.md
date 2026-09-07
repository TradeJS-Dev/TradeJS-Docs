---
title: 'TrendLine'
---

`TrendLine` is a built-in TypeScript strategy from `@tradejs/strategy-trend-line` that opens trades on trendline breakouts with risk guards.

## Visual overview

![TrendLine and ReverseTrendLine strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendLine/main/docs/strategy-logic.svg)

![TrendLine and ReverseTrendLine signals on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendLine/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Builds trendlines from highs/lows via `createTrendlineEngine`.
2. Selects the best line (`lows` first, otherwise `highs`).
3. Runs guards: no line, open position exists, cooldown, excessive volatility.
4. Selects side config:

- `HIGHS` for resistance breakout
- `LOWS` for support breakout

5. Computes TP/SL/qty via `strategyApi.getDirectionalTpSlPrices`.
6. Validates `minRiskRatio` and `MAX_CORRELATION`.
7. Returns `entry` with figures and trendline metadata.

## Exits

`core.ts` does not implement active position management.
Position lifecycle is handled by TP/SL and shared runtime/order execution.

## Configuration keys

Keys are grouped by the part of the strategy they control. A value of `0` or
`false` disables the corresponding optional filter unless stated otherwise.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Select the runtime mode, candle interval, order behavior, and backtest fill price. |
| AI and ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Control optional AI and ML enrichment and their acceptance thresholds. |
| Risk | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `TRENDLINE_STOP_BASE_PCT`, `TRENDLINE_TARGET_R_MULT` | Estimate one-way fees, slippage, and market impact, size positions, and set the stop distance and target R multiple. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the lookback periods used by market context and signal filters. |
| Line geometry | `TRENDLINE.minTouches`, `TRENDLINE.offset`, `TRENDLINE.epsilon`, `TRENDLINE.epsilonOffset` | Define pivot spacing, required touches, and price tolerance for fitted lines. |
| Break quality | `TRENDLINE_MIN_BREAK_ATR_RATIO`, `TRENDLINE_MAX_BREAK_ATR_RATIO`, `TRENDLINE_WEAK_BREAK_MAX_ATR_RATIO`, `TRENDLINE_WEAK_BREAK_MIN_VOLUME_REL20` | Require a meaningful line break and apply a stricter volume rule to weak breaks. |
| Volume | `TRENDLINE_MIN_VOLUME_REL20`, `TRENDLINE_MIN_VOLUME_REL20_LONG`, `TRENDLINE_MIN_VOLUME_REL20_SHORT` | Require minimum relative volume globally or by direction. |
| Volatility | `TRENDLINE_MAX_BB_WIDTH_PCT`, `TRENDLINE_MAX_BB_WIDTH_PCT_LONG`, `TRENDLINE_MAX_BB_WIDTH_PCT_SHORT` | Reject entries when Bollinger Band width exceeds the global or directional limit. |
| Alignment and timing | `TRENDLINE_REQUIRE_SLOPE_ALIGNMENT`, `TRENDLINE_REQUIRE_BTC_BIAS_ALIGNMENT`, `TRENDLINE_ALLOWED_ENTRY_TIMINGS` | Optionally align the line slope and BTC bias, and choose accepted detector states. |
| Direction policy | `HIGHS.*`, `LOWS.*` | Enable high- or low-line breakouts and set their direction and minimum risk/reward ratio. |

## Indicators Used (What Each One Means)

- `correlation` — correlation between asset and BTC; used as the runtime risk guard (`MAX_CORRELATION`).
- `trendLine` (derived geometry, not a base indicator) — selected line from trendline engine; this drives entry direction/placement.

## Signal Payload

`figures`:

- `lines[]` — selected trendline
- `points[]` — trendline points/touches

`additionalIndicators`:

- `touches`
- `distance`
- `trendLine`

## Example Runtime Config

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "MAKE_ORDERS": true,
  "CLOSE_OPPOSITE_POSITIONS": false,
  "TRENDLINE": {
    "minTouches": 4,
    "offset": 3,
    "epsilon": 0.003,
    "epsilonOffset": 0.004
  },
  "HIGHS": {
    "enable": true,
    "direction": "LONG",
    "TP": 4,
    "SL": 1.3,
    "minRiskRatio": 2
  },
  "LOWS": {
    "enable": true,
    "direction": "SHORT",
    "TP": 4,
    "SL": 1.3,
    "minRiskRatio": 2
  }
}
```

## Run

```bash
npx @tradejs/cli backtest --user root --config TrendLine:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
