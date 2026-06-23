---
title: 'TrendFollow'
---

`TrendFollow` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она исследует continuation-style trend setups с trailing stop line и strategy-specific deterministic guardrails.

## Логика входа

1. Прогоняет свечи через `createTrendFollowEngine(...)`.
2. Читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждет bullish или bearish trend signal.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Использует `signal.trailStop` как stop-loss reference.
6. Считает target от `TRENDFOLLOW_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учетом `FEE_PERCENT`.
8. Возвращает `entry` с trend-follow figures и `trendFollowContext`.

Entry codes:

- `TRENDFOLLOW_BULL_TREND`
- `TRENDFOLLOW_BEAR_TREND`

## Выходы

Если позиция уже открыта:

- `TRENDFOLLOW_TRAIL_STOP_EXIT`, когда `TRENDFOLLOW_EXIT_ON_TRAIL_STOP=true` и цена пересекает active trailing stop.
- `TRENDFOLLOW_OPPOSITE_SIGNAL_EXIT`, когда `TRENDFOLLOW_EXIT_ON_OPPOSITE_SIGNAL=true` и engine дает opposite trend signal.
- иначе `POSITION_EXISTS`.

## Параметры

Trend model:

- `TRENDFOLLOW_PIVOT_LENGTH`
- `TRENDFOLLOW_MIN_BARS_BETWEEN_SIGNALS`
- `TRENDFOLLOW_ATR_LENGTH`
- `TRENDFOLLOW_ATR_MULT`
- `TRENDFOLLOW_SIGNAL_OFFSET_ATR`
- `TRENDFOLLOW_TARGET_R_MULT`
- `TRENDFOLLOW_EXIT_ON_TRAIL_STOP`
- `TRENDFOLLOW_EXIT_ON_OPPOSITE_SIGNAL`
- `TRENDFOLLOW_MAX_FIGURE_POINTS`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `FEE_PERCENT`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Payload сигнала

Стратегия сохраняет:

- `additionalIndicators.trendFollowContext`
- trend и trailing-stop figures из `buildTrendFollowFigures(...)`
- stop по `signal.trailStop`
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_TREND_FOLLOW_SIGNAL`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `STRATEGY_DISABLED`
- `INVALID_STOP`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Trend-following experiments чувствительны к stop distance, warmup length и market regime. Рассматривайте guardrails как implementation details и валидируйте их на своих tickers/timeframes.

Related:

- [AI/ML workflows](../../guides/ai-ml-workflows)
- [Backtesting caveats](../../limitations/backtesting-caveats)
