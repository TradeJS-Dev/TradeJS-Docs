---
title: 'AdaptiveMomentumRibbon'
---

`AdaptiveMomentumRibbon` — встроенная Pine-стратегия из `@tradejs/strategy-adaptive-momentum-ribbon`.

Runtime передает в `core.ts` загрузчик скрипта (`loadPineScriptFile`), поэтому Pine-логика хранится отдельно и обновляется независимо от TypeScript-кода.

## Логика входа

1. `core.ts` загружает Pine-код через `loadPineScriptFile('adaptiveMomentumRibbon.pine')`.
2. Берет последние свечи (`AMR_LOOKBACK_BARS`) и выполняет Pine через `runPineScript`.
3. Читает последние значения plot:

- `entryLong`, `entryShort`
- `invalidated`, `activeBuy`, `activeSell`
- `signalOsc`, `kcMidline`, `kcUpper`, `kcLower`, `invalidationLevel`

4. Если оба `entry` одновременно `true`, делает skip (конфликт).
5. Если позиция уже открыта:

- закрывает по противоположному сигналу
- опционально закрывает по invalidation (`AMR_EXIT_ON_INVALIDATION`)

6. Если позиции нет и сигнал валидный:

- применяет side-конфиг (`LONG` или `SHORT`)
- ставит structural stop за Pine invalidation/Keltner level
- считает R-multiple target и risk-sized qty
- при включенных guardrails отбрасывает плохую signal-time execution geometry
- возвращает `entry`

## Выходы

- `CLOSE_BY_AMR_SIGNAL` — противоположный сигнал
- `CLOSE_BY_AMR_INVALIDATION` — invalidation при `AMR_EXIT_ON_INVALIDATION=true`

## Параметры конфига (что означает каждый)

### Общие runtime-параметры

- `ENV` — режим запуска.
- `INTERVAL` — таймфрейм.
- `MAKE_ORDERS` — выполнять ордера или только считать сигналы.
- `BACKTEST_PRICE_MODE` — режим цены исполнения в бэктесте.

### AI/ML-параметры

- `AI_ENABLED` — включает AI enrichment/gating.
- `MIN_AI_QUALITY` — минимальное качество AI.
- `ML_ENABLED` — включает ML enrichment.
- `ML_THRESHOLD` — порог ML-оценки.

### Параметры Pine-модели AMR

- `AMR_MOMENTUM_PERIOD` — `Momentum Period` в Pine.
- `AMR_BUTTERWORTH_SMOOTHING` — `Butterworth Smoothing` в Pine.
- `AMR_WAIT_CLOSE` — подтверждать сигналы только на закрытии свечи.
- `AMR_CONFIRM_ON_NEXT_BAR` — подтверждать candidate следующей закрытой свечой.
- `AMR_MIN_SIGNAL_OSC_ABS`, `AMR_MIN_SIGNAL_OSC_ABS_LONG`, `AMR_MIN_SIGNAL_OSC_ABS_SHORT` — порог силы oscillator с directional overrides.
- `AMR_REQUIRE_KC_BIAS` — требовать согласование с Keltner bias.
- `AMR_MIN_BARS_BETWEEN_SIGNALS` — detector cooldown.
- `AMR_SHOW_INVALIDATION_LEVELS` — рисовать invalidation-уровни.
- `AMR_SHOW_KELTNER_CHANNEL` — рисовать Keltner Channel.
- `AMR_KC_LENGTH` — период Keltner midline.
- `AMR_KC_MA_TYPE` — тип MA для midline (`SMA`, `EMA`, `SMMA (RMA)`, `WMA`, `VWMA`).
- `AMR_ATR_LENGTH` — период ATR для Keltner.
- `AMR_ATR_MULTIPLIER` — множитель ATR для Keltner bands.

### Параметры исполнения/визуализации

