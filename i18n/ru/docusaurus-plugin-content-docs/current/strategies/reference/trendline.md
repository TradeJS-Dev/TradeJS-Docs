---
title: 'TrendLine'
---

`TrendLine` — встроенная TypeScript-стратегия из `@tradejs/strategy-trend-line` для входа по пробою трендовой линии с риск-ограничениями.

## Визуальная схема

![Логика TrendLine и ReverseTrendLine](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendLine/main/docs/strategy-logic.svg)

![Пример сигналов TrendLine и ReverseTrendLine](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-TrendLine/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Строит трендлайны по high/low через `createTrendlineEngine`.
2. Берет лучшую линию (`lows` в приоритете, иначе `highs`).
3. Выполняет guard-проверки: нет линии, есть позиция, cooldown, слишком высокая волатильность свечей.
4. Выбирает side-конфиг:

- `HIGHS` — сценарий для пробоя сопротивления
- `LOWS` — сценарий для пробоя поддержки

5. Считает TP/SL/qty через `strategyApi.getDirectionalTpSlPrices`.
6. Проверяет `minRiskRatio` и `MAX_CORRELATION`.
7. Возвращает `entry` с figures и метаданными трендлайна.

## Выходы

В `core.ts` нет отдельного активного сопровождения позиции.
Позиция завершается через TP/SL и runtime/order engine.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI и ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Управляют необязательными решениями AI и ML и их порогами допуска. |
| Риск | `FEE_PERCENT`, `MAX_LOSS_VALUE`, `TRENDLINE_STOP_BASE_PCT`, `TRENDLINE_TARGET_R_MULT` | Учитывают комиссию, задают размер позиции, расстояние стопа и множитель цели. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды индикаторов для рыночного контекста и фильтров сигнала. |
| Геометрия линии | `TRENDLINE.minTouches`, `TRENDLINE.offset`, `TRENDLINE.epsilon`, `TRENDLINE.epsilonOffset` | Задают расстояние между экстремумами, число касаний и допуск цены для построенной линии. |
| Качество пробоя | `TRENDLINE_MIN_BREAK_ATR_RATIO`, `TRENDLINE_MAX_BREAK_ATR_RATIO`, `TRENDLINE_WEAK_BREAK_MAX_ATR_RATIO`, `TRENDLINE_WEAK_BREAK_MIN_VOLUME_REL20` | Требуют значимый пробой линии и больший объём для слабых пробоев. |
| Объём | `TRENDLINE_MIN_VOLUME_REL20`, `TRENDLINE_MIN_VOLUME_REL20_LONG`, `TRENDLINE_MIN_VOLUME_REL20_SHORT` | Задают минимальный относительный объём, общий или по направлениям. |
| Волатильность | `TRENDLINE_MAX_BB_WIDTH_PCT`, `TRENDLINE_MAX_BB_WIDTH_PCT_LONG`, `TRENDLINE_MAX_BB_WIDTH_PCT_SHORT` | Отсекают входы при слишком широкой полосе Боллинджера. |
| Согласование и момент | `TRENDLINE_REQUIRE_SLOPE_ALIGNMENT`, `TRENDLINE_REQUIRE_BTC_BIAS_ALIGNMENT`, `TRENDLINE_ALLOWED_ENTRY_TIMINGS` | При необходимости согласуют наклон линии и направление BTC и выбирают допустимые состояния детектора. |
| Направления | `HIGHS.*`, `LOWS.*` | Включают пробой верхней или нижней линии и задают направление и минимальное отношение доходности к риску. |

### Общие параметры запуска

- `ENV` — режим запуска (`BACKTEST`, `CRON`, `LIVE` и т.д.).
- `INTERVAL` — рабочий таймфрейм стратегии.
- `MAKE_ORDERS` — если `false`, ордера не исполняются (сигналы продолжают считаться).
- `BACKTEST_PRICE_MODE` — как брать цену исполнения в бэктесте (`open`/`close`/`mid`).

### AI/ML-параметры

- `AI_ENABLED` — включает AI enrichment и AI-gating.
- `MIN_AI_QUALITY` — минимальное качество AI для исполнения ордера вне `BACKTEST`.
- `ML_ENABLED` — включает ML enrichment.
- `ML_THRESHOLD` — порог ML (используется runtime-слоем).

### Параметры торговли и риска

- `CLOSE_OPPOSITE_POSITIONS` — закрывать противоположную позицию перед новым входом (hook).
- `FEE_PERCENT` — комиссия, учитывается при расчете риск/прибыль.
- `MAX_LOSS_VALUE` — максимальный риск в валюте депозита для расчета `qty`.
- `MAX_CORRELATION` — верхний порог корреляции с BTC (guard вне `BACKTEST`).

### Параметры построения трендлайна

- `TRENDLINE.minTouches` — минимальное число касаний для валидной линии.
- `TRENDLINE.offset` — сдвиг для поиска опорных точек.
- `TRENDLINE.epsilon` — базовый допуск отклонения от линии.
- `TRENDLINE.epsilonOffset` — дополнительный допуск для устойчивости к шуму.

### Параметры сценария `HIGHS`

- `HIGHS.enable` — включить/выключить сценарий.
- `HIGHS.direction` — направление сделки (`LONG`/`SHORT`).
- `HIGHS.TP` — take-profit в процентах.
- `HIGHS.SL` — stop-loss в процентах.
- `HIGHS.minRiskRatio` — минимально допустимое отношение риск/прибыль.

### Параметры сценария `LOWS`

- `LOWS.enable` — включить/выключить сценарий.
- `LOWS.direction` — направление сделки (`LONG`/`SHORT`).
- `LOWS.TP` — take-profit в процентах.
- `LOWS.SL` — stop-loss в процентах.
- `LOWS.minRiskRatio` — минимально допустимое отношение риск/прибыль.

## Используемые индикаторы (что означает каждый)

- `correlation` — корреляция актива с BTC; используется как runtime guard (`MAX_CORRELATION`).
- `trendLine` (производная геометрия, не базовый индикатор) — выбранная линия из trendline engine, от нее зависит направление и параметры входа.

## Содержимое сигнала

`figures`:

- `lines[]` — выбранная трендовая линия
- `points[]` — точки/касания трендлайна

`additionalIndicators`:

- `touches`
- `distance`
- `trendLine`

## Пример рабочей конфигурации

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "MAKE_ORDERS": true,
  "CLOSE_OPPOSITE_POSITIONS": false,
  "TRENDLINE": {
    "minTouches": 4,
    "offset": 3,
    "epsilon": 0.003,
    "epsilonOffset": 0.004
  },
  "HIGHS": {
    "enable": true,
    "direction": "LONG",
    "TP": 4,
    "SL": 1.3,
    "minRiskRatio": 2
  },
  "LOWS": {
    "enable": true,
    "direction": "SHORT",
    "TP": 4,
    "SL": 1.3,
    "minRiskRatio": 2
  }
}
```

## Запуск

```bash
npx @tradejs/cli backtest --user root --config TrendLine:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
