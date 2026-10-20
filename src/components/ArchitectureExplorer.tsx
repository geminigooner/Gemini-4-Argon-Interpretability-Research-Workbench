import React, { useState } from 'react';
import {
  Cpu,
  Sliders,
  Layers,
  ArrowRight,
  Info,
  ShieldAlert,
  Sparkles,
  Zap,
  Volume2,
  Eye,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { ThinkingLevel } from '../types/workbench';

export const ArchitectureExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'moe' | 'context' | 'audio' | 'physics'>('moe');
  const [thinkingLevel, setThinkingLevel] = useState<ThinkingLevel>('HIGH');
  const [contextTokens, setContextTokens] = useState<number>(262144); // 256k tokens
  const [selectedExperts, setSelectedExperts] = useState<number[]>([1, 4]);
  const [activeModality, setActiveModality] = useState<'text' | 'image' | 'audio' | 'video'>('text');

  const simulatedExperts = [
    { id: 1, name: 'Symbolic & Math Reasoning', domain: 'Formal Logic, Equations, Vector Math', activeWeight: '84.2%' },
    { id: 2, name: 'Spatial & Physics Simulation', domain: 'Kinematics, 3D Geometry, Trajectory', activeWeight: '12.6%' },
    { id: 3, name: 'Audio Perception & Prosody', domain: 'Acoustic Events, Pitch, Timing Invariants', activeWeight: '3.1%' },
    { id: 4, name: 'Long-Horizon Narrative & State', domain: 'Document Memory, Cross-Chapter Coherence', activeWeight: '71.5%' },
    { id: 5, name: 'Multimodal Feature Binding', domain: 'Image-Text Alignment, Cross-Modal Invariance', activeWeight: '45.0%' },
    { id: 6, name: 'Safety & Behavioral Boundaries', domain: 'Harm Prevention, Policy Adherence, Refusal', activeWeight: '8.4%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Epistemic Verification Notice */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1020]/90 p-5 sm:p-6 backdrop-blur-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>ARCHITECTURE MODEL</span>
              <span>·</span>
              <span>OCTOBER 2026 SPECIFICATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Interactive Architecture Explorer
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-3xl">
              Inspects Gemini 4 Argon&apos;s verified structural properties alongside theoretical mechanisms of conditional computation, sparse MoE routing, and multimodal reasoning.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Simulated Routing Topology (Weights Inaccessible)</span>
          </div>
        </div>

        {/* Epistemic disclaimer box */}
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-100 font-semibold">Epistemic Boundary:</strong> Google&apos;s published model card verifies that Argon utilizes a large-scale, sparse mixture-of-experts (MoE) transformer with native multimodal support, 1,048,576 token context, and 1M decoding. Specific expert cluster counts, router dispatch weights, and intermediate activations are black-boxed in production inference and are modeled below as a conceptual research simulation.
          </div>
        </div>
      </div>

      {/* Focus Area Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('moe')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'moe'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Sparse MoE Routing Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('context')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'context'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>1M Context vs Long Decoding</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'audio'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Volume2 className="h-4 w-4" />
          <span>Audio: Perception vs Synthesis</span>
        </button>

        <button
          onClick={() => setActiveTab('physics')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'physics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Physical Simulation Pipeline</span>
        </button>
      </div>

      {/* Tab 1: Sparse MoE Routing Engine */}
      {activeTab === 'moe' && (
        <div className="space-y-6">
          {/* Interactive Simulation Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-800 bg-[#0c1224]">
            {/* Modality Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Input Modality Pathway
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['text', 'image', 'audio', 'video'] as const).map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setActiveModality(mod)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeModality === mod
                        ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/50'
                        : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {mod.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Thinking Level */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Thinking Level (Argon Param)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['LOW', 'MEDIUM', 'HIGH'] as ThinkingLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setThinkingLevel(lvl)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      thinkingLevel === lvl
                        ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/50'
                        : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Subnetwork Router Simulation */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Router Sparsity Dispatch
              </label>
              <div className="text-xs text-slate-300 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Top-K Experts:</span>
                  <span className="text-indigo-300 font-bold">2 of 6 Selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Conditional Activation:</span>
                  <span className="text-emerald-400 font-bold">~33.3% Compute Floor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Routing Diagram */}
          <div className="rounded-xl border border-slate-800 bg-[#090d1c] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase font-mono">
                Conditional Token Flow & Gating Topology
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Mode: {activeModality.toUpperCase()} · Thinking: {thinkingLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Step 1: Input Tokens */}
              <div className="md:col-span-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  01. Input Stage
                </div>
                <div className="text-sm font-bold text-slate-100">Multimodal Embeddings</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Raw input tokens ({activeModality}) projected into a unified representation space.
                </p>
                <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300">
                  d_model = unified_latent_dim
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center md:col-span-1 text-slate-600">
                <ArrowRight className="h-6 w-6 text-indigo-400" />
              </div>

              {/* Step 2: Sparse Gating Router */}
              <div className="md:col-span-4 rounded-lg border border-indigo-500/40 bg-indigo-950/20 p-4 space-y-2">
                <div className="text-xs font-mono text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                  <span>02. Sparse MoE Router</span>
                  <span className="text-emerald-400">Softmax Gating</span>
                </div>
                <div className="text-sm font-bold text-slate-100">Top-K Conditional Router</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Computes probability distribution over available experts based on input features and context state.
                </p>
                <div className="p-2 rounded bg-slate-950/80 font-mono text-[11px] text-indigo-200">
                  G(x) = Softmax(TopK(H · W_gate))
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center md:col-span-1 text-slate-600">
                <ArrowRight className="h-6 w-6 text-indigo-400" />
              </div>

              {/* Step 3: Long Decoding */}
              <div className="md:col-span-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  03. Output Stage
                </div>
                <div className="text-sm font-bold text-slate-100">Long Decoding Engine</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Autoregressive generation sustained up to 1,000,000 output tokens.
                </p>
                <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-emerald-400">
                  Max: 1,048,576 tokens
                </div>
              </div>
            </div>

            {/* Subnetwork Grid */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Simulated Expert Subnetworks (Click to Toggle Gating State)
                </div>
                <span className="text-xs text-amber-400/90 font-mono">
                  [Conceptual Model · Unverified Weights]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {simulatedExperts.map((exp) => {
                  const isSelected = selectedExperts.includes(exp.id);
                  return (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setSelectedExperts((prev) =>
                          prev.includes(exp.id)
                            ? prev.filter((id) => id !== exp.id)
                            : [...prev, exp.id]
                        );
                      }}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500/60 bg-indigo-950/30'
                          : 'border-slate-800 bg-slate-900/40 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono text-indigo-400 font-semibold">
                          Expert {exp.id}
                        </span>
                        <span
                          className={`text-xs font-mono font-medium ${
                            isSelected ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {isSelected ? 'GATED ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-100">{exp.name}</div>
                      <p className="text-xs text-slate-400 mt-1">{exp.domain}</p>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">Simulated Weight:</span>
                        <span className="text-indigo-300 tabular-nums">{exp.activeWeight}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 1M Context vs Long Decoding */}
      {activeTab === 'context' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-6 space-y-4">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Dimension A: Input Capacity
            </div>
            <h2 className="text-lg font-bold text-slate-100">1,048,576 Token Unified Context</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Argon&apos;s context window accommodates over one million tokens encompassing text, audio spectrograms, high-resolution imagery, and video frames simultaneously.
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Context Simulation:</span>
                <span className="text-indigo-300 font-semibold tabular-nums">
                  {contextTokens.toLocaleString()} tokens
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="1048576"
                step="8192"
                value={contextTokens}
                onChange={(e) => setContextTokens(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>1K</span>
                <span>256K</span>
                <span>512K</span>
                <span>1,048,576</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Enables cross-document contradiction checks without aggressive retrieval truncation.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Retains full video trajectories and complex engineering schematics in memory.</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-6 space-y-4">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Dimension B: Generation Capacity
            </div>
            <h2 className="text-lg font-bold text-slate-100">Long Decoding Up to 1M Tokens</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike models with large context windows that restrict output length to 8k or 16k tokens, Argon supports continuous long decoding up to 1M tokens for exhaustive derivations.
            </p>

            <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-3">
              <div className="text-xs font-mono text-indigo-300 font-semibold uppercase">
                The Critical Distinction
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Context window governs how much information is available to a single request; long decoding enables the model to sustain lengthy multi-step computation and generate massive codebases, book-length proofs, or complex simulations in a single run.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 space-y-2 font-mono text-xs">
              <div className="text-slate-400 uppercase text-[11px]">Thinking Levels Available</div>
              <div className="flex items-center justify-between text-slate-300">
                <span>LOW:</span>
                <span className="text-slate-400">Latency-optimized / minimal reasoning tokens</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>MEDIUM:</span>
                <span className="text-slate-400">Balanced reasoning depth and responsiveness</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>HIGH:</span>
                <span className="text-indigo-300 font-semibold">Exhaustive STEM & formal proof reasoning</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audio Perception vs Synthesis */}
      {activeTab === 'audio' && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-6 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Section 3 Analysis
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              The Three Distinct Audio Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clarifying the separation between Argon&apos;s documented multimodal input capabilities and external Google speech synthesis platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Capability 1
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300">
                  Supported on Argon
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">Audio Perception</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Directly processing speech, pitch contours, prosodic pauses, background acoustics, and music. Extracts rich non-verbal nuances discarded by plain transcripts.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Capability 2
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300">
                  Supported on Argon
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">Audio-Conditioned Reasoning</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connecting acoustic evidence to contextual problem solving, spatial timing, and cross-modal reasoning across parallel video and text streams.
              </p>
            </div>

            <div className="rounded-lg border border-rose-500/30 bg-rose-950/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-rose-400 uppercase font-semibold">
                  Capability 3
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-900/40 text-rose-300">
                  Not Supported on Argon
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">Audio Synthesis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Producing speech signals or acoustic performances. Documented API endpoints restrict Argon output to text. Handled by separate Google Audio / TTS platforms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Physical Simulation Pipeline */}
      {activeTab === 'physics' && (
        <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-6 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Section 5 Analysis
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              Representation-to-Action Robotics Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Reconstructing the 5-stage transformation demonstrated in Google&apos;s physical cornhole robotics trial (7 consecutive successful shots).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'Perception', desc: 'Raw visual video frames of human toss motion', icon: Eye },
              { step: '02', title: 'Spatial Abstraction', desc: 'Inferring 3D coordinates, board distance, angle', icon: Sliders },
              { step: '03', title: 'Physical Modeling', desc: 'Parabolic gravity kinematics, release arc, drag', icon: Layers },
              { step: '04', title: 'Simulation', desc: 'Virtual simulation trial and parameter optimization', icon: Sparkles },
              { step: '05', title: 'Action', desc: 'Translating parameters to physical robotic motor actuators', icon: Zap },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={p.step} className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400 font-semibold">{p.step}</span>
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-100">{p.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-slate-100 font-semibold">Interpretability Research Value:</strong> The critical scientific question is not whether the robot scored 7 shots, but whether the model learned an abstract, generalizable physical representation of kinematics, or merely fitted a narrow trajectory curve to that specific demonstration.
          </div>
        </div>
      )}
    </div>
  );
};
