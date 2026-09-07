---
title: 'VolumeDivergence'
---

`VolumeDivergence` is a built-in TypeScript reversal strategy from `@tradejs/strategy-volume-divergence` that compares price pivots with normalized volume pivots.

## Visual overview

![VolumeDivergence strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolumeDivergence/main/docs/strategy-logic.svg)

![VolumeDivergence signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolumeDivergence/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Builds normalized volume series (`0..100`) over `NORMALIZATION_LENGTH`.
2. Confirms pivot highs on normalized volume (`PIVOT_LOOKBACK_LEFT`, `PIVOT_LOOKBACK_RIGHT`).
3. Compares current and previous pivot:

- bullish divergence: price makes lower low while normalized volume makes higher low
- bearish divergence: price makes higher high while normalized volume makes lower high

4. Validates pivot confirmation distance (`MIN_BARS_BETWEEN_PIVOTS`, `MAX_BARS_BETWEEN_PIVOTS`).
5. Applies side config (`BULLISH` or `BEARISH`) and TP/SL/risk checks.
6. Applies correlation guard.

## Exits

The strategy opens only when there is no active position.
`core.ts` does not perform active exit management; closing is handled by TP/SL and runtime.

## Configuration keys

Keys are grouped by the part of the strategy they control. A value of `0` or
`false` disables the corresponding optional filter unless stated otherwise.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Select the runtime mode, candle interval, order behavior, and backtest fill price. |
| AI and ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Control optional AI and ML enrichment and their acceptance thresholds. |
| Risk | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `VOLUME_DIVERGENCE_STOP_ATR_BUFFER_MULT`, `VOLUME_DIVERGENCE_STOP_BUFFER_PCT`, `VOLUME_DIVERGENCE_TARGET_R_MULT` | Estimate one-way fees, slippage, and market impact, size positions, and set the stop buffers and target R multiple. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the lookback periods used by market context and signal filters. |
| Pivot search | `NORMALIZATION_LENGTH`, `PIVOT_LOOKBACK_LEFT`, `PIVOT_LOOKBACK_RIGHT`, `MIN_BARS_BETWEEN_PIVOTS`, `MAX_BARS_BETWEEN_PIVOTS` | Normalize volume and define how pivots are confirmed and spaced. |
| Entry quality | `ALLOW_STRUCTURE_ADVANCE_ENTRY`, `MIN_DIVERGENCE_AMPLITUDE_ATR_RATIO`, `MIN_RECLAIM_PCT`, `MIN_CONFIRMATION_CANDLE_QUALITY` | Choose whether early structural entries are allowed and set the global divergence, reclaim, and candle-quality thresholds. |
| Strength cap | `VOLUME_DIVERGENCE_MAX_STRENGTH`, `VOLUME_DIVERGENCE_MAX_STRENGTH_LONG`, `VOLUME_DIVERGENCE_MAX_STRENGTH_SHORT` | Reject signals above the global or directional divergence-strength limit. |
| Direction policy | `BULLISH.*`, `BEARISH.*` | Enable each direction and set its minimum risk/reward, divergence amplitude, reclaim, confirmation quality, retest requirement, tolerance, age, and maximum confirmation distance. |

## Indicators Used (What Each One Means)

### Used in Strategy Logic

- `normalizedVolume` (derived series) — volume normalized to local rolling max.
- `volume pivot high` — pivot confirmation on normalized volume.
- `price pivot high/low` — pivot prices used for divergence checks.
- `deltaAtPivot` — proxy candle delta at pivot (`volume * bodyBias`).
- `correlation` — BTC correlation guard.

## Signal Payload

`figures`:

- divergence line between two pivots
- pivot points

`additionalIndicators`:

- `divergenceKind`
- normalized volume at current/previous pivot
- `deltaAtPivot`
- pivot timestamps/indices/price levels

## Example Runtime Config

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "NORMALIZATION_LENGTH": 1000,
  "PIVOT_LOOKBACK_LEFT": 21,
  "PIVOT_LOOKBACK_RIGHT": 5,
  "MIN_BARS_BETWEEN_PIVOTS": 5,
  "MAX_BARS_BETWEEN_PIVOTS": 60,
  "BULLISH": {
    "enable": true,
    "direction": "LONG",
    "TP": 4,
    "SL": 1.3,
    "minRiskRatio": 2
  },
  "BEARISH": {
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
npx @tradejs/cli backtest --user root --config VolumeDivergence:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
