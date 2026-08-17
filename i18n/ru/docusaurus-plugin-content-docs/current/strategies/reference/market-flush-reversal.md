---
title: 'MarketFlushReversal'
---

`MarketFlushReversal` ищет широкий market liquidation/pressure flush и
последующую directional candle rejection. Стратегия использует закрытую свечу
и `baseContext`, не запрашивая будущие или connector-backed данные из core.

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
`MFR_PENDING_MAX_BARS`) и risk (`MFR_STOP_*`, `MFR_TARGET_R_MULT`). Суффиксы
`_LONG`/`_SHORT` переопределяют общее значение для направления.

