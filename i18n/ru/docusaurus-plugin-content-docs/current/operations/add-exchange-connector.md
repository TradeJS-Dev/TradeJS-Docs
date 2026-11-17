---
title: Как добавить коннектор новой биржи
---

Добавьте подключение к бирже как плагин. Укажите его в `tradejs.config.ts` и
проверьте команды, которые будут его использовать.

Коннектор подключается так:

- путь к плагину указывается в поле `connectors` файла `tradejs.config.ts`;
- плагин экспортирует `connectorEntries`;
- команды и среда исполнения ищут провайдеры и имена коннекторов в общем
  реестре встроенных и пользовательских плагинов.

## 1. Реализуйте фабрику коннектора

Создайте `myExchangeConnector.ts` и экспортируйте из него `MyExchangeConnectorCreator` с типом `ConnectorCreator` из `@tradejs/types`.

Возвращаемый `Connector` описывает рынок и возможности подключения, выдаёт инструменты и свечи, хранит состояние и предоставляет методы для позиций и ордеров. Если биржа отклонила операцию, метод должен сообщить об этом. Для чтения истории начните с проверки списка инструментов и свечей.

## 2. Экспортируйте connector plugin entries

В вашем пакете коннекторов экспортируйте `connectorEntries`:

```ts
import { defineConnectorPlugin } from '@tradejs/core/config';
import type { ConnectorRegistryEntry } from '@tradejs/types';

import { MyExchangeConnectorCreator } from './myExchangeConnector';

const connectorEntries: ConnectorRegistryEntry[] = [
  {
    name: 'MyExchange',
    providers: ['myexchange', 'mx'],
    creator: MyExchangeConnectorCreator,
  },
];

export default defineConnectorPlugin({ connectorEntries });
```

Затем подключите пакет в корневом конфиге:

```ts
import { defineConfig } from '@tradejs/core/config';
import { basePreset } from '@tradejs/base';

export default defineConfig(basePreset, {
  connectors: ['@your-scope/tradejs-connectors'],
});
```

## 3. Точки интеграции в CLI

Уже работают через map провайдеров и plugin-реестр:

- команда `backtest` в `@tradejs/cli`
- команда `continuity` в `@tradejs/cli`

Остаются архитектурно фиксированные места:

- в `backtest.ts` и `signals.ts` дополнительно грузятся BTC reference данные из Binance/Coinbase для spread/correlation веток
- `results.ts --coverage` использует вселенную тикеров ByBit для denominator

Поэтому добавить connector для обычной market-history интеграции просто, но часть потоков по дизайну пока привязана к Binance/Coinbase/ByBit.

## 4. Рекомендуемый checklist проверки

1. Прогоните TypeScript-проверки в вашем проекте connector.
2. Прогоните unit-тесты в вашем проекте connector.
3. `npm exec -- tradejs backtest --updateOnly --connector '<provider>' --config '<Strategy:Config>' --timeframe 15`
4. `npm exec -- tradejs backtest --connector '<provider>' --config '<Strategy:Config>' --tests 20`

## 5. Опциональный следующий шаг

Если хотите еще меньше точек входа при добавлении connector, вынесите BTC reference providers и coverage universe в настраиваемые provider settings вместо фиксированных Binance/Coinbase/ByBit.
