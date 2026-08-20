---
sidebar_position: 6
title: Командная строка
---

Командный интерфейс TradeJS поставляется в пакете `@tradejs/cli`:

```bash
npx @tradejs/cli <command> [flags]
```

Точный синтаксис установленной версии всегда можно получить через `--help`:

```bash
npx @tradejs/cli backtest --help
```

## Команды

Настройка и диагностика:

- `doctor` — проверка обязательных сервисов и необязательного ML-сервиса;
- `infra-init` — создание файлов локальной инфраструктуры;
- `infra-up` / `infra-down` — запуск и остановка локальных сервисов;
- `server-health` — проверка состояния сервисов;
- `user-add` — создание пользователя.

Исследование и бэктестинг:

- `backtest` — запуск бэктеста или обновление истории рынка;
- `results` — просмотр и ведение локального списка выбранных результатов;
- `runtime-parity` — сравнение записанных реальных входов с восстановленными;
- `replay` — воспроизведение рабочей конфигурации на исторических свечах;
- `runtime-evidence` — сбор журнала решений и версий за заданный период;
- `runtime-evidence-sync` — проверка и импорт журнала с другого сервера;
- `runtime-scorecard` — сводка расхождений и качества исполнения;
- `replay-runtime-evidence` — объединение результата воспроизведения с журналом;
- `execution-calibration` — сравнение времени сигнала, выхода на рынок и исполнения.

Текущий рынок и сигналы:

- `signals` — один расчёт стратегий на последней закрытой свече;
- `signals-daemon` — постоянный расчёт на закрытии новых свечей;
- `signals-summary` — сводка недавних сигналов и ордеров;
- `runtime-control` — просмотр, проверка, пауза и возобновление стратегий;
- `market-ws` — WebSocket-сервис свечей для графика;
- `bot` — запуск Telegram-бота.

Рыночные данные и обслуживание:

- `continuity` — проверка и исправление непрерывности свечей;
- `binance:market-ingest` — загрузка рыночных данных Binance;
- `derivatives:ingest` — загрузка данных рынка деривативов;
- `derivatives:ingest:coinalyze:all` — загрузка данных Coinalyze для всех настроенных инструментов;
- `spread:ingest` — загрузка спредов Binance и Coinbase;
- `hyperliquid:whale-ingest` — поток контекста крупных позиций Hyperliquid;
- `hyperliquid:whale-backfill` — заполнение заданного исторического периода Hyperliquid;
- `maintenance:cleanup-market-context` — удаление устаревшего рыночного контекста;
- `clean-dir`, `clean-redis`, `clean-tests` — команды точечной очистки.

AI и ML:

- `ml-export` — экспорт набора данных для ML;
- `ml-inspect` — проверка набора данных для ML;
- `ml-train:latest` — обучение на последнем наборе и выбор модели;
- `ai-export` — экспорт данных для проверки AI-промптов;
- `ai-train` — повторная оценка данных и измерение поведения AI-фильтра;
- `ai-pocket-search` — поиск устойчивых областей признаков для детерминированного фильтра;
- `test-ml`, `test-script` — диагностические команды.

## Основные примеры

```bash
# Проверить локальные зависимости
npx @tradejs/cli doctor

# Обновить свечи без запуска тестов
npx @tradejs/cli backtest --updateOnly --tickers BTCUSDT,ETHUSDT

# Запустить бэктест одного инструмента на сохранённой истории
npx @tradejs/cli backtest \
  --config MaStrategy:base \
  --tickers BTCUSDT \
  --cacheOnly

# Рассчитать сигналы без размещения ордеров
npx @tradejs/cli signals \
  --tickers BTCUSDT \
  --cacheOnly \
  --skipScreenshots

# Показать выбранные результаты одной стратегии
npx @tradejs/cli results --strategy TrendLine --coverage
```

## `backtest`

`backtest` — основная команда исторического тестирования.

Инструменты и объём расчёта:

- `-t, --tickers` — символы через запятую;
- `-e, --exclude` — исключаемые символы;
- `-l, --tickersLimit` — максимальное число символов;
- `-n, --tests` — максимальное число тестов конфигурации;
- `-s, --skip` — пропустить первые N тестов;
- `-p, --parallel` — число параллельных процессов;
- `-f, --timeframe` — интервал свечи в минутах;
- `-d, --days` — период за последние N дней;
- `--startTime`, `--endTime` — точный период в секундах или миллисекундах Unix.

Данные:

- `-u, --updateOnly` — только обновить историю;
- `-C, --cacheOnly` — использовать только сохранённую историю;
- `-L, --showTickersList` — вывести итоговый список символов и завершить работу;
- `-o, --connector` — коннектор, например `bybit`, `binance`, `coinbase` или `custom`.

Конфигурация и вывод:

