---
title: Data Sync
---

TradeJS downloads candles as needed for a backtest. Use **Data coverage**
to check for missing data and fill small gaps.

## Check and fill gaps in the app

Open **Data coverage** as the project owner. Select a year, expand a month
and a UTC day, then find the affected series. **Refresh** checks the selected
year again.

Queue the gap for the affected series and UTC day. In **Backfill queue** you
can see whether the job completed, how many values it added, and which gaps
remain. You can also [check coverage through MCP](../guides/mcp#data-coverage).

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

`continuity` can delete and reload candles for the provider, instrument, and
interval if it finds a gap. Use the app for a small repair. If you need to
reload the affected series, start with one instrument and one provider.

```bash
npm exec -- tradejs continuity --user root --timeframe 15 \
  --provider binance --tickers BTCUSDT
```
