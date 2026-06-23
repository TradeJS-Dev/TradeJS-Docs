---
title: Examples
---

These examples show strategy ideas and TradeJS wiring patterns. They are starting points for research, not trading recommendations.

## 1. Simple Moving Average Strategy

Use this when you want the smallest understandable TypeScript strategy idea: compare a fast and slow moving average and enter on a crossover.

```ts
const crossedUp = fastPrev <= slowPrev && fastCurrent > slowCurrent;
const crossedDown = fastPrev >= slowPrev && fastCurrent < slowCurrent;

if (crossedUp) {
  return strategyApi.entry({
    direction: 'LONG',
    orderPlan: {
      qty,
      stopLossPrice,
      takeProfits: [{ rate: 1, price: takeProfitPrice }],
    },
  });
}

if (crossedDown) {
  return strategyApi.entry({
    direction: 'SHORT',
    orderPlan: {
      qty,
      stopLossPrice,
      takeProfits: [{ rate: 1, price: takeProfitPrice }],
    },
  });
}

return strategyApi.skip('NO_MA_CROSS');
```

Related pages:

- [Create a simple strategy](./guides/create-simple-strategy)
- [MaStrategy reference](./strategies/reference/ma-strategy)

## 2. Breakout Strategy

The built-in `Breakout` strategy uses a weighted signal model. A long setup can require price and indicator conditions such as trend, OBV, volatility, and level breakout.

Conceptual config shape:

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

Related pages:

- [Breakout reference](./strategies/reference/breakout)
- [Backtest a strategy](./guides/backtest-strategy)

## 3. Trendline / Channel-Based Strategy

TradeJS has multiple geometry-based strategies, including `TrendLine`, `ReverseTrendLine`, and `AdaptiveTrendChannel`.

The common idea is:

1. Build a support/resistance line or adaptive channel from prior candles.
2. Wait for a breakout, rejection, or channel flip.
3. Attach figures so the chart explains the decision.
4. Size the trade from stop distance and configured max loss.

Conceptual decision shape:

```ts
return strategyApi.entry({
  code: 'TRENDLINE_BREAKOUT',
  direction: modeConfig.direction,
  figures: buildTrendLineFigures({ line, entryPrice, stopLossPrice }),
  additionalIndicators: {
    trendLine: line,
    touches: line.touches.length,
    distance: line.distance,
  },
  orderPlan: {
    qty,
    stopLossPrice,
    takeProfits: [{ rate: 1, price: takeProfitPrice }],
  },
});
```

Related pages:

- [TrendLine reference](./strategies/reference/trendline)
- [AdaptiveTrendChannel reference](./strategies/reference/adaptive-trend-channel)
- [Backtesting caveats](./limitations/backtesting-caveats)

## Deterministic Sandbox

For a complete runnable example, use [Run your first backtest](./getting-started/first-backtest). It points to the standalone sandbox app that seeds a deterministic strategy, connector, backtest config, and assertions.
