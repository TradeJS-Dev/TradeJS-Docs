---
title: 'ReverseTrendLine'
---

`ReverseTrendLine` строит линии поддержки и сопротивления по недавним
экстремумам и торгует отбой от них, а не пробой, используемый `TrendLine`.

## Визуальная схема

![Логика TrendLine и ReverseTrendLine](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendLine/main/docs/strategy-logic.svg)

![Пример сигналов TrendLine и ReverseTrendLine](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendLine/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Строит high/low trendline candidates из candle pivots.
2. Ждет valid reverse setup по включенной стороне (`HIGHS` или `LOWS`).
3. Применяет volatility и timing filters.
4. Выбирает side config по направлению candidate.
5. Ставит stop от `REVERSE_TRENDLINE_STOP_BASE_PCT`.
6. Считает target от `REVERSE_TRENDLINE_TARGET_R_MULT`.
7. Считает qty от `MAX_LOSS_VALUE / riskDistance` с учётом оценок `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS` и `RISK_MARKET_IMPACT_BPS`.
8. Возвращает `entry` с reverse-trendline figures и signal seed indicators.

Entry code:

- `REVERSE_TRENDLINE_SIGNAL`

## Выходы

Если позиция уже открыта:

- `REVERSE_TRENDLINE_FAILED_BOUNCE_EXIT`, когда expected bounce/rejection не подтверждается.
- иначе `POSITION_EXISTS`.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY` | Управляют необязательным решением AI и порогом допуска. |
| Риск | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `REVERSE_TRENDLINE_STOP_BASE_PCT`, `REVERSE_TRENDLINE_TARGET_R_MULT` | Задают оценки комиссии, проскальзывания и влияния на рынок, размер позиции, расстояние стопа и множитель цели. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL` | Задают периоды индикаторов для контекста линии и фильтров сигнала. |
| Геометрия линии | `TRENDLINE.minTouches`, `TRENDLINE.offset`, `TRENDLINE.epsilon`, `TRENDLINE.epsilonOffset` | Задают расстояние между экстремумами, число касаний и допуск цены для построенной линии. |
| Качество отбоя | `REVERSE_TRENDLINE_MIN_REJECTION_WICK_PCT`, `REVERSE_TRENDLINE_MIN_REJECTION_STRENGTH_PCT`, `REVERSE_TRENDLINE_MIN_REJECTION_STRENGTH_PCT_LONG`, `REVERSE_TRENDLINE_MIN_REJECTION_STRENGTH_PCT_SHORT`, `REVERSE_TRENDLINE_MAX_BREAK_ATR_RATIO`, `REVERSE_TRENDLINE_MAX_BREAK_ATR_RATIO_LONG`, `REVERSE_TRENDLINE_MAX_BREAK_ATR_RATIO_SHORT` | Требуют заметный отбой и ограничивают проход цены за линию, общее или по направлениям. |
| Согласование рынка | `REVERSE_TRENDLINE_MAX_BTC_MA_SPREAD_PCT`, `REVERSE_TRENDLINE_MAX_BTC_MA_SPREAD_PCT_LONG`, `REVERSE_TRENDLINE_MAX_BTC_MA_SPREAD_PCT_SHORT`, `REVERSE_TRENDLINE_REQUIRE_COIN_BIAS_ALIGNMENT`, `REVERSE_TRENDLINE_REQUIRE_BTC_BIAS_ALIGNMENT` | Ограничивают разрыв средних BTC и при необходимости требуют согласия направления инструмента и BTC со сделкой. |
| Момент входа и выхода | `REVERSE_TRENDLINE_ALLOWED_ENTRY_TIMINGS`, `REVERSE_TRENDLINE_FAILED_BOUNCE_EXIT_PCT` | Выбирают допустимые состояния детектора и движение против позиции для выхода из неудачного отбоя. |
| Направления | `HIGHS.*`, `LOWS.*` | Включают отбой от верхней или нижней линии и задают направление и минимальное отношение доходности к риску. |

Trendline model:

- `TRENDLINE.minTouches`
- `TRENDLINE.offset`
- `TRENDLINE.epsilon`
- `TRENDLINE.epsilonOffset`
- `REVERSE_TRENDLINE_STOP_BASE_PCT`
- `REVERSE_TRENDLINE_TARGET_R_MULT`

Side configs:

- `HIGHS.enable`, `HIGHS.direction`, `HIGHS.minRiskRatio`
- `LOWS.enable`, `LOWS.direction`, `LOWS.minRiskRatio`

Shared groups:

- runtime: `ENV`, `INTERVAL`, `MAKE_ORDERS`, `BACKTEST_PRICE_MODE`
- AI/ML: `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD`
- risk: `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`
- shared indicators: MA, OBV, ATR, BB, MACD fields

## Содержимое сигнала

Стратегия сохраняет:

- reverse-trendline figures из `buildReverseTrendLineFigures(...)`
- signal seed indicators из `buildReverseTrendlineSignalSeed(...)`
- `orderPlan.qty`
- `orderPlan.stopLossPrice`
- один take-profit по рассчитанному target

## Частые skip reasons

- `NO_TRENDLINE`
- `POSITION_EXISTS`
- `DEV_TRADE_COOLDOWN`
- `VERY_VOLATILITY`
- `REVERSE_TRENDLINE_TIMING:<code>`
- `INVALID_QTY`
- `RISK_RATIO:<value>`

## Что проверять

Trendline-стратегии чувствительны к выбору pivots, gaps в свечах и масштабу графика. Проверяйте generated figures перед интерпретацией метрик, особенно при изменении `TRENDLINE.epsilon` или timeframe.

Related:

- [TrendLine](./trendline)
- [Backtesting caveats](../../limitations/backtesting-caveats)
