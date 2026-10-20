# Gemini 4 Argon Interpretability Research Workbench

An evidence-grounded, interactive research environment and experimental workbench based directly on the October 2026 Gemini 4 Argon architectural analysis. It translates documented model characteristics, empirical safety findings, and proposed interpretability experiments into an interactive laboratory workbench without fabricating inaccessible internal telemetry.

## User Review & Critical Decisions

> [!IMPORTANT]
> The workbench strictly adheres to scientific epistemic honesty: all documented properties (sparse MoE transformer, 1M context, 1M decoding, CoT RL shortcut shifts, physical-world simulation) are grounded in the October 13, 2026 model card and safety report. Because internal MoE router activations and weights are inaccessible in production API endpoints, all architectural routing visualizers are labeled explicitly as theoretical simulations, and unavailable telemetry is displayed as unavailable rather than simulated or fabricated.

- **Confirmed Decision 1 (Scope & Structure)**: 5 modular workspaces:
  1. *Analysis Explorer* (epistemic categorization of claims, observations, evidence, and limitations).
  2. *Interactive Architecture Explorer* (sparse MoE, routing topology, unified multimodal pipeline, and 1M token context/decoding specs).
  3. *Experiment Workbench* (3 core protocols: Cross-Modal Transfer, Context Shift & Routing, and CoT Faithfulness & Shortcut Analysis).
  4. *Interpretability & Behavioral Analysis* (side-by-side comparative inspector, output divergence metrics, and refusal/shortcut tracking).
  5. *Research Notebook* (provenance logs, hypothesis recording, observation tagging, and full JSON/CSV export).
- **Confirmed Decision 2 (Live API & Honest Telemetry)**: Full-stack Node/Express backend (`server.ts`) proxying live `@google/genai` calls with user-selected model (`gemini-3.8-flash`, `gemini-4-argon`), configurable thinking levels (`LOW`, `MEDIUM`, `HIGH`), real measured latency, and explicit labeling of observable outputs vs. simulated conceptual architectures.
- **Confirmed Decision 3 (Aesthetic & System Tone)**: Dark navy and violet laboratory aesthetic (`#070B14`, `#0D1322`, `#161F38`, `#6366F1`, `#A5B4FC`) following the Universal Frontend Design Constitution (60-30-10 palette, zero-pill discipline, tabular numerals, and responsive split console).

---

## 1. Overview & Core Concept

- **What It Does**: Provides AI researchers, safety evaluators, and interpretability analysts with an interactive laboratory environment to study Gemini 4 Argon's documented capabilities, run structured cross-modal and context-shift experiments, track chain-of-thought faithfulness, and log empirical findings with full provenance.
- **Target Audience / Persona**: AI interpretability researchers, senior model evaluators, fraud and behavioral analysts, and cognitive systems engineers investigating large-scale sparse MoE models.
- **Key Value**: Bridges the gap between qualitative research reading and rigorous empirical verification, enforcing strict boundaries between observed behavior, theoretical interpretation, and speculative hypothesis.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Explore Documented vs. Hypothetical Claims**: Users browse the *Analysis Explorer* to filter the source paper's 8 core sections by epistemic status (`Documented Architectural Feature`, `Empirical Observation`, `Interpretation`, `Proposed Experiment`). Expanding any claim reveals its supporting citations, methodology, and limitations.
2. **Inspect Architectural Routing**: Users navigate the *Interactive Architecture Explorer* to trace token flows through the input projection layer, sparse MoE router, activated expert subnetworks, and long decoding stage. Toggle between documented facts and hypothesized specialization.
3. **Run Controlled Behavioral Experiments**:
   - **Protocol A (Cross-Modal Transfer)**: Evaluate identical problem logic across text, visual diagrams, and temporal descriptions.
   - **Protocol B (Context-Conditioned Behavior)**: Compare model reasoning across neutral, high-stress/adversarial, technical, and long-horizon dialog frames.
   - **Protocol C (CoT Faithfulness & Shortcut Audit)**: Test the reported 11% → 36.4% silent shortcut phenomenon from Google's safety report by evaluating whether explicit explanations faithfully mirror final decisions.
4. **Side-by-Side Comparator**: Inspect two model generations side by side with real measured latency, token statistics, and difference highlighting.
5. **Log & Export Findings**: Save experimental trials to the *Research Notebook*, tag hypotheses, record empirical observations, and export the complete session as structured JSON or CSV.

