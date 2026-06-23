---
title: 'LiquidityTails'
---

`LiquidityTails` is a built-in TypeScript strategy from `@tradejs/strategies`.

It detects wick/tail liquidity zones, waits for retests, and trades reactions with a stop outside the retested zone.

## Entry Logic

1. Replays candles through `createLiquidityTailsEngine(...)`.
2. Reads `runtimeState.signal` and current `runtimeState.zones`.
3. Skips until a liquidity-tail retest signal exists.
4. Selects `LONG` or `SHORT` side config from signal direction.
5. Builds a stop buffer from:
   - `signal.atr * LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`
   - current price percent from `LIQUIDITY_TAILS_STOP_BUFFER_PCT`
6. Places the stop outside the zone:
   - long: below `signal.zone.bottom`
   - short: above `signal.zone.top`
7. Computes target from `LIQUIDITY_TAILS_TARGET_R_MULT`.
8. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, with `FEE_PERCENT` buffer.
9. Returns `entry` with liquidity-tail figures and `liquidityTailsContext`.

Entry codes:

- `LIQUIDITY_TAILS_BUY_PRESSURE_RETEST`
- `LIQUIDITY_TAILS_SELL_PRESSURE_RETEST`

## Exits

When a position exists:

- `LIQUIDITY_TAILS_OPPOSITE_RETEST_EXIT` when `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST=true` and the opposite retest appears.
- otherwise `POSITION_EXISTS`.

## Config Parameters

Liquidity-tail model:

- `LIQUIDITY_TAILS_ATR_LENGTH`
- `LIQUIDITY_TAILS_ATR_MULT`
- `LIQUIDITY_TAILS_MIN_WICK_RATIO`
- `LIQUIDITY_TAILS_WICK_DOMINANCE`
- `LIQUIDITY_TAILS_MIN_GAP`
- `LIQUIDITY_TAILS_MAX_AGE`
- `LIQUIDITY_TAILS_KEEP_BROKEN`
- `LIQUIDITY_TAILS_REACTION_CLOSE_BEYOND_ZONE`
- `LIQUIDITY_TAILS_REQUIRE_REACTION_BODY`
- `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT`
- `LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`
- `LIQUIDITY_TAILS_STOP_BUFFER_PCT`
- `LIQUIDITY_TAILS_TARGET_R_MULT`
- `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST`
- `LIQUIDITY_TAILS_MAX_FIGURE_ZONES`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Signal Payload

The strategy stores:

- `additionalIndicators.liquidityTailsContext`
- zone/entry/stop/target figures from `buildLiquidityTailsFigures(...)`
- one take-profit at the computed target

## Common Skip Reasons

- `NO_LIQUIDITY_TAIL_RETEST`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Validation Notes

Check zone age, broken-zone behavior, and retest distance before comparing results. This strategy can be materially affected by candle wick quality and provider differences.
