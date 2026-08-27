---
sidebar_label: Cloud Deployment Blueprint
title: Self-Hosted Trading Infrastructure
description: 'Plan a self-hosted TradeJS deployment with Nginx, Redis, TimescaleDB, application services, ML inference, backups, monitoring, and horizontal scaling.'
---

Use this as a reference architecture for cloud deployments.

## Single-Node Setup

Good for early production stages.

- App + Redis + Timescale + ML infer on one host.
- Nginx as ingress with HTTPS.
- Regular backups and strict firewall rules.

## Multi-Node Setup

For higher reliability and scale.

- Stateless app nodes behind load balancer.
- Managed or dedicated DB node.
- Dedicated Redis node.
- Dedicated ML inference node(s).

## Non-Functional Requirements

- Centralized logs
- Health checks and alerting
- Image tag pinning for reproducible deploys
- Rollback automation for app and model aliases
