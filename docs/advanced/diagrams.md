---
title: Diagrams
---

These diagrams show how the main TradeJS pieces fit together.

## Package Map

```text
                  +--------------------+
                  |   tradejs.config   |
                  | defineConfig(...)  |
                  +---------+----------+
                            |
                            v
+--------------+    +----------------+    +------------------+
| @tradejs/app |    | @tradejs/base  |    | custom plugins   |
| Next.js UI   |    | default preset |    | strategy/etc.    |
+------+-------+    +-------+--------+    +--------+---------+
       |                    |                      |
       v                    v                      v
+-------------------------------------------------------------+
|                      plugin registries                      |
|        strategies          indicators        connectors     |
+--------------+------------------+------------------+-------+
               |                  |                  |
               v                  v                  v
       +--------------+   +--------------+   +----------------+
       | @tradejs/core|   | @tradejs/node|   | @tradejs/infra |
       | pure helpers |   | runtime      |   | Redis/SQL/ML   |
       +------+-------+   +------+-------+   +--------+-------+
              |                  |                    |
              +--------------+---+--------------------+
                             v
                      +--------------+
                      | @tradejs/cli |
                      | operations   |
                      +--------------+
```

## Strategy Decision Lifecycle

```text
closed candle
     |
     v
indicator/history snapshot
     |
     v
strategy core
     |
     +-- skip(reason) ---------------+
     |                               v
     +-- exit(code, direction) -- runtime hooks/storage
     |
     v
entry(direction, orderPlan, figures, indicators)
     |
     v
signal enrichment
     |
     +-- ML gate (optional)
     +-- AI gate (optional)
     +-- project/strategy hooks
     |
     v
policy allows order?
     |
     +-- no  -> store evaluation / skip execution
     |
     v
connector order placement
     |
     v
position/order artifacts + notifications
```

## Backtest, Signals, Replay

```text
                  shared strategy runtime
                            |
      +---------------------+---------------------+
      |                     |                     |
      v                     v                     v
  backtest               signals                replay
 historical candles      last closed candle      historical window
 grid config             runtime config          runtime/results target
 simulated fills         optional order path      parity comparison
      |                     |                     |
      v                     v                     v
 test stats              signal/evaluation       matched/unmatched
 order logs              runtime journal         diagnostics
 AI/ML datasets          Telegram optional       slippage/timing details
```

## Data And Context Alignment

```text
symbol candles ---------+
BTC reference ----------+
spread context ---------+
CMC/global context -----+-- align at or before candle timestamp -- strategy
derivatives context ----+
onchain context --------+
```

Never align context to a row after the decision candle.

Related:

- [Architecture](./architecture)
- [Runtime](./runtime)
- [Data quality guide](../guides/data-quality)
