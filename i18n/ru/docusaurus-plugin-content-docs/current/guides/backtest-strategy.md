---
title: Бэктест стратегии
---

Backtest прогоняет стратегию по историческим свечам и сохраняет metrics/artifacts.

## Базовая форма команды

```bash
npx @tradejs/cli backtest --user root --config <StrategyName:configName> --tickers BTCUSDT --timeframe 15 --tests 1 --parallel 1
```

Выбранный config должен существовать в Redis. Sandbox из [Первого бэктеста](../getting-started/first-backtest) создает такой config сам; для своей стратегии см. [Создать backtest config](../getting-started/backtest-config).

## Полезные flags

- `--config` - backtest config key;
- `--tickers` - список symbols;
- `--timeframe` - interval;
- `--tests` - максимум тестов;
- `--parallel` - число workers;
- `--cacheOnly` - не обновлять market cache;
- `--updateOnly` - только обновить cache;
- `--ml` - экспортировать ML rows;
- `--ai` - экспортировать AI prompt rows;
- `--runId` - продолжить resumable run.

## Workflow

1. Начните с одной стратегии, symbol и config.
2. Проверьте, что entries/exits объяснимы.
3. Расширьте окно и symbols.
4. Сравнивайте варианты при одинаковых assumptions.
5. Прочитайте [Ограничения бэктестинга](../limitations/backtesting-caveats).

Deep dives:

- [Обзор бэктестинга](../runtime/backtesting/overview)
- [Grid config](../runtime/backtesting/grid-config)
- [Runtime parity](../runtime/backtesting/runtime-parity)
