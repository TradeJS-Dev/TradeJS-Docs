---
title: 'Triangle'
---

import StrategySignalChart from "@site/src/components/StrategySignalChart";

Triangle ищет пробой восходящего, нисходящего или симметричного треугольника.

Пакет устанавливается отдельно. [Как подключить пакет и сохранить стандартные стратегии](../../getting-started/add-strategy).

## Визуальная схема

<StrategySignalChart strategy="triangle" />

## Установка

Выполните команду в каталоге проекта TradeJS.

```bash
npm install --save-exact @tradejs/strategy-triangle
```

Добавьте `"@tradejs/strategy-triangle"` в список `strategies` в
`tradejs.config.ts`. Пакет зарегистрирует стратегию `Triangle`.

## Сигнал и выход

Стандартный интервал составляет 15 минут. Стратегия ищет фигуру с
несколькими касаниями сходящихся границ. По умолчанию разрешены пробои в обе
стороны. Задайте `TRIANGLE_ALLOW_REVERSE_BREAKOUTS: false`, чтобы для восходящего
треугольника разрешить только пробой вверх, а для нисходящего только пробой
вниз. Симметричный треугольник использует фактическое направление пробоя.

Стоп находится за противоположной границей. Цель — часть начальной высоты
треугольника, отложенная от линии пробоя.

Подробности настройки есть в [README пакета](https://github.com/TradeJS-Dev/TradeJS-Strategy-Triangle#readme).

## Бэктест {#backtest}

Из папки стандартного проекта с запущенным Docker выполните две команды.
Первая сохраняет настройки `Triangle:example` в локальном Redis. В них указан
только интервал, поэтому остальные значения берутся из настроек стратегии.
Вторая запускает проверку на 15-минутных свечах Binance BTCUSDT за 30 дней.

```bash
docker compose -f docker-compose.dev.yml exec -T redis redis-cli JSON.SET \
  'users:root:backtests:configs:Triangle:example' '$' '{"INTERVAL":["15"]}' NX

npm run backtest -- --user root --connector binance --tickers BTCUSDT \
  --config Triangle:example --timeframe 15 --days 30 --tests 1 --parallel 1
```

Если первая команда вернула пустой ответ, настройки с таким именем уже есть.
Для чистого примера замените `example` на новое имя в обеих командах.
