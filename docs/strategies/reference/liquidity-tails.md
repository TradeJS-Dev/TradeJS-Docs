---
title: 'LiquidityTails'
---

`LiquidityTails` is a built-in TypeScript strategy from `@tradejs/strategy-liquidity-tails`.

It detects wick/tail liquidity zones, waits for retests, and trades reactions with a stop outside the retested zone.

## Visual overview

![LiquidityTails strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-LiquidityTails/main/docs/strategy-logic.svg)

![LiquidityTails signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-LiquidityTails/main/docs/signal-example.svg)

The illustrations are schematic, not market data. Exact thresholds,
confirmation rules, and risk parameters come from the active strategy config.

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
8. Sizes quantity from `MAX_LOSS_VALUE / riskDistance`, using the `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, and `RISK_MARKET_IMPACT_BPS` estimates.
9. Optionally reserves part of the risk budget for later scale-ins at improved retests.
10. Returns `entry` with liquidity-tail figures and `liquidityTailsContext`.

Entry codes:

- `LIQUIDITY_TAILS_BUY_PRESSURE_RETEST`
- `LIQUIDITY_TAILS_SELL_PRESSURE_RETEST`

## Exits

When a position exists:

- `LIQUIDITY_TAILS_INVALIDATION_EXIT` when the configured directional invalidation policy is enabled.
- `LIQUIDITY_TAILS_OPPOSITE_RETEST_EXIT` when `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST=true` and the opposite retest appears.
- `LIQUIDITY_TAILS_SCALE_IN_RETEST_EXIT` when an intended addition retest should close instead.
- otherwise a qualifying improved retest can produce `LIQUIDITY_TAILS_*_SCALE_IN` until the configured addition count or basket risk budget is exhausted.
- otherwise `POSITION_EXISTS`.

## Configuration keys

The keys are grouped by purpose. A listed `_LONG` or `_SHORT` key overrides
the unsuffixed value for that direction.

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Set the periods used to build shared market context and signal filters. |
| Zone origin | `LIQUIDITY_TAILS_ATR_LENGTH`, `LIQUIDITY_TAILS_ATR_MULT`, `LIQUIDITY_TAILS_MIN_WICK_RATIO`, `LIQUIDITY_TAILS_MIN_WICK_RATIO_LONG`, `LIQUIDITY_TAILS_MIN_WICK_RATIO_SHORT`, `LIQUIDITY_TAILS_WICK_DOMINANCE`, `LIQUIDITY_TAILS_WICK_DOMINANCE_LONG`, `LIQUIDITY_TAILS_WICK_DOMINANCE_SHORT`, `LIQUIDITY_TAILS_MIN_GAP`, `LIQUIDITY_TAILS_MIN_ORIGIN_VOLUME_REL20`, `LIQUIDITY_TAILS_REQUIRE_ORIGIN_BODY_ALIGNED` | Define a qualifying wick, its ATR scale, directional dominance, spacing, volume, and body alignment. |
| Zone lifetime | `LIQUIDITY_TAILS_MAX_AGE`, `LIQUIDITY_TAILS_KEEP_BROKEN`, `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS`, `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS_LONG`, `LIQUIDITY_TAILS_MAX_ENTRY_ZONE_AGE_BARS_SHORT` | Control how long zones remain valid and whether broken zones stay available. |
| Retest geometry | `LIQUIDITY_TAILS_REACTION_CLOSE_BEYOND_ZONE`, `LIQUIDITY_TAILS_REQUIRE_REACTION_BODY`, `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT`, `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT_LONG`, `LIQUIDITY_TAILS_MAX_RETEST_DISTANCE_PCT_SHORT`, `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS`, `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS_LONG`, `LIQUIDITY_TAILS_MIN_RETEST_AGE_BARS_SHORT` | Define where the reaction closes and how near and how late a valid retest may occur. |
| Retest quality | `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES`, `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES_LONG`, `LIQUIDITY_TAILS_MIN_ZONE_TOUCHES_SHORT`, `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL`, `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL_LONG`, `LIQUIDITY_TAILS_MAX_ENTRY_RETEST_ORDINAL_SHORT`, `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO`, `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO_LONG`, `LIQUIDITY_TAILS_MIN_REJECTION_EFFICIENCY_RATIO_SHORT`, `LIQUIDITY_TAILS_CLOSE_HOLD_BARS`, `LIQUIDITY_TAILS_CLOSE_HOLD_BARS_LONG`, `LIQUIDITY_TAILS_CLOSE_HOLD_BARS_SHORT` | Require enough touches, limit the accepted retest number, and validate rejection efficiency and close persistence. |
| Target, stop, and exits | `LIQUIDITY_TAILS_STOP_ATR_BUFFER_MULT`, `LIQUIDITY_TAILS_STOP_BUFFER_PCT`, `LIQUIDITY_TAILS_TARGET_R_MULT`, `LIQUIDITY_TAILS_TARGET_R_MULT_LONG`, `LIQUIDITY_TAILS_TARGET_R_MULT_SHORT`, `LIQUIDITY_TAILS_EXIT_ON_OPPOSITE_RETEST`, `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION`, `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION_LONG`, `LIQUIDITY_TAILS_EXIT_ON_INVALIDATION_SHORT`, `LIQUIDITY_TAILS_EXIT_ON_SCALE_IN_RETEST` | Set stop and directional target distances and choose which retest or invalidation events close a position. |
| Position building | `LIQUIDITY_TAILS_SCALE_IN_ENABLED`, `LIQUIDITY_TAILS_SCALE_IN_COUNT`, `LIQUIDITY_TAILS_INITIAL_RISK_FRACTION`, `LIQUIDITY_TAILS_SCALE_IN_MIN_IMPROVEMENT_ATR` | Enable staged entries, set their count and initial risk share, and require an improved scale-in price. |
| Figures and side policy | `LIQUIDITY_TAILS_MAX_FIGURE_ZONES`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Limit chart zones, set the loss budget, and configure each direction. |

With deterministic `AI_MODE: "gate"`, the current local gate requires broad
participation among the five largest market assets and a low negative
directional indicator reading. Missing required context rejects the entry.

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

Check zone age, broken-zone behavior, and retest distance before comparing
results. Candle wick quality and provider differences can change the result.
When scale-ins are enabled, evaluate basket-level maximum loss and confirm that
the connector can increase an existing position.
