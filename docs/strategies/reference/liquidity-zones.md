---
title: 'LiquidityZones'
---

`LiquidityZones` is a built-in TypeScript strategy from `@tradejs/strategies`.

It builds liquidity zones from swing highs/lows, waits for retests, and trades reactions from those zones.

## Entry Logic

1. Builds active liquidity zones from pivots.
2. Skips until a zone retest signal appears.
3. Selects `LONG` or `SHORT` side config from signal direction.
4. Builds a stop buffer from zone height and `LIQUIDITY_ZONES_STOP_BUFFER_PCT`.
5. Places stop outside the retested zone.
6. Computes target from `LIQUIDITY_ZONES_TARGET_R_MULT`.
7. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
8. Returns `entry` with zone figures and `liquidityZonesContext`.

Entry codes:

- `LIQUIDITY_ZONES_BULLISH_RETEST`
- `LIQUIDITY_ZONES_BEARISH_RETEST`

## Exits

When a position exists:

- `LIQUIDITY_ZONES_OPPOSITE_RETEST_EXIT` when `LIQUIDITY_ZONES_EXIT_ON_OPPOSITE_RETEST=true` and the opposite retest appears.
- otherwise `POSITION_EXISTS`.

## Config Parameters

Zone model:

- `LIQUIDITY_ZONES_PIVOT_LOOKBACK`
- `LIQUIDITY_ZONES_SWING_AREA_MODE` (`wick_extremity` or `full_range`)
- `LIQUIDITY_ZONES_FILTER_MODE` (`count` or `volume`)
- `LIQUIDITY_ZONES_MIN_FILTER_VALUE`
- `LIQUIDITY_ZONES_SHOW_SWING_HIGH_ZONES`
- `LIQUIDITY_ZONES_SHOW_SWING_LOW_ZONES`
- `LIQUIDITY_ZONES_MAX_AGE`
- `LIQUIDITY_ZONES_REACTION_CLOSE_BEYOND_ZONE`
- `LIQUIDITY_ZONES_REQUIRE_REACTION_BODY`
- `LIQUIDITY_ZONES_MAX_RETEST_PENETRATION_PCT`
- `LIQUIDITY_ZONES_STOP_ZONE_BUFFER_MULT`
- `LIQUIDITY_ZONES_STOP_BUFFER_PCT`
- `LIQUIDITY_ZONES_TARGET_R_MULT`
- `LIQUIDITY_ZONES_EXIT_ON_OPPOSITE_RETEST`
- `LIQUIDITY_ZONES_MAX_FIGURE_ZONES`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Signal Payload

The strategy stores:

- `additionalIndicators.liquidityZonesContext`
- zone figures from `buildLiquidityZonesFigures(...)`
- stop outside the retested zone
- one take-profit at the computed target

## Common Skip Reasons

- `NO_LIQUIDITY_ZONE_RETEST`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Compare `wick_extremity` vs `full_range` carefully. Zone width, provider wick quality, and retest penetration settings can change signal frequency.
