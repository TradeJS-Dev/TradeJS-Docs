---
title: Data Sync
---

TradeJS downloads candles when you run a regular backtest. To fetch history
before testing, use the command below.

## Check and fill gaps in the app

The **Data coverage** and **Backfill queue** screens require a release that
includes data coverage. The stable `3.1.28` app does not have these screens.

On a compatible server, the project owner can select a dataset, series and UTC
day, queue the missing data, and check the result. If the server supports MCP,
[ask your agent to check coverage](../guides/mcp#data-coverage).

<span id="choose-exchange-for-update"></span>

<span id="3-which-command-to-use"></span>

## Refresh a range from the command line {#1-npx-tradejscli-backtest---updateonly}

From the project folder, with the local services running, use an existing
backtest configuration. The following command updates Binance candles for
BTCUSDT using the settings created for the first backtest.

```bash
npm run backtest -- --updateOnly --user root --config MaStrategy:base \
  --connector binance --tickers BTCUSDT --timeframe 15
```

<span id="choose-exchange-for-continuity"></span>

<span id="4-operational-notes"></span>

## Reload candles when the history has gaps {#2-npx-tradejscli-continuity}

When it detects a gap, `continuity` can delete saved candles for the affected
series and reload its history. Use it when you intend to reload local data.
This command is scoped to the 15-minute BTCUSDT series on Binance.

```bash
npm exec -- tradejs continuity --user root --timeframe 15 \
  --provider binance --tickers BTCUSDT
```
