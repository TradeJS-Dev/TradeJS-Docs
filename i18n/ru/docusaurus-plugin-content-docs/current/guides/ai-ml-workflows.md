---
title: Использование AI и ML
---

TradeJS может проверить вход по стратегии с помощью ИИ или обученной модели.
Перед включением такой проверки сравните результаты бэктестов с ней и без неё.

## Проверка AI-фильтра

Сначала [сохраните настройки бэктеста](../getting-started/backtest-config) под именем `TrendLine:base`.

```bash
npm exec -- tradejs backtest --config TrendLine:base --ai \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 90 --tests 1 --parallel 1
npm exec -- tradejs ai-export --strategy TrendLine
npm exec -- tradejs ai-train --strategy TrendLine -n 50 --minQuality 4
```

Также можно проверить детерминированный локальный фильтр без внешних запросов и
исследовать подмножества признаков:

```bash
npm exec -- tradejs ai-train --strategy TrendLine --localOnly
npm exec -- tradejs ai-pocket-search --strategy TrendLine
```

Оценивайте не только долю разрешённых сигналов, но и размер выборки, результат
после издержек, просадку, стабильность по периодам и риск переобучения.

По умолчанию поиск оставляет последние 40% групп временных меток для закрытого
теста. Первые 60% используются для поиска, а три блока внутри этого периода
проверяют устойчивость при разработке. Зафиксируйте правила до однократного
открытия теста.

Для сравнения выгрузок задайте одну календарную границу через
`--testSince 2026-09-01T00:00:00Z --validationSplit 0 --sealTest`. Дата служит
примером; выберите её до поиска. Решения на границе и после неё относятся к
тесту. Более ранние решения с выходом на границе или позже, а также с неизвестным
временем выхода исключаются из разработки, чтобы не использовать будущие исходы.

## Подготовка ML-модели

Для обучения нужен `docker-compose.ml.yml` с сервисом `ml`. Установщик TradeJS создаёт только окружение для обычных бэктестов.

```bash
npm exec -- tradejs backtest --config TrendLine:base --ml \
  --connector binance --tickers BTCUSDT --timeframe 15 --days 90 --tests 1 --parallel 1
npm exec -- tradejs ml-export --strategy TrendLine
npm exec -- tradejs ml-inspect --strategy TrendLine
npm exec -- tradejs ml-train:latest --strategy TrendLine
```

Разделяйте обучение и проверку по времени, исключайте будущую информацию,
сохраняйте версию признаков и контролируйте деградацию после запуска.

## Дальше

- [Настройка AI](../ai-ml/ai/configuration)
- [Проверка AI-фильтра](../ai-ml/ai/prompt-replay)
- [Настройка ML](../ai-ml/ml/configuration)
- [Ограничения бэктестинга](../limitations/backtesting-caveats)
