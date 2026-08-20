---
title: 'VolatilityCompressionBreakout'
---

`VolatilityCompressionBreakout` входит на расширении диапазона после сжатия
волатильности. Стратегия сочетает ранги ATR и ширины полос Боллинджера с пробоем
локального диапазона, поддержки или сопротивления и фильтрами участия.

## Визуальная схема

![Логика VolatilityCompressionBreakout](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolatilityCompressionBreakout/main/docs/strategy-logic.svg)

![Пример сигнала VolatilityCompressionBreakout](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-VolatilityCompressionBreakout/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Требует `baseContext` и находит compression по ATR/BB ranks.
2. Определяет long/short breakout по local range или S/R state.
3. Проверяет expansion, volume, candle body, distance и optional MTF/trade-flow alignment.
4. Ставит stop за структурой с ATR/percent fallback.
5. Использует `VCB_TARGET_R_MULT` и risk sizing от `MAX_LOSS_VALUE`.

Entry codes: `VCB_LONG_COMPRESSION_BREAKOUT`,
`VCB_SHORT_COMPRESSION_BREAKOUT`. `VCB_EXIT_ON_OPPOSITE_BREAKOUT` включает
`VCB_OPPOSITE_BREAKOUT_EXIT`.

Основные настройки: `VCB_MAX_ATR_PCT_RANK`, `VCB_MAX_BB_WIDTH_RANK`,
`VCB_MIN_RANGE_EXPANSION_RANK`, `VCB_MIN_VOLUME_REL20`,
`VCB_MIN_BREAKOUT_DISTANCE_ATR*`, `VCB_REQUIRE_MTF_ALIGNMENT`,
`VCB_REQUIRE_TRADE_FLOW_ALIGNMENT` и `VCB_STOP_*`/`VCB_TARGET_R_MULT`.
