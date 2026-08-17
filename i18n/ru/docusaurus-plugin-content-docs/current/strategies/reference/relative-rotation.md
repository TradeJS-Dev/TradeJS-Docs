---
title: 'RelativeRotation'
---

`RelativeRotation` торгует ротацию символа относительно BTC. Он оценивает
24-hour alpha и ratio return, one-hour relative strength, ratio trend,
participation, correlation и optional BTC/alt regime alignment.

## Логика

1. Требует полный текущий `baseContext`.
2. Определяет long/short rotation по target-vs-BTC features.
3. Применяет side policy и filters по relative strength, volume, ADX,
   correlation, volatility rank и regime.
4. Строит ATR stop, directional R-multiple target и sizing от `MAX_LOSS_VALUE`.

Entry codes: `RR_LONG_RELATIVE_ROTATION`, `RR_SHORT_RELATIVE_ROTATION`.
`RR_EXIT_ON_OPPOSITE_ROTATION` включает `RR_OPPOSITE_ROTATION_EXIT`.

Ключевые настройки: `RR_MIN_ALPHA_24H`, `RR_MIN_RATIO_RETURN_24H`,
`RR_MIN_RELATIVE_STRENGTH_1H*`, `RR_REQUIRE_RATIO_TREND`,
`RR_MIN_TARGET_BTC_CORRELATION*`, `RR_MAX_ATR_PCT_RANK100*` и
`RR_STOP_*`/`RR_TARGET_R_MULT*`. BTC reference разрешается не позже
оцениваемой свечи.

