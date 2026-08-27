---
sidebar_label: Решения стратегии
title: Запуск Pine и возврат решения стратегии
description: 'Запустите подготовленный Pine-скрипт, обработайте выход и отмену сигнала, затем верните типизированное решение TradeJS.'
---

Продолжите тот же файл `core.ts` фабрикой стратегии. Она использует функции из
[предыдущего этапа](./pine-strategy-runtime-setup).

```text
export const createAdaptiveMomentumRibbonCore: CreateStrategyCore<
  AdaptiveMomentumRibbonConfig
> = async ({ config, symbol, data, loadPineScriptFile, strategyApi }) => {
  const script = loadPineScriptFile(AMR_PINE_FILE_NAME);
  const { LONG, SHORT, AMR_EXIT_ON_INVALIDATION } = config;
  const linePlots = resolveLinePlots(config.AMR_LINE_PLOTS);
  const lookbackBars = asPositiveInt(config.AMR_LOOKBACK_BARS, 0);
  const pineInputs = resolveAmrInputs(config);
  const timeframe = String(config.INTERVAL ?? '15');

  return async () => {
    if (!script) {
      return strategyApi.skip('AMR_SCRIPT_EMPTY');
    }

    const candleLimit = lookbackBars > 0 ? lookbackBars : 400;
    const candles = data.slice(-candleLimit);
    if (candles.length < 2) {
      return strategyApi.skip('WAIT_DATA');
    }

    const position = await strategyApi.getCurrentPosition();
    const positionExists = Boolean(
      position && typeof position.qty === 'number' && position.qty > 0,
    );

    let pineContext;
    try {
      pineContext = await runPineScript({
        candles,
        script,
        symbol,
        timeframe,
        inputs: pineInputs,
      });
    } catch (error) {
      if (typeof globalThis.setImmediate === 'function') {
        logger.warn(
          'AdaptiveMomentumRibbon pine run failed for %s: %s',
          symbol,
          String(error),
        );
      }
      return strategyApi.skip('AMR_SCRIPT_FAILED');
    }

    const amr = readAmrSnapshot(pineContext, linePlots);

    if (amr.entryLong && amr.entryShort) {
      return strategyApi.skip('AMR_SIGNAL_CONFLICT');
    }

    if (positionExists && position) {
      if (
        (position.direction === 'LONG' && amr.entryShort) ||
        (position.direction === 'SHORT' && amr.entryLong)
      ) {
        return strategyApi.exit({
          code: 'CLOSE_BY_AMR_SIGNAL',
          direction: position.direction,
        });
      }

      if (Boolean(AMR_EXIT_ON_INVALIDATION) && amr.invalidated) {
        return strategyApi.exit({
          code: 'CLOSE_BY_AMR_INVALIDATION',
          direction: position.direction,
        });
      }

      return strategyApi.skip('POSITION_HELD');
    }

    if (!amr.entryLong && !amr.entryShort) {
      return strategyApi.skip('NO_SIGNAL');
    }

    const modeConfig = amr.entryLong ? LONG : SHORT;
    if (!modeConfig.enable) {
      return strategyApi.skip('STRATEGY_DISABLED');
    }

    const { currentPrice, timestamp } =
      await strategyApi.getDecisionPriceContext();
    const { stopLossPrice, takeProfitPrice, qty } =
      strategyApi.getDirectionalTpSlPrices({
        price: currentPrice,
        direction: modeConfig.direction,
        takeProfitDelta: modeConfig.TP,
        stopLossDelta: modeConfig.SL,
        unit: 'percent',
      });

    if (!qty || !Number.isFinite(qty) || qty <= 0) {
      return strategyApi.skip('INVALID_QTY');
    }

    return strategyApi.entry({
      code: amr.entryLong ? 'AMR_ENTRY_LONG' : 'AMR_ENTRY_SHORT',
      direction: modeConfig.direction,
      figures: buildAdaptiveMomentumRibbonFigures({
        pineContext,
        linePlots,
        direction: modeConfig.direction,
        entryTimestamp: timestamp,
        entryPrice: currentPrice,
      }),
      additionalIndicators: {
        amr,
      },
      orderPlan: {
        qty,
        stopLossPrice,
        takeProfits: [{ rate: 1, price: takeProfitPrice }],
      },
    });
  };
};
```

**Назад:** [подготовьте входные параметры и чтение значений](./pine-strategy-runtime-setup). **Далее:** [зарегистрируйте и протестируйте стратегию](./pine-strategy-registration-and-backtest).
