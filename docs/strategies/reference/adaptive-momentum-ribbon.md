---
title: 'AdaptiveMomentumRibbon'
---

`AdaptiveMomentumRibbon` is a built-in Pine-backed strategy from `@tradejs/strategy-adaptive-momentum-ribbon`.

Runtime injects `loadPineScriptFile` into `core.ts`, so Pine logic is maintained separately from TypeScript orchestration.

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

## Config Parameters (What Each One Means)

### Shared Runtime Parameters

- `ENV` — runtime mode.
- `INTERVAL` — strategy timeframe.
- `MAKE_ORDERS` — whether to execute orders.
- `BACKTEST_PRICE_MODE` — backtest execution price mode.

### AI/ML Parameters

- `AI_ENABLED` — enables AI enrichment/gating.
- `MIN_AI_QUALITY` — minimum AI quality.
- `ML_ENABLED` — enables ML enrichment.
- `ML_THRESHOLD` — ML threshold in runtime policy.

### AMR Pine Model Parameters

- `AMR_MOMENTUM_PERIOD` — Pine input `Momentum Period`.
- `AMR_BUTTERWORTH_SMOOTHING` — Pine input `Butterworth Smoothing`.
- `AMR_WAIT_CLOSE` — confirm signals only on closed bars.
- `AMR_CONFIRM_ON_NEXT_BAR` — require the next closed bar to confirm a candidate.
- `AMR_MIN_SIGNAL_OSC_ABS`, `AMR_MIN_SIGNAL_OSC_ABS_LONG`, `AMR_MIN_SIGNAL_OSC_ABS_SHORT` — oscillator-strength floor with directional overrides.
- `AMR_REQUIRE_KC_BIAS` — require the signal to agree with Keltner bias.
- `AMR_MIN_BARS_BETWEEN_SIGNALS` — detector cooldown.
- `AMR_SHOW_INVALIDATION_LEVELS` — render invalidation levels.
- `AMR_SHOW_KELTNER_CHANNEL` — render Keltner Channel.
- `AMR_KC_LENGTH` — Keltner midline period.
- `AMR_KC_MA_TYPE` — MA type for Keltner midline (`SMA`, `EMA`, `SMMA (RMA)`, `WMA`, `VWMA`).
- `AMR_ATR_LENGTH` — ATR period for Keltner bands.
- `AMR_ATR_MULTIPLIER` — ATR multiplier for Keltner bands.

### Execution/Visualization Parameters

- `AMR_LOOKBACK_BARS` — number of candles passed to Pine per calculation.
- `AMR_STOP_BUFFER_PCT` — buffer beyond the structural invalidation level.
- `AMR_TARGET_R_MULT` — target distance in initial-risk multiples.
- `AMR_MIN_TP_DISTANCE_BPS*` — optional minimum target distance.
- `AMR_MAX_DELAY_RISK_TP_RATIO*` and `AMR_DELAY_RISK_MOVE_MULT*` — optional signal-time delayed-entry risk guard.
- `AMR_EXIT_ON_OPPOSITE_SIGNAL` — exit on the opposite AMR signal.
- `AMR_EXIT_ON_INVALIDATION` — exit on invalidation signal.
- `AMR_LINE_PLOTS` — Pine plot names mapped into `figures.lines`.
- `CLOSE_OPPOSITE_POSITIONS` — present in shared config template, not used by current `AdaptiveMomentumRibbon` hook logic.

### `LONG` Scenario Parameters

- `LONG.enable` — enable/disable long scenario.
- `LONG.direction` — order direction (`LONG`).
- `LONG.minRiskRatio` — minimum net reward/risk after costs.

### `SHORT` Scenario Parameters

- `SHORT.enable` — enable/disable short scenario.
- `SHORT.direction` — order direction (`SHORT`).
- `SHORT.minRiskRatio` — minimum net reward/risk after costs.

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
