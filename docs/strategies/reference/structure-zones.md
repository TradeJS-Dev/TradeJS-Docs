---
title: 'StructureZones'
---

`StructureZones` builds market-structure zones from swing points and trades
reactions or transition breakouts at those zones.

## Visual overview

![StructureZones strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-StructureZones/main/docs/strategy-logic.svg)

![StructureZones signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-StructureZones/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

## Entry Logic

1. Replays candles through `createStructureZonesEngine(...)`.
2. Reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a structure-zone signal exists.
4. Selects `LONG` or `SHORT` side config from signal direction.
5. Places the stop outside the signal zone, using ATR and percent buffers.
6. Computes target from `STRUCTURE_ZONES_TARGET_R_MULT`.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, using the `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, and `RISK_MARKET_IMPACT_BPS` estimates.
8. Returns `entry` with structure-zone figures and `structureZonesContext`.

Entry codes are based on the signal kind and direction:

- `STRUCTURE_ZONES_<KIND>_LONG`
- `STRUCTURE_ZONES_<KIND>_SHORT`

## Exits

When a position exists:

- `STRUCTURE_ZONES_OPPOSITE_SIGNAL_EXIT` when `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL=true` and the engine emits an opposite signal.
- otherwise `POSITION_EXISTS`.

## Configuration keys

The keys are grouped by purpose. A listed `_LONG` or `_SHORT` key overrides
the unsuffixed value for that direction.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Zone construction | `STRUCTURE_ZONES_PIVOT_LENGTH`, `STRUCTURE_ZONES_ATR_LENGTH`, `STRUCTURE_ZONES_MIN_SWING_ATR`, `STRUCTURE_ZONES_ZONE_WIDTH_ATR`, `STRUCTURE_ZONES_ACCEPT_BARS` | Define confirmed pivots, ATR scale, minimum swing size, zone width, and acceptance period. |
| Reaction quality | `STRUCTURE_ZONES_REACTION_CLOSE_BEYOND_ZONE`, `STRUCTURE_ZONES_REQUIRE_REACTION_BODY`, `STRUCTURE_ZONES_REQUIRE_BIAS_ALIGNMENT`, `STRUCTURE_ZONES_MIN_REACTION_DISTANCE_ATR`, `STRUCTURE_ZONES_MIN_REACTION_DISTANCE_ATR_LONG`, `STRUCTURE_ZONES_MIN_REACTION_DISTANCE_ATR_SHORT`, `STRUCTURE_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT`, `STRUCTURE_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT_LONG`, `STRUCTURE_ZONES_MIN_REACTION_CLOSE_DISTANCE_PCT_SHORT` | Require a valid reaction close, body, bias, and directional distance from the zone. |
| Zone age and touches | `STRUCTURE_ZONES_MIN_ZONE_AGE_BARS`, `STRUCTURE_ZONES_MAX_ZONE_AGE_BARS`, `STRUCTURE_ZONES_MIN_TOUCH_ORDINAL`, `STRUCTURE_ZONES_MAX_TOUCH_ORDINAL`, `STRUCTURE_ZONES_PENDING_CONFIRMATION_MAX_BARS` | Limit zone age, accepted touch number, and pending confirmation time. |
| Market filters | `STRUCTURE_ZONES_MAX_ATR_PCT_RANK100`, `STRUCTURE_ZONES_MIN_TREND_PERSISTENCE`, `STRUCTURE_ZONES_MIN_TREND_PERSISTENCE_LONG`, `STRUCTURE_ZONES_MIN_TREND_PERSISTENCE_SHORT` | Limit volatility rank and require directional trend persistence. |
| Signal mode | `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS`, `STRUCTURE_ZONES_TRANSITION_BREAKOUT_ONLY`, `STRUCTURE_ZONES_COOLDOWN_HOURS` | Enable transition breakouts, optionally disable reaction entries, and delay repeated signals. |
| Target, stop, and exit | `STRUCTURE_ZONES_STOP_ZONE_BUFFER_MULT`, `STRUCTURE_ZONES_STOP_BUFFER_PCT`, `STRUCTURE_ZONES_TARGET_R_MULT`, `STRUCTURE_ZONES_TARGET_R_MULT_LONG`, `STRUCTURE_ZONES_TARGET_R_MULT_SHORT`, `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL` | Set the stop outside the zone, directional target distance, and opposite-signal exit. |
| Figures and side policy | `STRUCTURE_ZONES_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Limit chart output, set the loss budget, and configure each direction. |

## Signal Payload

The strategy stores:

- `additionalIndicators.structureZonesContext`
- zone, signal, stop, and target figures from `buildStructureZonesFigures(...)`
- `orderPlan.stopLossPrice`
- one take-profit at the computed target

## Common Skip Reasons

- `NO_STRUCTURE_ZONE_SIGNAL`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Keep zone detection causal and inspect chart artifacts before trusting aggregate metrics. `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS` changes the strategy surface, so compare it as a separate experiment.

`STRUCTURE_ZONES_TRANSITION_BREAKOUT_ONLY=true` suppresses support and
resistance reactions and emits only accepted structural breakouts while the
market state is `Transition`. With deterministic `AI_MODE: "gate"`, the
strategy-local gate currently admits only SHORT transition-breakout setups
whose benchmark-relative strength and trailing-stop distance pass the frozen
causal thresholds; missing features fail closed.

Related:

- [Signals](../../core-concepts/signals)
- [Backtesting caveats](../../limitations/backtesting-caveats)
