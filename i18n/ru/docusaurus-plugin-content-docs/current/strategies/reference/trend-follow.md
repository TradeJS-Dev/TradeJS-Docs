---
title: 'TrendFollow'
---

`TrendFollow` входит на продолжение тренда, используя скользящую линию стопа и
детерминированные фильтры входа.

## Визуальная схема

![Логика TrendFollow](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendFollow/main/docs/strategy-logic.svg)

![Пример сигнала TrendFollow](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendFollow/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Прогоняет свечи через `createTrendFollowEngine(...)`.
2. Читает `runtimeState.signal` и `runtimeState.snapshot`.
3. Ждет bullish или bearish trend signal.
4. Выбирает side config `LONG` или `SHORT` по направлению сигнала.
5. Использует `signal.trailStop` как stop-loss reference.
6. Считает target от `TRENDFOLLOW_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учётом оценок `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS` и `RISK_MARKET_IMPACT_BPS`.
8. Возвращает `entry` с trend-follow figures и `trendFollowContext`.

Entry codes:

- `TRENDFOLLOW_BULL_TREND`
- `TRENDFOLLOW_BEAR_TREND`

## Выходы

Если позиция уже открыта:

- `TRENDFOLLOW_TRAIL_STOP_EXIT`, когда `TRENDFOLLOW_EXIT_ON_TRAIL_STOP=true` и цена пересекает active trailing stop.
- `TRENDFOLLOW_OPPOSITE_SIGNAL_EXIT`, когда `TRENDFOLLOW_EXIT_ON_OPPOSITE_SIGNAL=true` и engine дает opposite trend signal.
- иначе `POSITION_EXISTS`.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Суффиксы `_LONG` и `_SHORT` переопределяют
общее значение для соответствующего направления.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для общего рыночного контекста и фильтров сигнала. |
| Линия тренда | `TRENDFOLLOW_PIVOT_LENGTH`, `TRENDFOLLOW_ATR_LENGTH`, `TRENDFOLLOW_ATR_MULT`, `TRENDFOLLOW_SIGNAL_OFFSET_ATR`, `TRENDFOLLOW_MIN_BARS_BETWEEN_SIGNALS` | Задают подтверждённые экстремумы, шкалу линии от ATR, отступ сигнала и паузу между сигналами. |
| Структура входа | `TRENDFOLLOW_REQUIRE_STRUCTURE_BREAKOUT`, `TRENDFOLLOW_REQUIRE_TREND_ALIGNMENT`, `TRENDFOLLOW_REQUIRE_BENCHMARK_ALIGNMENT`, `TRENDFOLLOW_MIN_STRUCTURE_ACCEPTANCE_CLOSES`, `TRENDFOLLOW_MIN_BREAKOUT_BODY_ATR`, `TRENDFOLLOW_MIN_BREAKOUT_DISTANCE_PCT`, `TRENDFOLLOW_MIN_BREAKOUT_DISTANCE_PCT_LONG`, `TRENDFOLLOW_MIN_BREAKOUT_DISTANCE_PCT_SHORT`, `TRENDFOLLOW_MAX_BREAKOUT_DISTANCE_PCT` | Требуют подтверждённый пробой структуры и согласие тренда или ориентира в допустимом диапазоне расстояния. |
| Участие и режим | `TRENDFOLLOW_MIN_VOLUME_REL20`, `TRENDFOLLOW_MIN_TREND_PERSISTENCE`, `TRENDFOLLOW_MIN_TREND_PERSISTENCE_LONG`, `TRENDFOLLOW_MIN_TREND_PERSISTENCE_SHORT`, `TRENDFOLLOW_MAX_RSI`, `TRENDFOLLOW_MAX_RSI_LONG`, `TRENDFOLLOW_MAX_RSI_SHORT`, `TRENDFOLLOW_MAX_BB_WIDTH_PCT`, `TRENDFOLLOW_MAX_BB_WIDTH_PCT_LONG`, `TRENDFOLLOW_MAX_BB_WIDTH_PCT_SHORT` | Задают фильтры объёма, устойчивости тренда, RSI и ширины полос Боллинджера. |
| Цель и выходы | `TRENDFOLLOW_TARGET_R_MULT`, `TRENDFOLLOW_TARGET_R_MULT_LONG`, `TRENDFOLLOW_TARGET_R_MULT_SHORT`, `TRENDFOLLOW_EXIT_ON_TRAIL_STOP`, `TRENDFOLLOW_EXIT_ON_OPPOSITE_SIGNAL` | Задают цели по направлениям и включают выход по следящему стопу или противоположному сигналу. |
| Графика и направления | `TRENDFOLLOW_MAX_FIGURE_POINTS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*` | Ограничивают объём графики, задают лимит убытка и настройки направлений. |

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
- risk: `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `LONG.*`, `SHORT.*`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Содержимое сигнала

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
