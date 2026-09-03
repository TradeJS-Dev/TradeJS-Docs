---
title: 'HyperliquidConsensus'
---

`HyperliquidConsensus` определяет направление по согласованному потоку позиций
выбранных счетов Hyperliquid. При недостаточном, неполном или устаревшем
контексте крупных позиций вход пропускается.

## Визуальная схема

![Логика HyperliquidConsensus](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HyperliquidConsensus/main/docs/strategy-logic.svg)

![Пример сигнала HyperliquidConsensus](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-HyperliquidConsensus/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Читает signal-time whale context из `baseContext`.
2. Проверяет unique whales, coverage, position-aware coverage и entry notional.
3. Определяет long/short consensus по доле entry notional.
4. Применяет cooldown и side policy.
5. Строит ATR stop, R-multiple target и risk-sized order.

Entry codes: `HLC_LONG_CONSENSUS`, `HLC_SHORT_CONSENSUS`. Optional exits
реагируют на opposite consensus или material position reduction.

Основные настройки: `HLC_MIN_UNIQUE_WHALES`, `HLC_MIN_COVERAGE_PCT`,
`HLC_MIN_POSITION_AWARE_PCT`, notional/share thresholds,
`HLC_MAX_CONTEXT_AGE_MS`, `HLC_ENTRY_COOLDOWN_MS` и `HLC_STOP_*`/
`HLC_TARGET_R_MULT`.

Default interval — пять минут. Запустите ingest/backfill из статьи
[Derivatives and spread ingest](../../operations/derivatives-ingest) и проверьте
Timescale coverage.

## Ключи конфигурации

Ключи сгруппированы по смыслу. Общие настройки среды, AI, ML, индикаторов и
размера позиции работают так же, как в других встроенных стратегиях.

| Группа | Ключи | Назначение |
| --- | --- | --- |
| Комиссия | `FEE_PERCENT` | Учитывает заданную торговую комиссию при расчёте позиции и отношения доходности к риску. |
| Среда и сервисы решений | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Задают режим работы, интервал свечей, размещение ордеров и необязательные решения AI или ML. |
| Общие индикаторы и уровни | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Задают периоды общего рыночного контекста и локальных уровней. |
| Полнота данных | `HLC_MIN_UNIQUE_WHALES`, `HLC_MIN_COVERAGE_PCT`, `HLC_MIN_POSITION_AWARE_PCT`, `HLC_MAX_CONTEXT_AGE_MS` | Требуют достаточно актуальных счетов и полных данных об их позициях. |
| Согласованный поток | `HLC_MIN_TOTAL_ENTRY_NOTIONAL_USD`, `HLC_MIN_NET_ENTRY_NOTIONAL_USD`, `HLC_LONG_MIN_ENTRY_SHARE`, `HLC_SHORT_MAX_ENTRY_SHARE` | Задают минимальный размер потока и доли согласия для long и short. |
| Вход и риск | `HLC_ENTRY_COOLDOWN_MS`, `HLC_STOP_ATR_MULT`, `HLC_STOP_BUFFER_PCT`, `HLC_TARGET_R_MULT`, `MAX_LOSS_VALUE` | Ограничивают повторные входы и задают стоп, цель и лимит убытка позиции. |
| Подтверждение выхода | `HLC_EXIT_ON_OPPOSITE_CONSENSUS`, `HLC_EXIT_ON_POSITION_REDUCTION`, `HLC_EXIT_MIN_UNIQUE_WHALES`, `HLC_EXIT_MIN_NOTIONAL_USD`, `HLC_EXIT_MIN_DIRECTION_SHARE` | Включают выходы и требуют достаточно счетов, объёма и направленной доли для подтверждения. |
| Направления | `LONG.enable`, `LONG.direction`, `LONG.minRiskRatio`, `SHORT.enable`, `SHORT.direction`, `SHORT.minRiskRatio` | Включают направления и задают минимальное отношение доходности к риску. |
