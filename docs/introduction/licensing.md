---
title: Licensing
---

TradeJS version 2.0.0 and later uses a mixed-license model. The license closest to a file or package governs that component.

## Business Source License components

The product and runtime packages `@tradejs/app`, `@tradejs/base`, `@tradejs/cli`, `@tradejs/node`, and `@tradejs/strategies`, together with the private ML runtime and product code covered by the repository root license, use Business Source License 1.1 (`BUSL-1.1`).

The Additional Use Grant allows production use for your own organization, including your own trading, research, analytics, and operations. It does not allow you to provide a competing product or hosted or managed service to third parties. That use requires a commercial license.

For these components, the Change Date is July 17, 2030, and the Change License is GNU Affero General Public License Version 3. The exact terms in each package's `LICENSE` file control.

## MIT components

These packages remain MIT-licensed:

- `@tradejs/connectors`
- `@tradejs/core`
- `create-tradejs`
- `@tradejs/indicators`
- `@tradejs/infra`
- `@tradejs/types`
- the external-user sandbox example

An MIT-licensed package can depend on a BSL package. Using the MIT package does not change the dependency's license, so check the licenses of every TradeJS package in your application.

## Earlier releases and commercial licensing

Releases through `v1.0.12` remain available under the MIT License. The licensing change starts with version 2.0.0.

For the complete component matrix, exact Additional Use Grant, and commercial licensing contact, see the [canonical licensing policy](https://github.com/TradeJS-Dev/TradeJS/blob/stable/LICENSING.md).
