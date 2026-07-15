---
title: Pine indicator plugins
---

TradeJS пока не поддерживает создание или регистрацию самостоятельных indicator plugins на Pine Script.

Поддержка Pine ограничена [Pine-backed стратегиями](../strategies/authoring/pine-strategy-step-by-step). Pine-стратегия может использовать `plot(...)` внутри своего исходника, чтобы TypeScript runtime bridge прочитал значения для сигналов и figures этой стратегии, но такие plots не являются переиспользуемыми indicator plugins TradeJS.

Для создания пользовательского индикатора используйте [TypeScript indicator plugin](./authoring).
