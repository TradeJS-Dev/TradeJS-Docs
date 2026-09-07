---
title: 'VolumeDivergence'
---

`VolumeDivergence` ищет разворот по расхождению ценовых экстремумов и
экстремумов нормализованного объёма.

## Визуальная схема

![Логика VolumeDivergence](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolumeDivergence/main/docs/strategy-logic.svg)

![Пример сигнала VolumeDivergence](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolumeDivergence/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Строит серию нормализованного объема (`0..100`) по окну `NORMALIZATION_LENGTH`.
2. Подтверждает pivot-high на нормализованном объеме (`PIVOT_LOOKBACK_LEFT`, `PIVOT_LOOKBACK_RIGHT`).
3. Сравнивает текущий и предыдущий pivot:

- bullish divergence: цена делает lower low, а normalized volume — higher low
- bearish divergence: цена делает higher high, а normalized volume — lower high

4. Проверяет расстояние между pivot-confirmation (`MIN_BARS_BETWEEN_PIVOTS`, `MAX_BARS_BETWEEN_PIVOTS`).
5. Применяет side-конфиг (`BULLISH` или `BEARISH`) и TP/SL/risk-проверки.
6. Применяет correlation guard.

## Выходы

Стратегия открывает сделку только когда нет активной позиции.
Отдельного active-exit сопровождения в `core.ts` нет; закрытие через TP/SL и runtime.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI и ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Управляют необязательными решениями AI и ML и их порогами допуска. |
| Риск | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `VOLUME_DIVERGENCE_STOP_ATR_BUFFER_MULT`, `VOLUME_DIVERGENCE_STOP_BUFFER_PCT`, `VOLUME_DIVERGENCE_TARGET_R_MULT` | Задают оценки комиссии, проскальзывания и влияния на рынок, размер позиции, запасы стопа и множитель цели. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды индикаторов для рыночного контекста и фильтров сигнала. |
| Поиск экстремумов | `NORMALIZATION_LENGTH`, `PIVOT_LOOKBACK_LEFT`, `PIVOT_LOOKBACK_RIGHT`, `MIN_BARS_BETWEEN_PIVOTS`, `MAX_BARS_BETWEEN_PIVOTS` | Нормализуют объём и задают подтверждение и расстояние между экстремумами. |
| Качество входа | `ALLOW_STRUCTURE_ADVANCE_ENTRY`, `MIN_DIVERGENCE_AMPLITUDE_ATR_RATIO`, `MIN_RECLAIM_PCT`, `MIN_CONFIRMATION_CANDLE_QUALITY` | Разрешают ранний структурный вход и задают общие пороги дивергенции, возврата и качества свечи. |
| Предел силы | `VOLUME_DIVERGENCE_MAX_STRENGTH`, `VOLUME_DIVERGENCE_MAX_STRENGTH_LONG`, `VOLUME_DIVERGENCE_MAX_STRENGTH_SHORT` | Отсекают сигналы выше общего или направленного предела силы дивергенции. |
| Направления | `BULLISH.*`, `BEARISH.*` | Включают направления и задают минимальный риск, амплитуду дивергенции, возврат, качество подтверждения, повторный тест и максимальное расстояние подтверждения. |

### Общие параметры запуска

- `ENV` — режим запуска.
- `INTERVAL` — таймфрейм.
- `MAKE_ORDERS` — выполнять ордера или только считать сигналы.
- `BACKTEST_PRICE_MODE` — режим цены исполнения в бэктесте.

### AI/ML-параметры

- `AI_ENABLED` — включает AI enrichment/gating.
- `MIN_AI_QUALITY` — минимальное качество AI.
- `ML_ENABLED` — включает ML enrichment.
- `ML_THRESHOLD` — порог ML-оценки.

### Параметры торговли и риска

- `CLOSE_OPPOSITE_POSITIONS` — закрытие противоположной позиции перед новым входом (hook).
- `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` — оценки комиссии, проскальзывания и влияния на рынок для допуска входа и расчёта позиции.
- `MAX_LOSS_VALUE` — максимальный риск для расчета `qty`.
- `MAX_CORRELATION` — максимум допустимой корреляции с BTC.

### Параметры модели дивергенции

- `NORMALIZATION_LENGTH` — окно нормализации объема.
- `PIVOT_LOOKBACK_LEFT` — сколько свечей слева нужно для подтверждения pivot.
- `PIVOT_LOOKBACK_RIGHT` — сколько свечей справа нужно для подтверждения pivot.
- `MIN_BARS_BETWEEN_PIVOTS` — минимальная дистанция между подтверждениями pivot.
- `MAX_BARS_BETWEEN_PIVOTS` — максимальная дистанция между подтверждениями pivot.

### Параметры сценария `BULLISH`

- `BULLISH.enable` — включить/выключить bullish-сценарий.
- `BULLISH.direction` — направление ордера.
- `BULLISH.TP` — take-profit в процентах.
- `BULLISH.SL` — stop-loss в процентах.
- `BULLISH.minRiskRatio` — минимально допустимое риск/прибыль.

### Параметры сценария `BEARISH`

- `BEARISH.enable` — включить/выключить bearish-сценарий.
- `BEARISH.direction` — направление ордера.
- `BEARISH.TP` — take-profit в процентах.
- `BEARISH.SL` — stop-loss в процентах.
- `BEARISH.minRiskRatio` — минимально допустимое риск/прибыль.

## Используемые индикаторы (что означает каждый)

### В логике стратегии

- `normalizedVolume` (внутренний расчет) — объем, нормализованный на локальный максимум.
- `volume pivot high` — pivot-точка на normalized volume.
- `price pivot high/low` — ценовые уровни в pivot-точках.
- `deltaAtPivot` — прокси дельты свечи в pivot (`volume * bodyBias`).
- `correlation` — корреляция актива с BTC для риск-guard.

## Содержимое сигнала

`figures`:

- дивергенс-линия между двумя pivot
- pivot-точки

`additionalIndicators`:

- `divergenceKind`
- normalized volume на текущем/предыдущем pivot
- `deltaAtPivot`
- timestamps/indices/price уровни pivot

## Пример рабочей конфигурации

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "NORMALIZATION_LENGTH": 1000,
  "PIVOT_LOOKBACK_LEFT": 21,
  "PIVOT_LOOKBACK_RIGHT": 5,
  "MIN_BARS_BETWEEN_PIVOTS": 5,
  "MAX_BARS_BETWEEN_PIVOTS": 60,
  "BULLISH": {
    "enable": true,
    "direction": "LONG",
    "TP": 4,
    "SL": 1.3,
    "minRiskRatio": 2
  },
  "BEARISH": {
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
npx @tradejs/cli backtest --user root --config VolumeDivergence:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
