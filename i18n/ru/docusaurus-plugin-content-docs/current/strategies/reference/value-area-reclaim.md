---
title: 'ValueAreaReclaim'
---

import StrategySignalChart from "@site/src/components/StrategySignalChart";

ValueAreaReclaim ищет возврат в область основного объёма торгов после ложного пробоя.

Пакет устанавливается отдельно. [Как подключить пакет и сохранить стандартные стратегии](../../getting-started/add-strategy).

## Визуальная схема

<StrategySignalChart strategy="value-area-reclaim" />

## Установка

Для этого примера нужен TradeJS `3.1.29-beta.302` или более новый совместимый выпуск.

Выполните команду в каталоге проекта TradeJS.

```bash
npm install --save-exact @tradejs/strategy-value-area-reclaim
```

Добавьте `"@tradejs/strategy-value-area-reclaim"` в список `strategies` в
`tradejs.config.ts`. Пакет зарегистрирует стратегию `ValueAreaReclaim`.

## Сигнал и выход

Стратегия ждёт выхода цены за границу области объёма и закрытия снова
внутри. Стоп ставится за крайней точкой выхода с отступом в четверть ATR.

Стратегия строит профиль объёма по закрытым 15-минутным свечам.
Параметр `VAR_PROFILE_DAYS` по умолчанию задаёт три полных дня UTC. Цель
стоит на ценовом уровне с наибольшим объёмом в профиле. При исполнении
на часовом интервале TradeJS получает ту же 15-минутную историю через
`StrategyAPI.getClosedCandles`. Если в исходном окне есть пропуски,
новые входы блокируются до следующего дня UTC.

У пакетов `@tradejs/core`, `@tradejs/types` и `@tradejs/node` должна быть одна версия.

Подробности настройки есть в [README пакета](https://github.com/TradeJS-Dev/TradeJS-Strategy-ValueAreaReclaim#readme).
