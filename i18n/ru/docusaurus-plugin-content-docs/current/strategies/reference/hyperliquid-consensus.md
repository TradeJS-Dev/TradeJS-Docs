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
