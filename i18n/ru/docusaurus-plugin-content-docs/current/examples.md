---
title: Примеры
---

Эти примеры показывают идеи и wiring patterns. Это стартовые точки для research, а не торговые рекомендации.

## 1. Simple Moving Average

Идея: сравнить fast/slow MA и входить на crossover.

```ts
const crossedUp = fastPrev <= slowPrev && fastCurrent > slowCurrent;
const crossedDown = fastPrev >= slowPrev && fastCurrent < slowCurrent;

if (crossedUp) {
  return strategyApi.entry({
    direction: 'LONG',
    orderPlan: { qty, stopLossPrice, takeProfits: [{ rate: 1, price: takeProfitPrice }] },
  });
}

if (crossedDown) {
  return strategyApi.entry({
    direction: 'SHORT',
    orderPlan: { qty, stopLossPrice, takeProfits: [{ rate: 1, price: takeProfitPrice }] },
  });
}

return strategyApi.skip('NO_MA_CROSS');
```

См. [MaStrategy](./strategies/reference/ma-strategy).

## 2. Breakout

`Breakout` использует weighted signal model:

```ts
export default {
  INTERVAL: '15',
  SIGNALS_LONG: {
    SMA_UPTREND: { weight: 1, required: true },
    OBV_ABOVE_SMA: { weight: 1 },
    CLOSE_ABOVE_HIGH_LEVEL: { weight: 2, required: true },
  },
  REQUIRED_SCORE_LONG: 3,
};
```

См. [Breakout](./strategies/reference/breakout).

## 3. Trendline / channel

TradeJS содержит `TrendLine`, `ReverseTrendLine` и `AdaptiveTrendChannel`.

Общая идея:

1. построить line/channel по прошлым свечам;
2. ждать breakout/rejection/flip;
3. сохранить figures для проверки на графике;
4. считать qty от stop distance и max loss.

См. [TrendLine](./strategies/reference/trendline) и [AdaptiveTrendChannel](./strategies/reference/adaptive-trend-channel).

Полный package-only сценарий через `npx create-tradejs`: [Первый бэктест](./getting-started/first-backtest). Команда создаёт npm-проект, запускает локальную инфраструктуру, сохраняет `MaStrategy:base` и открывает Backtest UI.