- `-c, --config` — имя конфигурации, например `MaStrategy:base`;
- `-T, --top` — число лучших групп результатов для сетки параметров;
- `-g, --progressStep` — интервал вывода прогресса;
- `-U, --user` — пользователь Redis, по умолчанию `root`;
- `--fast` — не сохранять файлы каждого теста, оставить сводку и наборы данных;
- `-K, --continue` — продолжить последний совместимый прерванный запуск;
- `-R, --runId` — идентификатор запуска, который нужно продолжить.

Допущения об исполнении:

- `--backtestPriceMode` — цена входа после задержки: `open`, `close` или `mid`;
- `--backtestEntryDelayBars` — задержка входа на N закрытых свечей после сигнала.

Дополнительные наборы данных:

- `-m, --ml` — записывать строки ML в отдельные JSONL-файлы процессов;
- `-A, --ai` — записывать строки для офлайн-проверки AI-промптов.

Сетка параметров сохраняется под именем
`users:<user>:backtests:configs:<StrategyName:configName>`. Подробнее:
[Создание конфигурации бэктеста](../getting-started/backtest-config).

## `signals`

`signals` рассчитывает включённые стратегии на последней закрытой свече.

- `-t, --tickers` — символы через запятую;
- `-e, --exclude` — исключаемые символы;
- `-l, --tickersLimit` — максимальное число символов;
- `-f, --timeframe` — интервал в минутах;
- `-m, --makeOrders` — разрешить размещение ордеров после всех проверок;
- `-N, --notify` — отправлять Telegram-уведомления;
- `-S, --skipScreenshots` — не создавать изображения графиков;
- `-u, --updateOnly` — только обновить историю;
- `-C, --cacheOnly` — использовать только сохранённые данные;
- `-L, --showTickersList` — вывести итоговый список символов и завершить работу;
- `-p, --parallel` — число параллельных процессов;
- `-R, --showSkipStats` — показать причины пропущенных решений по стратегиям;
- `-c, --chunk` — обработать часть набора, например `1/3`;
- `-U, --user` — пользователь Redis;
- `-o, --connector` — имя коннектора;
- `-V, --universe` — `crypto` или `tradfi`;
- `-A, --account` — идентификатор торгового счёта;
- `-D, --deployment` — идентификатор развёртывания;
- `-w, --watch` — повторять расчёт на закрытии свечей;
- `-d, --settleDelayMs` — задержка после закрытия свечи перед расчётом.

Без фильтров команда обрабатывает все включённые настройки из
`tradejs.config.ts`. Подробнее: [Как рассчитываются сигналы](../runtime/execution/signals).

## `runtime-control`

`runtime-control` читает настройки из `tradejs.config.ts`. Пауза и
возобновление добавляют или снимают только временный запрет новых входов, не
редактируя конфигурацию стратегии.

```bash
npx @tradejs/cli runtime-control inspect --user root --deployment production
npx @tradejs/cli runtime-control verify --user root --deployment production
npx @tradejs/cli runtime-control pause --user root --deployment production --strategy TrendFollow
npx @tradejs/cli runtime-control resume --user root --deployment production --strategy TrendFollow
```

- `inspect` выводит итоговые настройки; доступны фильтры `--deployment` и `--strategy`;
- `verify` проверяет пакеты, счета, интервалы и связи стратегий;
- `pause` и `resume` требуют `--deployment` и `--strategy`;
- пауза блокирует новые входы, но сохраняет управление открытыми позициями;
- возобновление не может включить стратегию с `enabled: false`.

## `replay`

`replay` рассчитывает включённые стратегии одного развёртывания на историческом
периоде. `--runtimeEvidence` позволяет воспроизвести версии стратегий, пакетов и
конфигураций из собранного журнала.

- `--deployment` — идентификатор из `tradejs.config.ts`, по умолчанию `production`;
- `--runtimeEvidence` — JSON-файл журнала с сохранённой настройкой;
- `--days` или `--startTime` / `--endTime` — период воспроизведения;
- `--tickers`, `--exclude`, `--tickersLimit` — временный набор инструментов;
- `--timeframe` — должен совпадать у всех выбранных стратегий;
- `--cacheOnly` — использовать только сохранённую историю;
- `--chart` — сохранить компактные графики для страницы стратегий;
- `--showTickersList` — вывести итоговый список инструментов и завершить работу.

Подробнее: [Проверка реальных решений через воспроизведение](../runtime/backtesting/replay-evidence).

## `signals-summary`

`signals-summary` собирает сводку недавних сигналов и ордеров.

- `-u, --user` — пользователь Redis;
- `--connector` — коннектор для сверки;
- `-H, --hours` — длина периода в часах;
- `-P, --printOnly` — напечатать сводку вместо отправки в Telegram;
- `--debugAttachment` — приложить диагностический JSON для воспроизведения.

