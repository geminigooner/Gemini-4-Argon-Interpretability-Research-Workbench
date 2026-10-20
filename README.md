# Gemini 4 Argon Interpretability Research Workbench

An interactive workbench for designing and documenting controlled evaluations of Gemini 4 Argon’s observable behavior.

> **Status:** Initial implementation; end-to-end validation and experimental results are pending.

## Overview

The workbench brings research notes, experiment setup, response comparison, and result export into one interface. It is designed to help distinguish documented capabilities, measured behavior, interpretations, and hypotheses.

## Features

- **Analysis Explorer** — browse structured claims, source excerpts, citations, and limitations.
- **Architecture Explorer** — explore a conceptual sparse Mixture-of-Experts (MoE) diagram. Internal routing details are not presented as measured telemetry.
- **Experiment Workbench** — compare baseline and perturbed prompts using the available model endpoints.
- **Behavioral Analysis** — inspect response differences and observable indicators such as length, latency, refusals, and uncertainty language.
- **Research Notebook** — record observations, hypotheses, limitations, and experiment provenance.
- **Export** — download research records as JSON or CSV.
- **Server-side API proxy** — route model requests through the backend so the API key does not need to be exposed in browser code.

Feature availability and model access depend on the current implementation and API credentials. Verify live requests before relying on experimental output.

## Research Directions

The workbench is organized around three proposed protocols:

1. **Cross-modal transfer:** compare equivalent tasks presented through supported input modalities.
2. **Context shift:** test whether changing the surrounding context changes responses to the same underlying task.
3. **Shortcut and explanation audit:** examine observable answer patterns against a predefined evaluation rubric.

These are proposed experiments, not completed findings. The first pilot should use fixed prompts, predefined scoring criteria, repeated trials where feasible, and saved configuration details.

## Evidence and Limitations

- Public API outputs support behavioral evaluation; they do not, by themselves, reveal hidden representations, expert activations, or routing decisions.
- MoE architecture diagrams are conceptual unless backed by direct, documented instrumentation.
- Generated explanations are not treated as verified records of internal computation.
- Metrics such as response length and latency are observable indicators, not proof of a specific internal mechanism.
- Company-reported demonstrations and safety-report figures must be checked against their original sources before being described as independently reproduced results.
- No experimental result should be claimed until the corresponding trial has actually been run and its records reviewed.

## Getting Started

### Requirements

- Node.js and npm
- A Gemini API key with access to the model(s) you intend to test

### Install

```bash
npm install
```

### Configure the environment

Create a local `.env` file based on `.env.example` and add the required API key variable used by `server.ts`.

```bash
# Example only — use the exact variable name required by .env.example
GEMINI_API_KEY=your_api_key_here
```

Do not commit `.env` or publish API keys. Keep credentials on the server, not in client-side code.

### Run

```bash
npm run dev
```

Check `package.json` for the available scripts and `server.ts` / `.env.example` for the exact server configuration. Confirm the app starts and that a live model request succeeds before running an experiment.

## Research Roadmap

- [ ] Verify model and endpoint access, supported modalities, and returned metadata.
- [ ] Check primary sources for the Argon model details and any reported safety or robotics results used in the analysis.
- [ ] Finalize the research question, matched prompts, scoring rubric, and controls.
- [ ] Run and document a small pilot for one protocol.
- [ ] Verify response logging, latency measurements, and JSON/CSV exports.
- [ ] Review results and limitations before publishing findings.

## References

- [Gemini 4 Argon model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-4-argon)
- [What's new in Gemini 4 Argon](https://ai.google.dev/gemini-api/docs/latest-model)

Add further primary sources only after verifying the exact report, date, figures, and relevant context.

## License

No license is specified here. Add a `LICENSE` file if you intend to define reuse permissions.