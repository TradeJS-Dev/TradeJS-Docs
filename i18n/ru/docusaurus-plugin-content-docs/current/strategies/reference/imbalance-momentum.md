---
title: 'ImbalanceMomentum'
---

import StrategySignalChart from "@site/src/components/StrategySignalChart";

ImbalanceMomentum ищет направленный разрыв между тремя последовательными четырёхчасовыми свечами.

Пакет устанавливается отдельно. [Как подключить пакет и сохранить стандартные стратегии](../../getting-started/add-strategy).

## Визуальная схема

<StrategySignalChart strategy="imbalance-momentum" />

## Установка

Для этого примера нужен TradeJS `3.1.29-beta.302` или более новый совместимый выпуск.

Выполните команду в каталоге проекта TradeJS.

```bash
npm install --save-exact @tradejs/strategy-imbalance-momentum
```

Добавьте `"@tradejs/strategy-imbalance-momentum"` в список `strategies` в
`tradejs.config.ts`. Пакет зарегистрирует стратегию `ImbalanceMomentum`.

## Сигнал и выход

Стратегия собирает четырёхчасовые свечи из закрытых 15-минутных свечей
по границам UTC. Средняя свеча задаёт направление. В режиме
`IMBALANCE_MODE: "gap"` разрыв между первой и третьей свечами должен
охватывать больше половины тела средней свечи. Начальный стоп ставится
в трёх четырёхчасовых ATR от цены исполнения. Фиксированной цели нет.
Стратегия начинает подтягивать стоп, когда цена проходит в нужную сторону
три начальных расстояния до стопа.

Стратегия передаёт пустой список `takeProfits` и рассчитывает стоп от цены
исполнения. У пакетов `@tradejs/core`, `@tradejs/types` и `@tradejs/node`
должна быть одна версия.

Подробности настройки есть в [README пакета](https://github.com/TradeJS-Dev/TradeJS-Strategy-ImbalanceMomentum#readme).
