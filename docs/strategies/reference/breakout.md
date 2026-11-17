---
title: 'Breakout'
---

Breakout checks several conditions for a price breakout and gives each condition
a score. A trade needs all required conditions and a high enough total score.

Included in a standard TradeJS project.
[Save settings for a backtest](../../getting-started/backtest-config).

## Visual overview

![Breakout strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Breakout/main/docs/strategy-logic.svg)

![Breakout signal on an illustrative chart](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-Breakout/main/docs/signal-example.svg)

The diagrams show an example signal and use illustrative prices.

## Entry Logic

On each bar, strategy computes boolean signals and opens a position only if:

- required signals (`required: true`) are satisfied
- total score is >= `REQUIRED_SCORE_*`

Long and short use separate signal maps (`SIGNALS_LONG`, `SIGNALS_SHORT`).

## Exits

With an open position, strategy closes when:

- opposite open signal appears (`CLOSE_POSITION_BY_OPEN_SIGNAL`)
- MA trend flips against position (`CLOSE_POSITION_BY_SMA`)

Otherwise returns `POSITION_HELD`.

## Configuration keys

| Group | Keys | Purpose |
| --- | --- | --- |
| Runtime and decision services | `ENV`, `INTERVAL`, `MAKE_ORDERS`, `CLOSE_OPPOSITE_POSITIONS`, `BACKTEST_PRICE_MODE`, `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY`, `ML_ENABLED`, `ML_THRESHOLD` | Select the runtime mode and candle interval, control order placement, and enable optional AI or ML decisions. |
| Shared indicators and levels | `MA_FAST`, `MA_MEDIUM`, `MA_SLOW`, `OBV_SMA`, `ATR`, `ATR_PCT_SHORT`, `ATR_PCT_LONG`, `BB`, `BB_STD`, `MACD_FAST`, `MACD_SLOW`, `MACD_SIGNAL`, `LEVEL_LOOKBACK`, `LEVEL_DELAY` | Set the periods used for shared indicators and local support and resistance levels. |
| Weighted score | `SIGNALS_LONG`, `SIGNALS_SHORT`, `REQUIRED_SCORE_LONG`, `REQUIRED_SCORE_SHORT`, `ATR_OPEN` | Define the weighted conditions for each direction, the required score, and the volatility threshold used by the `VOLATILE` condition. |
| Entry engine | `BREAKOUT_USE_ENGINE`, `BREAKOUT_ENGINE_LOOKBACK`, `BREAKOUT_ENGINE_DELAY`, `BREAKOUT_TREND_LOOKBACK`, `BREAKOUT_ENTRY_MODE`, `BREAKOUT_CONFIRMATION_BARS`, `BREAKOUT_RETEST_MAX_BARS`, `BREAKOUT_RETEST_TOLERANCE_ATR`, `BREAKOUT_RETEST_TOLERANCE_ATR_LONG`, `BREAKOUT_RETEST_TOLERANCE_ATR_SHORT` | Enable the replayable detector and configure its history, level delay, trend window, and breakout, confirmation, or retest entry. |
| Direction and breakout quality | `BREAKOUT_LONG_ENABLED`, `BREAKOUT_SHORT_ENABLED`, `BREAKOUT_REQUIRE_FRESH_LEVEL_CROSS`, `BREAKOUT_REQUIRE_DIRECTIONAL_BODY`, `BREAKOUT_MIN_BODY_ATR`, `BREAKOUT_MIN_VOLUME_REL20`, `BREAKOUT_MIN_ACCEPTANCE_CLOSES` | Enable each direction and require a fresh cross, directional candle, body size, volume, or accepted closes. |
| Distance, range, and cooldown | `BREAKOUT_MAX_DISTANCE_ATR`, `BREAKOUT_MAX_DISTANCE_ATR_LONG`, `BREAKOUT_MAX_DISTANCE_ATR_SHORT`, `BREAKOUT_MIN_TREND_MOVE_ATR`, `BREAKOUT_MIN_RANGE_ATR`, `BREAKOUT_MIN_RANGE_ATR_LONG`, `BREAKOUT_MIN_RANGE_ATR_SHORT`, `BREAKOUT_MAX_RANGE_ATR`, `BREAKOUT_MAX_RANGE_ATR_LONG`, `BREAKOUT_MAX_RANGE_ATR_SHORT`, `BREAKOUT_COOLDOWN_HOURS` | Limit breakout distance, trend movement, source-range size, and repeated entries, with directional overrides. |
| Position and exits | `LIMIT`, `TP_LONG`, `TP_SHORT`, `SL_LONG`, `SL_SHORT` | Set quote-currency position size and the directional take-profit ladders and stop ratios. |

## Indicators Used (What Each One Means)

### Used in Signal Logic

- `maFast`, `maSlow` — trend direction checks.
- `obv`, `smaObv` — OBV vs OBV-SMA checks.
- `atr` — volatility threshold calculation.
- `bbUpper`, `bbLower` — Bollinger breakout checks.
- `highLevel`, `lowLevel` — local breakout/breakdown levels.
- `prevCandle` — previous candle for high/low/close comparisons.

### Used in Payload

- `correlation` — included in `indicators` for analysis/ML.

## Signal Payload

`additionalIndicators`:

- `highLevel`, `lowLevel`
- `signals` (all boolean checks)

## Example Runtime Config

```json
{
  "ENV": "CRON",
  "INTERVAL": "15",
  "LIMIT": 100,
  "ATR_OPEN": 0.5,
  "REQUIRED_SCORE_LONG": 7,
  "REQUIRED_SCORE_SHORT": 7,
  "TP_LONG": [
    { "profit": 0.1, "rate": 0.25 },
    { "profit": 0.15, "rate": 0.5 }
  ],
  "TP_SHORT": [
    { "profit": 0.05, "rate": 0.25 },
    { "profit": 0.1, "rate": 0.5 }
  ],
  "SL_LONG": 0.06,
  "SL_SHORT": 0.03
}
```

<span id="run"></span>

## Run {#backtest}

Run these commands from the standard project folder with Docker running.
The first command saves `Breakout:example` in the project's local Redis.
It sets the candle interval and uses the strategy defaults for the other fields.
The second command tests 30 days of 15-minute Binance BTCUSDT candles.

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli SET \
  'users:root:backtests:configs:Breakout:example' '{"INTERVAL":["15"]}' NX

npm run backtest -- --user root --connector binance --tickers BTCUSDT \
  --config Breakout:example --timeframe 15 --days 30 --tests 1 --parallel 1
```

If the first command returns an empty response, a configuration with that
name already exists. Replace `example` in both commands to start with a new one.
