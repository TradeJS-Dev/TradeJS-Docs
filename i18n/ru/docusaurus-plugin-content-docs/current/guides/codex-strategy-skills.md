---
title: Codex skills для работы со стратегиями
---

`npx create-tradejs` устанавливает в `.codex/skills` созданного проекта полный
checksum-managed набор TradeJS skills. У каждого вызова есть один владелец
workflow. Поэтому отдельный core-эксперимент не смешивается с полным улучшением
стратегии, анализом gate, отчётностью и production-изменениями.

## Выбор владельца workflow

- `$strategy-improvement-research` выбирает семейства гипотез, управляет
  ограниченным trial ledger, выбирает лучшего кандидата и фиксирует полный
  handoff core + gate.
- `$strategy-backtest-research` реализует или запускает один заранее
  зарегистрированный core-эксперимент. Он возвращает сверенное evidence и не
  выбирает следующего кандидата.
- `$ai-train-local-research` используется после фиксации core/export. Он
  отвечает за deterministic-gate analysis и не открывает заново core selection.

Improvement workflow последовательно использует оба специализированных этапа.
Прямой вызов specialist skill не запускает полный improvement lineage.

## Вспомогательные skills

| Skill | Назначение |
| --- | --- |
| `$strategy-backtest-research` | Выполнить одну ограниченную реализацию или заранее зарегистрированный core-backtest эксперимент |
| `$ai-train-local-research` | Исследовать deterministic gate для одного зафиксированного core/export |
| `$backtest-config-redis` | Прочитать именованный исследовательский grid из локального Redis без продвижения |
| `$save-strategy-config-from-backtest` | Явно перенести исследовательский grid в Git-owned декларацию Project |
| `$runtime-parity-mismatch-analysis` | Разобрать готовый runtime-parity mismatch artifact до решения о новом replay |

## Карта lifecycle skills

| Skill | Назначение | Может изменить production? |
| --- | --- | --- |
| `$strategy-candidate-report` | Показать последнего явно выбранного кандидата, точный конфиг, свежесть, график и метрики | Нет |
| `$strategy-candidate-compare` | Сравнить кандидата с точной запущенной composition на общем периоде | Нет |
| `$strategy-improvement-plan` | Проанализировать source и evidence и ранжировать причинные гипотезы | Нет |
| `$strategy-improvement-research` | Начать новый ограниченный контур исследования core + deterministic gate и зафиксировать лучшего воспроизводимого кандидата | Нет |
| `$strategy-period-revalidate` | Перепроверить production и сильных старых кандидатов на расширенном общем периоде без подстройки | Нет |
| `$strategy-forward-start` | Опубликовать и запустить последнего допустимого кандидата — либо явно названного воспроизводимого исторического кандидата — с `MAX_LOSS_VALUE=1` | Да |
| `$strategy-forward-status` | Проверить identity, parity, ордера, исполнение и нормализованный live evidence | Нет |
| `$strategy-risk-scale` | Изменить только `MAX_LOSS_VALUE` у той же запущенной composition | Да |

`$strategy-release` оставлен как deprecated compatibility router. Он выбирает
ровно один focused lifecycle skill и не должен воссоздавать прежний общий
workflow исследования, публикации, деплоя и изменения риска.

Промпты остаются короткими:

```text
$strategy-candidate-report MarketFlushReversal
$strategy-improvement-research MarketFlushReversal
$strategy-forward-start MarketFlushReversal
```

## Установка и обновление

Canonical source skills находится в репозитории TradeJS framework. Все
официальные TradeJS skills входят в один SHA-256 manifest; созданные Projects
не поддерживают независимые копии. Полный официальный snapshot обновляется
только через явно выбранную версию `create-tradejs`:

```bash
npx create-tradejs@<approved-version> --update-skills .
```

Updater сохраняет несвязанные custom skills и отклоняет изменения уже
управляемого файла. Когда новая версия впервые включает существующий
официальный skill в bundle, явное обновление принимает canonical snapshot с
тем же именем.

## Корни исследования

Advanced source-aware research разделяет три ответственности:

- `PROJECT_CWD` владеет `.env`, конфигурацией, datasets, notes и reports.
- `TRADEJS_SOURCE_REPOSITORY_ROOT` указывает точный Git checkout framework или
  standalone strategy, чей build и lineage исследуются.
- `TRADEJS_FRAMEWORK_REPOSITORY_ROOT` предоставляет собранный framework runtime
  для исследования. Он обязателен для gate-ablation tool, когда source root —
  standalone strategy; если source — framework, оба root могут указывать на
  один checkout.

