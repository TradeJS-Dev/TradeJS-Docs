---
title: 'AdaptiveTrendChannel'
---

`AdaptiveTrendChannel` - встроенная TypeScript-стратегия из `@tradejs/strategies`.

Она строит adaptive channel по истории свечей, ищет bullish/bearish flips и может выходить по channel break или opposite flip.

## Entry logic

1. Replays candles through channel engine.
2. Ждет channel flip signal.
3. Применяет side config (`LONG` или `SHORT`).
4. Применяет indicator/context filters.
5. Считает qty от stop distance и `MAX_LOSS_VALUE`.
6. Возвращает entry с channel figures.

Недавние изменения настраивали AI gate этой стратегии с market context filters. Проверяйте свой config на разных periods/symbols.
