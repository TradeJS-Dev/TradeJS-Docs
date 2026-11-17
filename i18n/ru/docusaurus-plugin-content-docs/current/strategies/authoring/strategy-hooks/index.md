---
title: Хуки жизненного цикла стратегий
---

Хук — это функция, которую TradeJS вызывает на определённом шаге. Например, после
решения стратегии или перед отправкой заявки.

Хуки можно объявлять в двух местах:

- локально для стратегии в `manifest.ts` через `manifest.hooks`
- на уровне проекта в `tradejs.config.ts` через `hooks`

Обработчики из `tradejs.config.ts` применяются ко всем стратегиям проекта.
Обработчики из `manifest.ts` добавляются к ним. На каждом этапе сначала работают
обработчики проекта, а затем обработчики стратегии.

## Порядок вызова

1. [onInit](./strategy-hooks/on-init) — один раз при создании среды исполнения
2. [onBar](./strategy-hooks/on-bar) — на каждой свече до `core.ts`
3. [afterCoreDecision](./strategy-hooks/after-core-decision) — после `core.ts`, только если `core.ts` вообще выполнялся
4. [afterBarDecision](./strategy-hooks/after-bar-decision) — после финального решения по свече, независимо от того, пришло оно из `onBar` или из `core.ts`
5. [onSkip](./strategy-hooks/on-skip) — только для `skip`
6. [beforeClosePosition](./strategy-hooks/before-close-position) — проверка, которая может заблокировать закрытие
7. [afterEnrichMl](./strategy-hooks/after-enrich-ml) — только когда есть `decision.signal`
8. [afterEnrichAi](./strategy-hooks/after-enrich-ai) — только когда есть `decision.signal`
9. [beforeEntryGate](./strategy-hooks/before-entry-gate) — проверка, которая может заблокировать вход
10. [beforePlaceOrder](./strategy-hooks/before-place-order) — прямо перед вызовом коннектора
11. [afterPlaceOrder](./strategy-hooks/after-place-order) — после успешной постановки ордера
12. [onRuntimeError](./strategy-hooks/on-runtime-error) — при любой ошибке среды исполнения или хука

## Общая структура параметров

Типы аргументов описаны в `StrategyManifest['hooks']` из `@tradejs/types`. На странице каждого хука есть способ получить его тип из установленного пакета. У блокирующих хуков результат описан типом `StrategyHookGateResult`.

## Важные замечания

- Используйте `tradejs.config.ts -> hooks`, когда логика должна применяться сразу ко всем стратегиям проекта: например, для общих правил риска, управления позициями нескольких стратегий или общих фильтров ордеров.
- `beforeSignals` и `afterSignals` тоже задаются на уровне проекта в `tradejs.config.ts`, но относятся к жизненному циклу команды `signals`, а не к среде исполнения отдельной стратегии, описанной на этой странице.
- Логику, которая нужна только одной стратегии, оставляйте в `manifest.hooks`.
- `entry.runtime.raw` содержит исходные настройки, которые `core.ts` вернул через `strategyApi.entry(...)`.
- `entry.runtime.resolved` содержит итоговые настройки после объединения значений из манифеста, конфигурации адаптера и решения стратегии.
- `afterEnrichMl` описывает весь этап машинного обучения, а не только успешный результат. Проверяйте `ml.attempted`, `ml.applied` и `ml.skippedReason`.
- `afterEnrichAi` работает так же через объект `ai`.
- `afterCoreDecision` вызывается строго после `core.ts`. Если `onBar` завершил обработку свечи раньше, а вам всё равно нужно итоговое решение, используйте `afterBarDecision`.
- Ошибки неблокирующих хуков не прерывают работу: среда исполнения записывает их в журнал, вызывает `onRuntimeError` и продолжает выполнение.
- Ошибка в `beforeEntryGate` блокирует вход.
  Если ошибка возникает в `beforeClosePosition`, TradeJS записывает её в журнал
  и продолжает обрабатывать запрос на закрытие позиции.
