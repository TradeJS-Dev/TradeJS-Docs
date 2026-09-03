---
title: 'MaStrategy'
---

`MaStrategy` входит по пересечению быстрой и медленной скользящих средних.

## Визуальная схема

![Логика MaStrategy](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MaStrategy/main/docs/strategy-logic.svg)

![Пример сигнала MaStrategy](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MaStrategy/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика входа

1. Берет snapshot индикаторов (`maFast[]`, `maSlow[]`).
2. На двух последних точках проверяет crossover:

- bullish: fast пересекает slow снизу вверх
- bearish: fast пересекает slow сверху вниз

3. Выбирает side-конфиг (`LONG` или `SHORT`).
4. Считает TP/SL/qty.
5. Проверяет `minRiskRatio`, cooldown и `MAX_CORRELATION`.
6. Возвращает `entry`.

## Выходы

Если позиция открыта, противоположный MA-cross закрывает ее с кодом `CLOSE_BY_OPPOSITE_MA_CROSS`.
Иначе стратегия возвращает `POSITION_HELD`.

## Ключи конфигурации

Ключи сгруппированы по части стратегии, которой они управляют. Значение `0`
или `false` отключает соответствующий необязательный фильтр, если не указано иное.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Среда | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE` | Задают режим работы, интервал свечей, поведение ордеров и цену исполнения в бэктесте. |
| AI и ML | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Управляют необязательными решениями AI и ML и их порогами допуска. |
| Риск | `FEE_PERCENT`, `MAX_LOSS_VALUE`, `TRADE_COOLDOWN_MS` | Учитывают комиссию, задают размер позиции по лимиту убытка и паузу между входами. |
| Скользящие средние | `MA_FAST`, `MA_SLOW` | Задают периоды быстрой и медленной средних для поиска пересечения. |
| Разрыв средних | `MA_MIN_CROSS_GAP_ATR`, `MA_MIN_CROSS_GAP_ATR_LONG`, `MA_MIN_CROSS_GAP_ATR_SHORT`, `MA_MAX_CROSS_GAP_ATR`, `MA_MAX_CROSS_GAP_ATR_LONG`, `MA_MAX_CROSS_GAP_ATR_SHORT` | Ограничивают расстояние между средними после пересечения в единицах ATR, общее или по направлениям. |
| Качество сигнала | `MA_MIN_FAST_SLOPE_ATR`, `MA_REQUIRE_SLOW_SLOPE_ALIGNMENT`, `MA_REQUIRE_DIRECTIONAL_BODY`, `MA_MIN_BODY_ATR`, `MA_MIN_VOLUME_REL20`, `MA_MIN_VOLUME_REL20_LONG`, `MA_MIN_VOLUME_REL20_SHORT`, `MA_MAX_PRICE_DISTANCE_FAST_ATR` | Требуют достаточный наклон, направление и размер свечи, относительный объём и близость к быстрой средней. |
| Фильтр ориентира | `MA_MAX_CORRELATION`, `MA_MAX_CORRELATION_LONG`, `MA_MAX_CORRELATION_SHORT` | Отсекают сигналы с корреляцией к BTC выше общего или направленного предела. |
| Политика выхода | `MA_EXIT_ON_OPPOSITE_CROSS_LONG`, `MA_EXIT_ON_OPPOSITE_CROSS_SHORT` | Определяют, закрывает ли противоположное пересечение каждое направление. |
| Направления | `LONG.*`, `SHORT.*` | Включают направления и задают тип ордера, цель, стоп и минимальное отношение доходности к риску. |

### Общие параметры запуска

- `ENV` — режим запуска.
- `INTERVAL` — таймфрейм.
- `MAKE_ORDERS` — выполнять ордера или только считать сигналы.
- `BACKTEST_PRICE_MODE` — режим цены исполнения в бэктесте.

### AI/ML-параметры

- `AI_ENABLED` — включает AI enrichment/gating.
- `MIN_AI_QUALITY` — минимальное качество AI для исполнения.
- `ML_ENABLED` — включает ML enrichment.
- `ML_THRESHOLD` — порог ML-оценки.

### Параметры торговли и риска

- `CLOSE_OPPOSITE_POSITIONS` — закрывать противоположные позиции перед новым входом (через hook).
- `FEE_PERCENT` — комиссия в расчетах риск/прибыль.
- `MAX_LOSS_VALUE` — максимальный риск для вычисления `qty`.
- `MAX_CORRELATION` — ограничение по корреляции с BTC.
- `TRADE_COOLDOWN_MS` — пауза между сделками в миллисекундах.

### Параметры индикаторов

- `MA_FAST` — период быстрой скользящей средней.
- `MA_SLOW` — период медленной скользящей средней.

### Параметры сценария `LONG`

- `LONG.enable` — включить/выключить long-сценарий.
- `LONG.direction` — направление ордера (`LONG`).
- `LONG.TP` — take-profit в процентах.
- `LONG.SL` — stop-loss в процентах.
- `LONG.minRiskRatio` — минимально допустимое риск/прибыль.

### Параметры сценария `SHORT`

- `SHORT.enable` — включить/выключить short-сценарий.
- `SHORT.direction` — направление ордера (`SHORT`).
- `SHORT.TP` — take-profit в процентах.
- `SHORT.SL` — stop-loss в процентах.
- `SHORT.minRiskRatio` — минимально допустимое риск/прибыль.

## Используемые индикаторы (что означает каждый)

- `maFast` — быстрая MA, используется для детекции пересечения.
- `maSlow` — медленная MA, используется для детекции пересечения.
- `correlation` — корреляция с BTC, используется как риск-guard.

## Содержимое сигнала

`figures`:

- линия `ma-fast`
- линия `ma-slow`
- точка `ma-cross`

`additionalIndicators`:

- `crossKind`
- `maFastPrev`, `maFastCurrent`
- `maSlowPrev`, `maSlowCurrent`
- `maGap`
- `correlation`

## Пример рабочей конфигурации

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "MA_FAST": 21,
  "MA_SLOW": 55,
  "TRADE_COOLDOWN_MS": 0,
  "LONG": {
    "enable": true,
    "direction": "LONG",
    "TP": 2,
    "SL": 1,
    "minRiskRatio": 1.5
  },
  "SHORT": {
    "enable": true,
    "direction": "SHORT",
    "TP": 2,
    "SL": 1,
    "minRiskRatio": 1.5
  }
}
```

## Запуск

```bash
npx @tradejs/cli backtest --user root --config MaStrategy:base --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