Ablation tool импортирует `strategyEntries` из build standalone strategy,
поэтому принятый strategy path не заменяется незаметно опубликованным пакетом
из Project.

## Как выбирается кандидат

Исследовательский skill не оптимизирует только прибыль за весь период, win
rate или прибыльный хвост 7 дней. Сначала он требует причинную и data-validity,
сверку trace и положительное out-of-sample ожидание на единицу риска после
издержек. Затем оценивает probabilistic/deflated Sharpe, drawdown и tail loss,
время восстановления, серии убытков, серии убыточных месяцев,
walk-forward/regime stability, концентрацию, cost robustness и исполнимую
частоту сделок.

Прибыль за весь период и win rate остаются важными экономическими
диагностиками, но не являются достаточными сами по себе. Окна 7d/30d/180d
описывают текущий режим. Их вес зависит от числа независимых событий: меньше
20 — недостаточная мощность, 20–49 — диагностический уровень, 50 и больше —
уровень отбора. Разреженный хвост не требует ждать 7, 30 или 180 календарных
дней перед prospective-тестом с риском 1.

Каждый вызов improvement-research создаёт новый lineage. До новых гипотез skill
перепроверяет сильнейших старых кандидатов на новом общем периоде. Он не
останавливается после аудита или первого неудачного раунда: работа завершается,
когда зафиксирован воспроизводимый лучший кандидат, исчерпан ограниченный
бюджет новых вариантов либо для всех оставшихся семейств записан жёсткий
причинный blocker.

## Что делает forward start

`$strategy-forward-start <Strategy>` — явная граница полномочий для
ограниченного live forward-теста. По умолчанию skill берёт последнего
checksum-verified и forward-eligible кандидата и устанавливает
`MAX_LOSS_VALUE=1`.

- Если стратегии нет в целевом deployment, skill добавляет и включает её
  полную проверенную декларацию.
- Если запущен другой пакет, core config, deterministic gate, context или
  direction policy, skill делает одну контролируемую замену.
- Если точная composition с риском 1 уже запущена, skill не меняет конфиг и
  идемпотентно проверяет rollout.

### Явно названный исторический кандидат

Оператор может вместо этого явно назвать другого исторически перспективного
кандидата для prospective-only обучения. Это не переписывает прежний выбор и
не превращает противоречащие свежие данные в положительный исторический
вердикт. Точные expression, direction policy, effective config, lineage
исходников и данных, evidence hashes, метрики полного периода и график должны
оставаться воспроизводимыми; на максимально покрытом периоде требуются
положительный net PnL и profit factor выше 1.

До rollout Codex создаёт новый immutable artifact с разрешением оператора,
который ссылается на исходный выбор и противоречащие либо статистически слабые
данные. Отсутствующие hashes, неположительная экономика максимального периода
или необходимость новой подстройки остаются блокерами. Этот режим меняет только
полномочие на prospective-тест с риском 1 и не создаёт историческую валидность
задним числом.

Если кандидат содержит ещё не опубликованный source стратегии, skill через
настроенный release workflow коммитит и пушит полный release range, публикует
immutable package, устанавливает его точную версию и lockfile в Project,
коммитит и пушит полный Git-owned `tradejs.config.ts`, деплоит точный Project
tip и проверяет `strategyRevision` и `deploymentCompositionId`.

Skill не выдумывает production target. Заранее должны существовать точные
runtime user, deployment, trading account, connector и workflow публикации и
деплоя. `create-tradejs` добавляет skills и локальный проект, но не создаёт
registry credentials, ключи биржи, production hosting или неуправляемый
background daemon. Если не хватает авторизации или binding, Codex
останавливается на этой границе и показывает точное действие для пользователя.

## Увеличение риска — отдельное решение

Используйте `$strategy-risk-scale <Strategy>` только после анализа prospective
evidence. Skill сохраняет точные package, core, gate, context, universe и
direction policy и меняет только `MAX_LOSS_VALUE`, не более чем на один
разрешённый шаг. Решение зависит от событий, а не календаря: execution parity,
after-cost expectancy, нормализованные drawdown/tail loss, slippage,
концентрация и число независимых сделок важнее факта «прошло 30 дней».

Требования к счёту, immutable build и runtime описаны в разделе
[Запуск стратегии в рабочем окружении](../getting-started/run-strategy-in-production).
