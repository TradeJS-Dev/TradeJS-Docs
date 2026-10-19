---
title: VwapReversion
---

`@tradejs/strategy-vwap-reversion` trades a confirmed return inside UTC-session
VWAP bands on closed candles. It is a separate package outside `@tradejs/base`.
Version `0.1.1` is published; historical research does not establish profitability.

## Entry and exit

Volume weights each candle's typical price `(high + low + close) / 3`.
VWAP and its weighted population variance reset each UTC day. The bands use
`VWAP_BAND_MULT` standard deviations. Candle OHLCV approximates intrabar volume
and does not reproduce a trade-by-trade VWAP.

A LONG setup closes below the lower band, then a later candle closes inside
both bands and below VWAP. SHORT is symmetric. The efficiency ratio must pass
on both setup and confirmation; by default price must also reverse toward
VWAP. A band expanding around an unchanged excursion is not confirmation.

The target is the confirmation candle's VWAP. The stop is beyond the excursion
extreme with a percentage buffer. Both remain fixed after the signal. Runtime
handles stops and targets; the strategy also requests an exit at the holding
limit, UTC-day boundary or an intraday data gap. It does not add to a position.

## Installation

```bash
npm install @tradejs/strategy-vwap-reversion@0.1.1
```

Append `"@tradejs/strategy-vwap-reversion"` to your Project's `strategies`
list, preserving existing connectors, indicators and presets.

## Configuration keys

| Group | Keys | Purpose |
| --- | --- | --- |
| Execution | `INTERVAL`, `BACKTEST_PRICE_MODE`, `BACKTEST_ENTRY_DELAY_BARS` | Accept `15` (default) or `60` minutes. Backtests require `close` and zero delay. |
| Bands | `VWAP_BAND_MULT`, `VWAP_RETURN_BAND_MULT`, `VWAP_MIN_VOLUME_BARS` | Set excursion and return bands and minimum positive-volume candles. Defaults are `2`, `0`, and `8`. |
| Market filter | `VWAP_ER_PERIOD`, `VWAP_MAX_ER` | Set the efficiency-ratio window and maximum; defaults are `8` and `0.2`. |
| Confirmation | `VWAP_MAX_EXCURSION_BARS`, `VWAP_REQUIRE_PRICE_REVERSAL`, `VWAP_MIN_SESSION_BARS_LEFT` | Limit waiting and require price reversal and time before the session ends. Defaults are `8`, `true`, and `1`. |
| Lifecycle | `VWAP_MAX_HOLD_BARS`, `VWAP_COOLDOWN_BARS` | Bound holding and post-close waiting; defaults are `16` and `4` intervals. |
| Risk | `VWAP_STOP_BUFFER_PCT`, `VWAP_MIN_RISK_RATIO`, `VWAP_MAX_COST_SHARE`, `MAX_LOSS_VALUE`, `RISK_FEE_RATE`, `RISK_SLIPPAGE_BPS`, `RISK_MARKET_IMPACT_BPS` | Buffer the stop, require risk/reward after estimated costs, optionally cap cost share, and size within the loss budget. A cost-share cap of `0` disables that cap. |
| Research gate | `VWAP_AI_GATE_ENABLED` | Enable the optional experimental local gate; default `false`. |

## Data and restart behavior

A complete day must include the 00:00 UTC candle. Loading mid-session, missing
candles or invalid OHLCV prevent entries until the next complete day. Zero
volume cancels a pending setup. Only closed, ordered and interval-aligned
candles are accepted. Repeating a timestamp does not advance detector state.

The detector rebuilds by replaying history. An open position also needs its
lifecycle checkpoint: after a restart without one, the strategy requests
`VWAP_UNRESTORED_POSITION` because position age is unknown. A successful
technical replay does not prove economic stability or diversification.
