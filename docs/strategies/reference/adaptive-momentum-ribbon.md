---
title: 'AdaptiveMomentumRibbon'
---

`AdaptiveMomentumRibbon` combines a Pine-based momentum ribbon with Keltner
context, structural invalidation, and risk-sized entries. Pine performs the
signal calculation while TypeScript handles position state, exits, and order
planning.

## Visual overview

![AdaptiveMomentumRibbon strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-AdaptiveMomentumRibbon/main/docs/strategy-logic.svg)

![AdaptiveMomentumRibbon signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-AdaptiveMomentumRibbon/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. `core.ts` loads Pine code using `loadPineScriptFile('adaptiveMomentumRibbon.pine')`.
2. Takes recent candles (`AMR_LOOKBACK_BARS`) and runs Pine via `runPineScript`.
3. Reads latest plot values:

- `entryLong`, `entryShort`
- `invalidated`, `activeBuy`, `activeSell`
- `signalOsc`, `kcMidline`, `kcUpper`, `kcLower`, `invalidationLevel`

4. If both entry signals are `true`, strategy skips (conflict).
5. If a position exists:

- closes on opposite signal
- optionally closes on invalidation (`AMR_EXIT_ON_INVALIDATION`)

6. If no position and entry signal is valid:

- applies side config (`LONG` or `SHORT`)
- places a structural stop beyond the Pine invalidation/Keltner level
- derives an R-multiple target and risk-sized quantity
- rejects poor signal-time execution geometry when configured
- returns `entry`

## Exits

- `CLOSE_BY_AMR_SIGNAL` — opposite signal
- `CLOSE_BY_AMR_INVALIDATION` — invalidation when `AMR_EXIT_ON_INVALIDATION=true`

## Configuration keys

The keys are grouped by purpose. Common runtime, AI, ML, and position-sizing
keys keep the same meaning across the built-in strategies.

| Group | Keys | Purpose |
| --- | --- | --- |
| Fees | `FEE_PERCENT` | Include the configured trading fee in position and reward-to-risk calculations. |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. `CLOSE_OPPOSITE_POSITIONS` is not used by the current AMR hook logic. |
| Momentum model | `AMR_LOOKBACK_BARS`, `AMR_MOMENTUM_PERIOD`, `AMR_BUTTERWORTH_SMOOTHING`, `AMR_WAIT_CLOSE`, `AMR_CONFIRM_ON_NEXT_BAR` | Set the input history, oscillator period and smoothing, and closed-bar confirmation behavior. |
| Signal quality | `AMR_MIN_SIGNAL_OSC_ABS`, `AMR_MIN_SIGNAL_OSC_ABS_LONG`, `AMR_MIN_SIGNAL_OSC_ABS_SHORT`, `AMR_REQUIRE_KC_BIAS`, `AMR_MIN_BARS_BETWEEN_SIGNALS` | Set the oscillator-strength floor, optional Keltner bias, and signal cooldown, with directional oscillator overrides. |
| Keltner channel | `AMR_KC_LENGTH`, `AMR_KC_MA_TYPE`, `AMR_ATR_LENGTH`, `AMR_ATR_MULTIPLIER` | Set the channel midline, moving-average type, ATR period, and band multiplier. |
| Delayed-entry risk | `AMR_MIN_TP_DISTANCE_BPS`, `AMR_MAX_DELAY_RISK_TP_RATIO`, `AMR_DELAY_RISK_MOVE_MULT` | Reject entries with too little target distance or too much signal-to-fill risk movement. |
| Target, stop, and exit | `AMR_STOP_BUFFER_PCT`, `AMR_TARGET_R_MULT`, `AMR_EXIT_ON_OPPOSITE_SIGNAL`, `AMR_EXIT_ON_INVALIDATION` | Set the structural stop buffer, target distance, and exit triggers. |
| Figures | `AMR_SHOW_INVALIDATION_LEVELS`, `AMR_SHOW_KELTNER_CHANNEL`, `AMR_LINE_PLOTS` | Choose the levels, channel, and Pine plots included in chart figures. |
| Risk and side policy | `MAX_LOSS_VALUE`, `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Set the loss budget and enable each direction with its minimum reward-to-risk ratio. |

## Indicators Used (What Each One Means)

### Pine Series Used by the Strategy

- `entryLong`, `entryShort` — binary entry signals.
- `activeBuy`, `activeSell` — active buy/sell context flags.
- `invalidated` — signal invalidation flag.
- `signalOsc` — smoothed AMR oscillator.
- `kcMidline` — Keltner center line.
- `kcUpper` — Keltner upper band.
- `kcLower` — Keltner lower band.
- `invalidationLevel` — current invalidation level.

### Lines Rendered in `figures`

- all series listed in `AMR_LINE_PLOTS` are exported to `figures.lines`
- this allows explicit control over chart overlays in runtime/backtests

## Signal Payload

`figures`:

- lines selected via `AMR_LINE_PLOTS`
- entry point marker

`additionalIndicators.amr`:

- `entryLong`, `entryShort`, `activeBuy`, `activeSell`, `invalidated`
- `signalOsc`
- Keltner values and invalidation level
- `lineValues` map for selected plots

## Example Runtime Config

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "AMR_LOOKBACK_BARS": 200,
  "AMR_MOMENTUM_PERIOD": 32,
  "AMR_BUTTERWORTH_SMOOTHING": 4,
  "AMR_WAIT_CLOSE": true,
  "AMR_CONFIRM_ON_NEXT_BAR": true,
  "AMR_MIN_SIGNAL_OSC_ABS_LONG": 1.75,
  "AMR_MIN_SIGNAL_OSC_ABS_SHORT": 1.25,
  "AMR_KC_LENGTH": 20,
  "AMR_KC_MA_TYPE": "EMA",
  "AMR_ATR_LENGTH": 14,
  "AMR_ATR_MULTIPLIER": 2,
  "AMR_STOP_BUFFER_PCT": 0.05,
  "AMR_TARGET_R_MULT": 2.4,
  "AMR_EXIT_ON_INVALIDATION": true,
  "AMR_LINE_PLOTS": ["kcMidline", "kcUpper", "kcLower", "invalidationLevel"],
  "LONG": { "enable": true, "direction": "LONG", "minRiskRatio": 1 },
  "SHORT": { "enable": true, "direction": "SHORT", "minRiskRatio": 1 }
}
```

## Run

```bash
npx @tradejs/cli backtest --user root --config AdaptiveMomentumRibbon:amr-default --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
