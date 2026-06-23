---
title: 'LiquidityTails'
---

`LiquidityTails` is a built-in TypeScript strategy from `@tradejs/strategies`.

It researches wick/tail-style liquidity reactions and uses strategy-specific AI guardrails.

## Use It For Researching

- rejection tails
- volatility pockets
- liquidity sweep behavior
- derivatives-aware filters

## Notes

Recent source changes tuned its AI cadence and derivatives reversal filters. Treat those gates as research controls and validate them against your own data window.

Related:

- [AI/ML workflows](../../guides/ai-ml-workflows)
- [Backtesting caveats](../../limitations/backtesting-caveats)
