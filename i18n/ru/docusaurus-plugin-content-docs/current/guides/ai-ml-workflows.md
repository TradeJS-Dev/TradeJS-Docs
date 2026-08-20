---
title: Использование AI и ML
---

AI и ML — необязательные слои анализа и фильтрации решений. Они не заменяют
правила стратегии, проверку данных и управление риском.

## Проверка AI-фильтра

```bash
npx @tradejs/cli backtest --config TrendLine:base --ai
npx @tradejs/cli ai-export
npx @tradejs/cli ai-train -n 50 --minQuality 4
```

Также можно проверить детерминированный локальный фильтр без внешних запросов и
исследовать подмножества признаков:

```bash
npx @tradejs/cli ai-train --localOnly
npx @tradejs/cli ai-pocket-search --strategy TrendLine
```

Оценивайте не только долю разрешённых сигналов, но и размер выборки, результат
после издержек, просадку, стабильность по периодам и риск переобучения.

## Подготовка ML-модели

```bash
npx @tradejs/cli backtest --config TrendLine:base --ml
npx @tradejs/cli ml-export
npx @tradejs/cli ml-inspect
npx @tradejs/cli ml-train:latest
```

Разделяйте обучение и проверку по времени, исключайте будущую информацию,
сохраняйте версию признаков и контролируйте деградацию после запуска.

## Дальше

- [Настройка AI](../ai-ml/ai/configuration)
- [Проверка AI-фильтра](../ai-ml/ai/prompt-replay)
- [Настройка ML](../ai-ml/ml/configuration)
- [Ограничения бэктестинга](../limitations/backtesting-caveats)
