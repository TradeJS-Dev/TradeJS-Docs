---
title: Codex skills для работы со стратегиями
---

`npx create-tradejs` устанавливает в `.codex/skills` созданного проекта набор
узких Codex skills. Каждый вызов получает имя одной стратегии и выполняет один
тип работы. Поэтому запрос метрик не может незаметно превратиться в публикацию
пакета или деплой.

## Карта skills

| Skill | Назначение | Может изменить production? |
| --- | --- | --- |
| `$strategy-candidate-report` | Показать последнего явно выбранного кандидата, точный конфиг, свежесть, график и метрики | Нет |
| `$strategy-candidate-compare` | Сравнить кандидата с точной запущенной composition на общем периоде | Нет |
| `$strategy-improvement-plan` | Проанализировать source и evidence и ранжировать причинные гипотезы | Нет |
| `$strategy-improvement-research` | Начать новый ограниченный контур исследования core + deterministic gate и зафиксировать лучшего воспроизводимого кандидата | Нет |
| `$strategy-period-revalidate` | Перепроверить production и сильных старых кандидатов на расширенном общем периоде без подстройки | Нет |
| `$strategy-forward-start` | Опубликовать и запустить выбранного кандидата с `MAX_LOSS_VALUE=1` | Да |
| `$strategy-forward-status` | Проверить identity, parity, ордера, исполнение и нормализованный live evidence | Нет |
| `$strategy-risk-scale` | Изменить только `MAX_LOSS_VALUE` у той же запущенной composition | Да |

Промпты остаются короткими:

```text
$strategy-candidate-report MarketFlushReversal
$strategy-improvement-research MarketFlushReversal
$strategy-forward-start MarketFlushReversal
```

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
ограниченного live forward-теста. Skill берёт последнего checksum-verified и
forward-eligible кандидата и устанавливает `MAX_LOSS_VALUE=1`.

- Если стратегии нет в целевом deployment, skill добавляет и включает её
  полную проверенную декларацию.
- Если запущен другой пакет, core config, deterministic gate, context или
  direction policy, skill делает одну контролируемую замену.
- Если точная composition с риском 1 уже запущена, skill не меняет конфиг и
  идемпотентно проверяет rollout.

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
