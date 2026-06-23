---
title: 'StructureZones'
---

`StructureZones` is a built-in TypeScript strategy from `@tradejs/strategies`.

It researches market-structure zones built from swing points, then trades reactions or transition breakouts from those zones.

## Entry Logic

1. Replays candles through `createStructureZonesEngine(...)`.
2. Reads `runtimeState.signal` and `runtimeState.snapshot`.
3. Skips until a structure-zone signal exists.
4. Selects `LONG` or `SHORT` side config from signal direction.
5. Places the stop outside the signal zone, using ATR and percent buffers.
6. Computes target from `STRUCTURE_ZONES_TARGET_R_MULT`.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
8. Returns `entry` with structure-zone figures and `structureZonesContext`.

Entry codes are based on the signal kind and direction:

- `STRUCTURE_ZONES_<KIND>_LONG`
- `STRUCTURE_ZONES_<KIND>_SHORT`

## Exits

When a position exists:

- `STRUCTURE_ZONES_OPPOSITE_SIGNAL_EXIT` when `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL=true` and the engine emits an opposite signal.
- otherwise `POSITION_EXISTS`.

## Config Parameters

Zone model:

- `STRUCTURE_ZONES_PIVOT_LENGTH`
- `STRUCTURE_ZONES_ATR_LENGTH`
- `STRUCTURE_ZONES_MIN_SWING_ATR`
- `STRUCTURE_ZONES_ZONE_WIDTH_ATR`
- `STRUCTURE_ZONES_ACCEPT_BARS`
- `STRUCTURE_ZONES_REACTION_CLOSE_BEYOND_ZONE`
- `STRUCTURE_ZONES_REQUIRE_REACTION_BODY`
- `STRUCTURE_ZONES_TRADE_TRANSITION_BREAKOUTS`
- `STRUCTURE_ZONES_STOP_ZONE_BUFFER_MULT`
- `STRUCTURE_ZONES_STOP_BUFFER_PCT`
- `STRUCTURE_ZONES_TARGET_R_MULT`
- `STRUCTURE_ZONES_EXIT_ON_OPPOSITE_SIGNAL`
- `STRUCTURE_ZONES_MAX_FIGURE_POINTS`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

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

Related:

- [Signals](../../core-concepts/signals)
- [Backtesting caveats](../../limitations/backtesting-caveats)
