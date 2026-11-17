---
title: 'Triangle'
---

Triangle looks for price breaks from ascending, descending, and symmetric triangles.

## Install

Run the command in your TradeJS project.

```bash
npm install --save-exact @tradejs/strategy-triangle
```

Add `"@tradejs/strategy-triangle"` to the `strategies` list in
`tradejs.config.ts`. The package registers the `Triangle` strategy.

## Signal and exit

The default interval is 15 minutes. The strategy requires repeated touches
of converging boundaries before it considers a break. Both breakout directions
are enabled by default. Set `TRIANGLE_ALLOW_REVERSE_BREAKOUTS` to `false` to
allow only upward breaks for ascending triangles and downward breaks for
descending triangles. Symmetric triangles still use the actual breakout direction.

See the [package README](https://github.com/TradeJS-Dev/TradeJS-Strategy-Triangle#readme) for the full setup.