## `results`

`results` просматривает и ведёт локальный список выбранных результатов.

- `-s, --strategy` — имя стратегии, обязательно;
- `-C, --coverage` — показать покрытие инструментов;
- `-u, --update` — полностью заменить сохранённый список;
- `-m, --merge` — объединить новые результаты с сохранёнными;
- `-c, --clear` — удалить список;
- `-V, --verbose` — подробный вывод;
- `-U, --user` — пользователь Redis.

Команда помогает отобрать варианты для независимой проверки. Она не меняет
настройки реальной торговли.

## `runtime-parity`

`runtime-parity` сравнивает записанные реальные входы с исторически
восстановленными.

- `-u, --user` — пользователь и журнал реальной работы;
- `-o, --connector` — коннектор;
- `-d, --days` — период в днях;
- `-b, --startTime`, `-e, --endTime` — точный период в секундах или миллисекундах Unix;
- `-s, --strategy` — ограничить сравнение одной стратегией;
- `-t, --tickers` — символы через запятую;
- `-C, --cacheOnly` — не обновлять историю;
- `-a, --toleranceBars` — допустимое расхождение времени в свечах;
- `--fullUniverse` — проверить все настроенные стратегии на всех инструментах коннектора;
- `--runtimeGates` — вызвать настроенные AI/ML-фильтры;
- `-N, --notify` — отправить сводку в Telegram;
- `-D, --details` — вывести несовпавшие входы.

## `ai-train`

`ai-train` повторно оценивает экспортированные строки и измеряет работу
AI-фильтра.

- `-o, --outDir` — каталог данных, по умолчанию `data/ai/export`;
- `-s, --strategy` — фильтр по стратегии;
- `-f, --file` — явный путь к объединённому файлу;
- `-n, --recent` — число последних строк, `0` означает все строки;
- `-k, --skip` — число последних строк, которые нужно пропустить;
- `-p, --parallel` — число параллельных запросов;
- `-m, --model` — другая модель для проверки;
- `-M, --minQuality` — минимальная оценка для разрешения входа;
- `-l, --localOnly` — использовать детерминированный фильтр без внешнего AI;
- `-U, --user` — пользователь Redis;
- `-c, --chart` — сохранить графики для страницы стратегий;
- `-j, --json` — вывести структурированную сводку JSON;
- `-S, --since`, `-u, --until` — ограничить строки по времени;
- `-P, --period` — период, например `last365d`, `last90d` или `last30d`;
- `-q, --qualityThresholds` — пороги `qN+` через запятую;
- `-d, --dumpEvaluations` — записать оценки в JSONL;
- `-G, --dumpFeatures` — признаки в выгрузке: `none`, `gateFeatures` или `baseContext`;
- `-Q, --symbolQuarantine` — применить карантин отдельных инструментов.

## `ai-pocket-search`

`ai-pocket-search` ищет области признаков с заданными статистическими
характеристиками в экспортированных AI-данных.

Выбор данных:

- `-o, --outDir`, `-s, --strategy`, `-f, --file`;
- `-n, --recent`, `-k, --skip`;
- `-S, --since`, `-u, --until`, `-P, --period`.

Условия поиска:

- `-M, --minQuality`, `-q, --qualityThresholds`;
- `-g, --scope` — `all`, `approved`, `rejected` или `candidates`;
- `-d, --maxDepth`, `-m, --minSupport`;
- `-F, --minProfitFactor`, `-W, --minWinRate`, `-R, --minTotalProfit`;
- `-a, --maxAtomicPredicates`, `-C, --maxCombinations`;
- `-V, --validationSplit`, `-N, --minValidationSupport`;
- `-D, --dedupeEquivalentSelections`.

Вывод:

- `-t, --top`, `-Y, --includeSymbol`, `-E, --includeGateContext`;
- `-p, --featureProfile` — `compact` или `all`;
- `-r, --reportDir`, `-B, --reportFile`;
- `-j, --json`, `-O, --output`.

## `doctor`

`doctor` проверяет инфраструктуру перед запуском рабочих процессов.

- `--require-ml` — считать доступность ML-сервиса обязательной;
- `--skip-ml` — не проверять ML-сервис.

## Подробные статьи

- [Первый бэктест](../getting-started/first-backtest)
- [Создание конфигурации бэктеста](../getting-started/backtest-config)
- [Сетка параметров](../runtime/backtesting/grid-config)
- [Как использовать проверенную конфигурацию](../runtime/backtesting/results-runtime-config)
- [Сравнение реальных и воспроизведённых входов](../runtime/backtesting/runtime-parity)
- [Синхронизация данных](../getting-started/data-sync)
- [Качество данных](../guides/data-quality)
