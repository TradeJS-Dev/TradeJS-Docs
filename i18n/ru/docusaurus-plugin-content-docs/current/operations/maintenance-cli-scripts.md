---
title: Скрипты командной строки для обслуживания и отладки
---

Эти команды помогают запустить и остановить локальные сервисы, проверить проект и
обслуживать его данные.

## Локальная инфраструктура для разработки

Создайте локальный Compose-файл. Команду нужно выполнить один раз:

```bash
npm exec -- tradejs infra-init
```

Запустите сервисы:

```bash
npm exec -- tradejs infra-up
```

Остановить локальную инфраструктуру:

```bash
npm exec -- tradejs infra-down
```

## Очистка

Очистка локальных файлов в `data/*`:

```bash
npm exec -- tradejs clean-dir --dir cache
npm exec -- tradejs clean-dir --dir ml/export
```

Удаление данных из области `cache` в Redis:

```bash
npm exec -- tradejs clean-redis --area cache
```

Для локального пользователя `root` первая команда удаляет сохранённые тесты и их кэш. Вторая удаляет только кэш.

```bash
npm exec -- tradejs clean-tests --user root
npm exec -- tradejs clean-tests --user root --cache
```

## Управление пользователями

Для создания пользователя или смены пароля см. [локальная учётная запись](../getting-started/root-user).

## Проверка состояния окружения

```bash
npm exec -- tradejs doctor
npm exec -- tradejs doctor --require-ml
npm exec -- tradejs doctor --skip-ml
```
