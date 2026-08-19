---
sidebar_position: 9
title: Как работают сигналы
---

В TradeJS есть one-shot команда и persistent production daemon. Оба пути
оценивают только закрытые свечи через общий с replay/backtest strategy runtime.

```bash
# Один проход по всем configured scopes
npx @tradejs/cli signals

# Long-running process по границам свечей
npx @tradejs/cli signals-daemon
# Эквивалент: npx @tradejs/cli signals --watch
```

## Runtime-конфиги и scopes

Production runtime настраивается в `tradejs.config.ts` проекта. Deployment
задаёт connector/account/scope, а каждая стратегия содержит полный
`{ version, enabled, config }`:

```ts
export default defineConfig(basePreset, {
  runtime: {
    deployments: {
      production: {
        connectorName: 'bybit',
        accountId: 'bybit-main',
        strategies: {
          DoubleTap: {
            version: 4,
            enabled: true,
            config: { INTERVAL: '15', UNIVERSE: 'crypto', MAX_LOSS_VALUE: 1 },
          },
        },
      },
    },
  },
});
```

Runtime не объединяет Redis-конфиги стратегий, result overlays или deployment
overrides. Credentials account остаются на сервере. Без явных scope flags
`signals` один раз выполняет все активные declarations.

Scope flags: `--user`, `--connector`, `--timeframe`,
`--universe crypto|tradfi`, `--account`, `--deployment`, `--tickers`,
`--exclude`, `--tickersLimit`, `--chunk`.

Две declarations одной стратегии могут работать одновременно, только
если разрешаются в разные accounts. Same-strategy/same-account conflict
завершает запуск явной ошибкой.

## Один цикл

1. Загружает project plugins, Git-owned deployments, trading accounts и optional pause overrides.
2. Разрешает connector и ticker universe каждого scope.
3. Готовит candles и обязательный signal-time market context.
4. Выполняет project hook `beforeSignals`.
5. Оценивает стратегии на последней закрытой свече.
6. Сохраняет signal/evaluation до optional screenshots.
7. Применяет AI/ML/policy gates и ставит ордера только с `--makeOrders`.
8. Выполняет `afterSignals`, notifications, skip stats и cycle telemetry.

## Состояние daemon

Daemon сохраняет между последовательными свечами только bounded replayable
detector state. Heavy runtimes и indicator controllers пересоздаются. После
restart, candle gap, effective config change или
`SIGNALS_DAEMON_MAX_LIVE_BARS` стратегия восстанавливается из rolling warmup.

Lifecycle identity включает connector, universe, account/deployment, symbol,
interval, strategy и её version/config. Удаленные scopes эвиктятся. Catch-up rebuild
не ставит historical orders и не отправляет historical notifications.

`users:<user>:runtime:controls` в Redis опционален. Отсутствующий ключ означает
отсутствие ручных overrides. Pause записывает только `entriesPaused: true`, а
resume удаляет override. Невалидный документ или недоступный Redis приводят к
fail closed. Pause блокирует новые входы, но не управление открытыми позициями.

Для Bybit crypto daemon по умолчанию использует один public kline WebSocket.
Confirmed candles batch-записываются в Timescale; REST остается fallback для
startup, gaps и reconnect. `SIGNALS_KLINE_WS_ENABLED=0` включает REST-only,
`SIGNALS_KLINE_WS_WAIT_MS` настраивает ожидание close.

## Ордера и notifications

- `--makeOrders` разрешает placement, но strategy/account/AI/ML/policy могут его заблокировать;
- `--notify` отправляет принятые signals и optional AI commentary;
- skipped/canceled orders остаются в diagnostics, но не отправляются как trade notifications;
- `signals-summary` строит recent runtime digest.

В production управляйте daemon через supervisor, ограничивайте heap с
`SIGNALS_DAEMON_HEAP_MB` и следите за cycle failures/stale candles.
