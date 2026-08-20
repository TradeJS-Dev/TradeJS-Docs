---
title: Validate Live Decisions with Replay
---

Replay evaluates a named deployment over historical closed candles. Use it to
reproduce the decisions of the exact strategies, versions, configurations,
timeframes, accounts, and symbol selections declared for live operation.

Replay is a diagnostic tool. It does not place orders or change the deployment.

## Replay a Deployment

Run from the project that contains `tradejs.config.ts`:

```bash
npx @tradejs/cli replay \
  --user root \
  --deployment production \
  --days 7 \
  --cacheOnly
```

Useful options:

- `--startTime` and `--endTime` select an exact Unix timestamp window;
- `--tickers`, `--exclude`, and `--tickersLimit` temporarily change the symbols;
- `--cacheOnly` prevents a market-history refresh;
- `--showTickersList` prints the resolved symbols without running replay;
- `--chart` stores compact charts for the strategies page.

Without a temporary symbol override, replay applies the deployment's symbol
selection and any strategy-level `selection.tickers` limits.

## Capture a Live Runtime Record

For exact comparison, collect a timestamped record on the host where live
evaluation ran:

```bash
npx @tradejs/cli runtime-evidence \
  --daily \
  --user root \
  --deployment production \
  --publishDir output/runtime-evidence
```

`--daily` selects the latest complete 21:00–21:00 Moscow-time window. You can
also set `--startTime` and `--endTime`, or use `--hours` for a trailing window.
The bundle contains recorded decisions and version metadata, plus a manifest
and checksums for integrity verification.

These records can contain sensitive operational information. Restrict access,
exclude credentials, and do not commit them to the application repository.

## Transfer and Verify a Record

To analyze a record in another project environment:

```bash
npx @tradejs/cli runtime-evidence-sync \
  --source user@runtime-host:/path/to/ready/production \
  --deployment production
```

The command verifies the manifest and payload hashes before storing the bundle.
Use the project revision with strategy and runtime package versions matching the
record. Do not edit the record to work around a mismatch.

## Replay the Recorded Setup

```bash
npx @tradejs/cli replay \
  --user root \
  --runtimeEvidence <bundle>/runtime-evidence.json \
  --startTime <ms> \
  --endTime <ms> \
  --cacheOnly
```

Then create a comparison input from the replay result and live record:

```bash
npx @tradejs/cli replay-runtime-evidence \
  --runtimeEvidence <bundle>/runtime-evidence.json \
  --startTime <ms> \
  --endTime <ms> \
  --out output/replay-runtime-evidence.json
```

Use `--replayKey` if several replay results cover the same window.

## Compare Execution

Execution calibration compares signal time, market arrival, and fills with the
reconstructed decisions:

```bash
npx @tradejs/cli execution-calibration \
  --runtimeEvidence <bundle>/runtime-evidence.json \
  --replayEvidence output/replay-runtime-evidence.json \
  --out output/execution-calibration.json
```

`runtime-scorecard` combines the live record, replay comparison, and execution
calibration into JSON and Markdown diagnostics. Use the report to investigate
data gaps, configuration or version differences, gate decisions, timing drift,
rejections, and fill quality.

For a quicker entry-only comparison, see
[Compare live and replayed entries](./runtime-parity).
For the live evaluation lifecycle, see [How signals work](../execution/signals).
