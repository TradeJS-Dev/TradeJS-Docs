---
sidebar_label: Inputs and Plot Readers
title: Prepare Pine Runtime Inputs and Plot Readers
description: 'Import the Pine runtime helpers, map strategy configuration to Pine inputs, and read the latest plot values.'
---

Start `core.ts` with the imports, plot names, input mapping, and snapshot reader
used by the strategy decision function.

```ts
import {
  getLatestPineBooleanPlotValues,
  getLatestPineNumberPlotValues,
  runPineScript,
  type PineContextLike,
} from '@tradejs/node/pine';
import { asPositiveInt, asPositiveNumber } from '@tradejs/core/math';
import { logger } from '@tradejs/infra/logger';
import type { AdaptiveMomentumRibbonConfig } from './config';
import { buildAdaptiveMomentumRibbonFigures } from './figures';
import { type CreateStrategyCore } from '@tradejs/types';

const AMR_PINE_FILE_NAME = 'adaptiveMomentumRibbon.pine';
const AMR_BOOLEAN_PLOTS = [
  'entryLong',
  'entryShort',
  'invalidated',
  'activeBuy',
  'activeSell',
] as const;
const AMR_NUMBER_PLOTS = [
  'signalOsc',
  'kcMidline',
  'kcUpper',
  'kcLower',
  'invalidationLevel',
] as const;

const asKcMaType = (
  value: unknown,
): AdaptiveMomentumRibbonConfig['AMR_KC_MA_TYPE'] => {
  if (
    value === 'SMA' ||
    value === 'EMA' ||
    value === 'SMMA (RMA)' ||
    value === 'WMA' ||
    value === 'VWMA'
  ) {
    return value;
  }

  return 'EMA';
};

const resolveAmrInputs = (
  config: AdaptiveMomentumRibbonConfig,
): Record<string, unknown> => ({
  'Momentum Period': asPositiveInt(config.AMR_MOMENTUM_PERIOD, 20),
  'Butterworth Smoothing': asPositiveInt(config.AMR_BUTTERWORTH_SMOOTHING, 3),
  'Confirm Signals on Bar Close': Boolean(config.AMR_WAIT_CLOSE),
  'Show Invalidation Levels': Boolean(config.AMR_SHOW_INVALIDATION_LEVELS),
  'Show Keltner Channel': Boolean(config.AMR_SHOW_KELTNER_CHANNEL),
  'KC Length': asPositiveInt(config.AMR_KC_LENGTH, 20),
  'KC MA Type': asKcMaType(config.AMR_KC_MA_TYPE),
  'ATR Length': asPositiveInt(config.AMR_ATR_LENGTH, 14),
  'ATR Multiplier': asPositiveNumber(config.AMR_ATR_MULTIPLIER, 2),
});

const resolveLinePlots = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0);
};

const readAmrSnapshot = (pineContext: PineContextLike, linePlots: string[]) => {
  return {
    ...getLatestPineBooleanPlotValues(pineContext, AMR_BOOLEAN_PLOTS),
    ...getLatestPineNumberPlotValues(pineContext, AMR_NUMBER_PLOTS),
    lineValues: getLatestPineNumberPlotValues(pineContext, linePlots),
  };
};
```

**Previous:** [Runtime bridge overview](./pine-strategy-runtime-bridge). **Next:** [Run Pine and return strategy decisions](./pine-strategy-runtime-decisions).
