---
sidebar_label: Параметры и значения
title: Подготовка параметров и чтение значений Pine
description: 'Подключите функции Pine, преобразуйте конфигурацию стратегии во входные параметры и прочитайте последние значения.'
---

Начните `core.ts` с импортов, имён значений, преобразования параметров и функции
чтения результата, которые понадобятся стратегии.

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

**Назад:** [обзор связи с Pine](./pine-strategy-runtime-bridge). **Далее:** [запустите Pine и верните решение стратегии](./pine-strategy-runtime-decisions).
