---
title: Перенос результатов бэктеста в Project config
---

Эта страница описывает, как проверить кандидатов бэктеста и перенести один
полный reviewed config в Git-owned production declaration.

## 1. Что делает `results`

`npx @tradejs/cli results` собирает сохранённые test configs/stats и показывает
per-symbol winners одной стратегии:

```bash
npx @tradejs/cli results --strategy TrendLine --coverage --user root
```

`--update`, `--merge` и `--clear` управляют только локальной research-записью
`users:<user>:strategies:<strategy>:results`. Production runtime её не читает.

## 2. Как промоутнуть один config

1. Выберите один полный deterministic config по reviewed evidence, а не только
   по PnL.
2. Обновите `config` стратегии в `tradejs.config.ts`.
3. Если менялся код, обновите exact dependency её strategy package.
4. Увеличьте positive integer `version` именно этой стратегии.
5. Закоммитьте package, lockfile, config и version вместе.
6. Запустите project checks и production-like image smoke перед deployment.

UI показывает committed config read-only. Единственное mutable server действие
— optional pause/resume override. Записи config в production Redis и release
pointer switch больше нет.

## 3. Рекомендуемый flow

1. Запустите backtest config grid.
2. Проверьте coverage и кандидатов через `results`.
3. Проведите release/parity review выбранного полного config.
4. Перенесите его в Project declaration и увеличьте strategy version.
5. Задеплойте immutable Project image и выполните
   `runtime-control verify --user root --deployment production`.
6. Наблюдайте bounded forward test при `MAX_LOSS_VALUE=1`.
