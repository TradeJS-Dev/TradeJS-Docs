---
title: 'MarketFlushReversal'
---

`MarketFlushReversal` ищет широкую рыночную ликвидацию или давление и
последующую свечу направленного отбоя. Решение использует только закрытую свечу
и рыночный контекст, доступный на тот момент.

## Визуальная схема

![Логика MarketFlushReversal](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/strategy-logic.svg)

![Пример сигнала MarketFlushReversal](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/signal-example.svg)

Иллюстрации показывают общую логику и не являются рыночными данными.
Точные пороги, подтверждения и параметры риска задаются конфигурацией стратегии.

## Логика

1. Требует актуальный shared market context.
2. Определяет long/short flush по liquidation/imbalance и candle-reversal evidence.
3. Применяет side-specific range, turnover, body и confirmation filters.
4. Входит сразу или хранит bounded pending setup по `MFR_ENTRY_MODE`.
5. Строит ATR/percent stop, R-multiple target и sizing от `MAX_LOSS_VALUE`.

Entry codes: `MFR_LONG_FLUSH_REVERSAL`, `MFR_SHORT_FLUSH_REVERSAL`.
`MFR_EXIT_ON_OPPOSITE_SIGNAL` включает `MFR_OPPOSITE_FLUSH_EXIT`.

Ключевые группы: evidence (`MFR_MIN_VOLUME_REL20`,
`MFR_MIN_MARKET_LIQ_SPIKE_RATIO`), rejection (`MFR_MIN_REJECTION_*`),
confirmation (`MFR_ENTRY_MODE`, `MFR_CONFIRMATION_BARS*`,
`MFR_PENDING_MAX_BARS`), deterministic gate
(`MFR_REQUIRE_CALIBRATED_LONG_REBOUND_POCKET`,
`MFR_ENABLE_PROTECTED_V1_H1_RANGE50_SHORT_POCKET`) и risk (`MFR_STOP_*`,
`MFR_TARGET_R_MULT`). Суффиксы `_LONG`/`_SHORT` переопределяют общее значение
для направления.

При deterministic `AI_MODE: "gate"` LONG и SHORT сигналы должны попасть в
проверенные causal context pockets. Protected SHORT flag добавляет более узкий
путь одобрения с требованиями к breadth, rejection wick, derivatives и позиции
в 1h range. Отсутствующие обязательные features дают отказ.
