---
sidebar_label: Pine-стратегия пошагово
title: 'Pine Script-стратегия в TradeJS: создание и бэктест'
description: 'Добавьте Pine Script-стратегию в TradeJS по четырём коротким главам: исходник Pine, figures, runtime-мост, регистрация и бэктест.'
---

Это руководство показывает, как добавить Pine-стратегию в TradeJS как обычный полноправный модуль. Полная реализация `AdaptiveMomentumRibbon` разбита на отдельные главы, поэтому можно загружать и читать только текущий этап работы.

Если нужен TypeScript-only путь, используйте [руководство по TypeScript-стратегии с `StrategyAPI`](./typescript-strategy-step-by-step).

## Порядок реализации

1. [Создайте модуль, Pine-исходник и конфигурацию](./pine-strategy-pine-and-config) — структура папок, `.pine` и типизированный конфиг стратегии.
2. [Постройте figures для входа](./pine-strategy-figures) — преобразование Pine plots в линии и точки TradeJS.
3. [Реализуйте runtime-мост](./pine-strategy-runtime-bridge) — запуск Pine, чтение plots и возврат решений TradeJS.
4. [Зарегистрируйте, протестируйте и проверьте](./pine-strategy-registration-and-backtest) — entrypoint, adapters, manifest, plugin, grid и проверки.

Каждая глава содержит переходы к предыдущему и следующему этапу. Исходный URL руководства остаётся обзорной страницей, поэтому закладки и результаты поиска продолжают вести в полный workflow.
