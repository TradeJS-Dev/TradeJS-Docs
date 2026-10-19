---
title: TradingPatterns
---

`@tradejs/strategy-trading-patterns` combines Diamond, Flag, Gartley and
HeadAndShoulders into one strategy. It is installed separately from
`@tradejs/base`.

## Installation and interval

Install the composition and its child packages in your Project:

```bash
npm install @tradejs/strategy-trading-patterns@0.1.1 @tradejs/strategy-diamond @tradejs/strategy-flag @tradejs/strategy-gartley @tradejs/strategy-head-and-shoulders
```

Append `"@tradejs/strategy-trading-patterns"` to the Project's `strategies`
list, preserving its existing preset, connectors and indicators. The published
`0.1.1` supports `INTERVAL: "60"` only. The source repository also accepts
`"15"`, but that change requires a later published version. Pattern durations
are measured in candles, so changing interval changes their duration in time.

## Decisions and exits

Every enabled child detector processes every candle. If several emit a signal,
`TRADING_PATTERNS_PRIORITY` selects at most one decision. The default order is
Diamond, Flag, Gartley, HeadAndShoulders. The child that opened the position
owns any early pattern exit; the shared runtime executes stops and targets.
Figures, risk plans and pattern context come from the child package.

## Configuration keys

| Group | Keys | Purpose |
| --- | --- | --- |
| Interval | `INTERVAL` | Select the supported candle interval; default `60`. |
| Selection | `TRADING_PATTERNS_PRIORITY` | Order all four known names without duplicates or omissions. |
| Child policy | `TRADING_PATTERNS.<name>.enable`, `TRADING_PATTERNS.<name>.LONG.*`, `TRADING_PATTERNS.<name>.SHORT.*` | Enable children and set each direction's switch and minimum risk ratio. At least one child must remain enabled. |
| Common side policy | `LONG.*`, `SHORT.*` | Apply master direction switches and optional common minimum risk ratios. The default floor `0` preserves each child's threshold. |
| Child geometry | `DIAMOND_*`, `FLAG_*`, `GARTLEY_*`, `HEADSHOULDERS_*` | Keep the original fields accepted by each installed child package. |
| AI | `AI_ENABLED`, `AI_MODE`, `MIN_AI_QUALITY` | Control the optional shared AI approval path and local composition gate. |

All four children are enabled by default, but their own directional defaults
remain effective. For example, the HeadAndShoulders inverse direction is
experimental and disabled by its default config. Removed pattern names,
including Bat, are rejected by the parser. Remove obsolete toggle, priority
and geometry fields when migrating an earlier composition.

Evaluate the composition as one strategy. Results of individually tested
children cannot be added together because priority and position occupancy
change which entries execute.