- `AMR_LOOKBACK_BARS` — сколько свечей передавать в Pine на один расчет.
- `AMR_STOP_BUFFER_PCT` — buffer за structural invalidation level.
- `AMR_TARGET_R_MULT` — расстояние target в initial-risk multiples.
- `AMR_MIN_TP_DISTANCE_BPS*` — optional minimum target distance.
- `AMR_MAX_DELAY_RISK_TP_RATIO*` и `AMR_DELAY_RISK_MOVE_MULT*` — optional signal-time delayed-entry risk guard.
- `AMR_EXIT_ON_OPPOSITE_SIGNAL` — выход по противоположному AMR signal.
- `AMR_EXIT_ON_INVALIDATION` — закрывать позицию по invalidation-сигналу.
- `AMR_LINE_PLOTS` — какие plot-линии переносить в `figures.lines`.
- `CLOSE_OPPOSITE_POSITIONS` — поле есть в конфиге по общему шаблону, текущий `AdaptiveMomentumRibbon` hook-логику по нему не использует.

### Параметры сценария `LONG`

- `LONG.enable` — включить/выключить long-сценарий.
- `LONG.direction` — направление ордера (`LONG`).
- `LONG.minRiskRatio` — минимальный net reward/risk после costs.

### Параметры сценария `SHORT`

- `SHORT.enable` — включить/выключить short-сценарий.
- `SHORT.direction` — направление ордера (`SHORT`).
- `SHORT.minRiskRatio` — минимальный net reward/risk после costs.

## Используемые индикаторы (что означает каждый)

### Pine-серии, которые использует стратегия

- `entryLong`, `entryShort` — бинарные входные сигналы.
- `activeBuy`, `activeSell` — состояние активного buy/sell контекста.
- `invalidated` — флаг инвалидированного сигнала.
- `signalOsc` — сглаженный осциллятор AMR (центр вокруг 0).
- `kcMidline` — центральная линия Keltner.
- `kcUpper` — верхняя граница Keltner.
- `kcLower` — нижняя граница Keltner.
- `invalidationLevel` — текущий invalidation-уровень.

### Линии в figures

- все серии из `AMR_LINE_PLOTS` добавляются в `figures.lines`
- это позволяет выбирать, какие Pine-линии отображать в UI и в бэктест-чартах

## Payload сигнала

`figures`:

- линии по `AMR_LINE_PLOTS`
- точка входа

`additionalIndicators.amr`:

- `entryLong`, `entryShort`, `activeBuy`, `activeSell`, `invalidated`
- `signalOsc`
- значения KC и invalidation-уровня
- `lineValues` по выбранным plot

## Пример runtime-конфига

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "AMR_LOOKBACK_BARS": 200,
  "AMR_MOMENTUM_PERIOD": 32,
  "AMR_BUTTERWORTH_SMOOTHING": 4,
  "AMR_WAIT_CLOSE": true,
  "AMR_CONFIRM_ON_NEXT_BAR": true,
  "AMR_MIN_SIGNAL_OSC_ABS_LONG": 1.75,
  "AMR_MIN_SIGNAL_OSC_ABS_SHORT": 1.25,
  "AMR_KC_LENGTH": 20,
  "AMR_KC_MA_TYPE": "EMA",
  "AMR_ATR_LENGTH": 14,
  "AMR_ATR_MULTIPLIER": 2,
  "AMR_STOP_BUFFER_PCT": 0.05,
  "AMR_TARGET_R_MULT": 2.4,
  "AMR_EXIT_ON_INVALIDATION": true,
  "AMR_LINE_PLOTS": ["kcMidline", "kcUpper", "kcLower", "invalidationLevel"],
  "LONG": { "enable": true, "direction": "LONG", "minRiskRatio": 1 },
  "SHORT": { "enable": true, "direction": "SHORT", "minRiskRatio": 1 }
}
```

## Запуск

```bash
npx @tradejs/cli backtest --user root --config AdaptiveMomentumRibbon:amr-default --connector bybit --timeframe 15
npx @tradejs/cli signals --user root --timeframe 15
```
