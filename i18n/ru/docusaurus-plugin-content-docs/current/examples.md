---
title: Примеры
---

Здесь показано, как устроен код стратегии. Если хотите проверить готовую
стратегию, откройте [каталог](./strategies/reference).

## 1. Simple Moving Average

Стратегия сравнивает быструю и медленную скользящие средние и ищет вход при их пересечении.

См. [MaStrategy](./strategies/reference/ma-strategy).

## 2. Breakout

`Breakout` начисляет баллы за выполненные условия. Для входа нужны обязательные сигналы и достаточная сумма баллов.

См. [Breakout](./strategies/reference/breakout).

## 3. Trendline / channel

TradeJS содержит `TrendLine`, `ReverseTrendLine` и `AdaptiveTrendChannel`.

Общая идея:

1. построить line/channel по прошлым свечам;
2. ждать breakout/rejection/flip;
3. сохранить figures для проверки на графике;
4. считать qty от stop distance и max loss.

См. [TrendLine](./strategies/reference/trendline) и [AdaptiveTrendChannel](./strategies/reference/adaptive-trend-channel).

Полный package-only сценарий через `create-tradejs`: [Первый бэктест](./getting-started/first-backtest). Команда создаёт npm-проект, запускает локальную инфраструктуру, сохраняет `MaStrategy:base` и открывает Backtest UI.