### Visual Identity & Theme
- **Color Palette & Mood**:
  - *Dominant Canvas (60%)*: Deep Obsidian Navy (`#060913`, `#0A0E1A`).
  - *Structural Surfaces (30%)*: Translucent dark slate & violet panels (`#0F172A`/80, `#131B30`), 1px hairline borders (`#1E293B`, `#2E3A59`).
  - *Accent Budget (10%)*: Restrained laboratory violet (`#6366F1`, `#818CF8`) and soft lavender highlights (`#C7D2FE`). Semantic status indicators: Emerald for empirical observations, Amber for interpretations, Sky for proposed protocols.
- **Typography & Precision Layout**:
  - *Primary Display & UI*: `Plus Jakarta Sans` / clean neo-grotesque for editorial headers and navigation.
  - *Data & Telemetry*: Tabular monospace (`font-mono tabular-nums`) for latency, token counts, timestamps, and parameters.
  - *Anti-Slop Discipline*: Zero static pill tags (clean unboxed typographic metadata with `·` separators), no decorative pulsing dots, no fake status tickers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini API Proxy with Express**
  - *Chosen Approach*: Mount Express server in `server.ts` with Vite middlewares in development. Proxy all `@google/genai` calls server-side with standard environment secrets (`GEMINI_API_KEY`).
  - *Why*: Strict security (never exposes API keys to client code or logs) and compliance with the `@google/genai` server-side mandate.
  - *Alternatives Considered*: Client-side SDK calls (strictly prohibited by security standards).
- **Decision 2: Epistemic Honesty & Honest Telemetry**
  - *Chosen Approach*: Directly measure and display real API latency, response length, and candidate text. For internal MoE routing and hidden expert activations, render clearly watermarked *conceptual simulations* with an explicit banner: `Conceptual Architecture Model — Internal weights inaccessible via public API`.
  - *Why*: Respects scientific integrity and prevents researchers from confusing simulated visualizations with ground-truth weights.
- **Decision 3: Local Storage & Dual-Format Export (JSON / CSV)**
  - *Chosen Approach*: Persist notebook records, custom test cases, and trial history in client `localStorage` with export capabilities to standard JSON and RFC-4180 CSV formats.
  - *Why*: Instant client-side persistence without external database overhead, fully portable for external data analysis (Python, R, Pandas).

---

## 4. Technical Architecture & Data Strategy

### System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React 19 + Vite)                      │
│                                                                        │
│  ┌─────────────────────── Top Navigation Bar ───────────────────────┐  │
│  │ [Argon Interpretability Lab]  ·  Explorer | Arch | Workbench ... │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  │                                     │
│  ┌───────────────────────────────┴──────────────────────────────────┐  │
│  │ Active Workspace View                                            │  │
│  │  ├─ Analysis Explorer (Epistemic Taxonomy & Paper Knowledge Base)│  │
│  │  ├─ Architecture Explorer (MoE Router & Multimodal Stage Model)  │  │
│  │  ├─ Experiment Workbench (Cross-Modal, Context, CoT Faithfulness)│  │
│  │  ├─ Interpretability & Comparison Inspector                      │  │
│  │  └─ Research Notebook & Provenance Ledger                        │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
│                                  │ POST /api/gemini/run-trial          │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                       Backend Server (server.ts)                       │
│                                                                        │
│  ┌──────────────────────── Express Router ──────────────────────────┐  │
│  │  POST /api/gemini/run-trial  ───► GoogleGenAI SDK                │  │
│  │  GET  /api/health            ───► API Key & Model Status Check   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  │                                     │
│  ┌───────────────────────────────▼──────────────────────────────────┐  │
│  │ Google GenAI API (gemini-3.8-flash / gemini-4-argon)             │  │
│  │ Config: ThinkingLevel, Temperature, TopP, Modalities             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
- **`ClaimRecord`**: `id`, `sectionNumber`, `title`, `epistemicStatus` ('documented_feature' | 'empirical_observation' | 'interpretation' | 'untested_hypothesis' | 'proposed_experiment'), `summary`, `evidence`, `limitations`, `sourcePage`.
- **`ExperimentConfig`**: `id`, `protocol` ('cross_modal' | 'context_shift' | 'cot_faithfulness'), `name`, `model`, `thinkingLevel` ('LOW' | 'MEDIUM' | 'HIGH'), `temperature`, `conditionA`, `conditionB`, `inputs`.
- **`TrialResult`**: `id`, `configId`, `timestamp`, `condition`, `prompt`, `response`, `latencyMs`, `tokensEstimated`, `refusalDetected`, `shortcutIndicators`, `isSimulatedTelemetry`.
- **`NotebookEntry`**: `id`, `timestamp`, `title`, `hypothesis`, `linkedTrialIds`, `observations`, `limitations`, `tags`.
