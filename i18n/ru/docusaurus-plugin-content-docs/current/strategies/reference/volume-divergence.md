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

1. Нормализует объём по окну `NORMALIZATION_LENGTH` через `rolling_max`
   (по умолчанию) или `rolling_median`.
2. Подтверждает экстремумы объёма (по умолчанию) или цены. Источник задаёт
   `VOLUME_DIVERGENCE_PIVOT_SOURCE`; оба режима используют
   `PIVOT_LOOKBACK_LEFT` и `PIVOT_LOOKBACK_RIGHT`.
3. Сравнивает текущий и предыдущий pivot:

- bullish divergence: цена делает lower low, а normalized volume — higher low
- bearish divergence: цена делает higher high, а normalized volume — lower high

4. Проверяет расстояние между pivot-confirmation (`MIN_BARS_BETWEEN_PIVOTS`, `MAX_BARS_BETWEEN_PIVOTS`).
5. Применяет side-конфиг (`BULLISH` или `BEARISH`) и TP/SL/risk-проверки.

## Выходы

Стратегия открывает сделку только когда нет активной позиции.
Позицию закрывает общий механизм исполнения по стопу и плану тейков.
Частичный тейк используется только при доле между `0` и `1` и положительном
расстоянии в R меньше `VOLUME_DIVERGENCE_TARGET_R_MULT`. Иначе вся позиция
закрывается по конечной цели. Доля `0` отключает частичный выход.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI и ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Управляют необязательными решениями AI и ML и их порогами допуска. |
| Риск | `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS`, `MAX_LOSS_VALUE`, `VOLUME_DIVERGENCE_STOP_ATR_BUFFER_MULT`, `VOLUME_DIVERGENCE_STOP_BUFFER_PCT`, `VOLUME_DIVERGENCE_TARGET_R_MULT` | Задают оценки комиссии, проскальзывания и влияния на рынок, размер позиции, запасы стопа и множитель цели. |
| Общие индикаторы | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды индикаторов для рыночного контекста и фильтров сигнала. |
| Поиск экстремумов | `NORMALIZATION_LENGTH`, `VOLUME_DIVERGENCE_NORMALIZATION_MODE`, `VOLUME_DIVERGENCE_PIVOT_SOURCE`, `PIVOT_LOOKBACK_LEFT`, `PIVOT_LOOKBACK_RIGHT`, `MIN_BARS_BETWEEN_PIVOTS`, `MAX_BARS_BETWEEN_PIVOTS` | Нормализуют объём и задают подтверждение и расстояние между экстремумами. |
| Качество входа | `ALLOW_STRUCTURE_ADVANCE_ENTRY`, `MIN_DIVERGENCE_AMPLITUDE_ATR_RATIO`, `MIN_RECLAIM_PCT`, `MIN_CONFIRMATION_CANDLE_QUALITY` | Разрешают ранний структурный вход и задают общие пороги дивергенции, возврата и качества свечи. |
| Предел силы | `VOLUME_DIVERGENCE_MAX_STRENGTH`, `VOLUME_DIVERGENCE_MAX_STRENGTH_LONG`, `VOLUME_DIVERGENCE_MAX_STRENGTH_SHORT` | Отсекают сигналы выше общего или направленного предела силы дивергенции. |
| Ожидание и частичный выход | `VOLUME_DIVERGENCE_PENDING_EXPIRY_MODE`, `VOLUME_DIVERGENCE_PARTIAL_EXIT_RATE`, `VOLUME_DIVERGENCE_PARTIAL_EXIT_R_MULT` | Задают фиксированную или структурную отмену ожидающего входа, долю частичного тейка и его расстояние в R. |
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

### Параметры модели дивергенции

- `NORMALIZATION_LENGTH` — окно нормализации объема.
- `PIVOT_LOOKBACK_LEFT` — сколько свечей слева нужно для подтверждения pivot.
- `PIVOT_LOOKBACK_RIGHT` — сколько свечей справа нужно для подтверждения pivot.
- `MIN_BARS_BETWEEN_PIVOTS` — минимальная дистанция между подтверждениями pivot.
- `MAX_BARS_BETWEEN_PIVOTS` — максимальная дистанция между подтверждениями pivot.

### Параметры сценария `BULLISH`

- `BULLISH.enable` — включить/выключить bullish-сценарий.
- `BULLISH.direction` — направление ордера.
- `BULLISH.minRiskRatio` — минимально допустимое риск/прибыль.

### Параметры сценария `BEARISH`

- `BEARISH.enable` — включить/выключить bearish-сценарий.
- `BEARISH.direction` — направление ордера.
- `BEARISH.minRiskRatio` — минимально допустимое риск/прибыль.

`VOLUME_DIVERGENCE_PENDING_EXPIRY_MODE=fixed` использует заданный срок
ожидания. Режим `structural` сохраняет ожидающий вход до нарушения структуры
или появления более нового подтверждённого экстремума.
Смена нормализации или источника экстремумов меняет поведение детектора и
требует отдельного сравнения. По умолчанию пакет использует `rolling_max`,
`volume` и `fixed`.

## Используемые индикаторы (что означает каждый)

### В логике стратегии

- `normalizedVolume` — объём, нормализованный на выбранный скользящий максимум или медиану.
- `volume pivot high` — подтверждение экстремума в режиме объёма; режим цены использует ценовые экстремумы.
- `price pivot high/low` — ценовые уровни в pivot-точках.
- `deltaAtPivot` — прокси дельты свечи в pivot (`volume * bodyBias`).

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
  "NORMALIZATION_LENGTH": 100,
  "VOLUME_DIVERGENCE_NORMALIZATION_MODE": "rolling_max",
  "VOLUME_DIVERGENCE_PIVOT_SOURCE": "volume",
  "VOLUME_DIVERGENCE_TARGET_R_MULT": 4,
  "PIVOT_LOOKBACK_LEFT": 21,
  "PIVOT_LOOKBACK_RIGHT": 5,
  "MIN_BARS_BETWEEN_PIVOTS": 5,
  "MAX_BARS_BETWEEN_PIVOTS": 60,
  "BULLISH": {
    "enable": true,
    "direction": "LONG",
    "minRiskRatio": 2
  },
  "BEARISH": {
    "enable": true,
    "direction": "SHORT",
    "minRiskRatio": 2
  }
}
```

## Запуск

```bash
npx @tradejs/cli backtest --user root --config VolumeDivergence:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
