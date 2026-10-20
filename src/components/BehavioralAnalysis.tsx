import React, { useState } from 'react';
import { ComparisonRun } from '../types/workbench';
import {
  BarChart3,
  Layers,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  BookmarkPlus,
  Scale,
} from 'lucide-react';

interface BehavioralAnalysisProps {
  currentRun: ComparisonRun | null;
  onSaveAnalysisToNotebook: (run: ComparisonRun, notes: string) => void;
  onSwitchToWorkbench: () => void;
}

export const BehavioralAnalysis: React.FC<BehavioralAnalysisProps> = ({
  currentRun,
  onSaveAnalysisToNotebook,
  onSwitchToWorkbench,
}) => {
  const [analystNotes, setAnalystNotes] = useState('');
  const [saved, setSaved] = useState(false);

  if (!currentRun) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0b1020]/90 p-12 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
          <Scale className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-100">No Experimental Run Selected</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Execute a dual-condition trial in the Experiment Workbench to inspect behavioral divergence, latency variance, and reasoning faithfulness.
          </p>
        </div>
        <button
          onClick={onSwitchToWorkbench}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
        >
          <span>Open Experiment Workbench</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const { trialA, trialB } = currentRun;

  // Quantitative observable measurements
  const wordsA = trialA.response.trim().split(/\s+/).filter(Boolean).length;
  const wordsB = trialB.response.trim().split(/\s+/).filter(Boolean).length;
  const lengthDelta = wordsB - wordsA;
  const latencyDelta = trialB.latencyMs - trialA.latencyMs;

  // Observable lexical markers
  const reasoningKeywords = ['step', 'because', 'therefore', 'analysis', 'variance', 'hypothesis', 'derive', 'calculate'];
  const countMarkers = (text: string) => {
    const lower = text.toLowerCase();
    return reasoningKeywords.reduce((acc, kw) => {
      const matches = lower.match(new RegExp(`\\b${kw}\\b`, 'g'));
      return acc + (matches ? matches.length : 0);
    }, 0);
  };

  const markersA = countMarkers(trialA.response);
  const markersB = countMarkers(trialB.response);

  // Certainty / Hedging indicators
  const hedgingWords = ['perhaps', 'possibly', 'might', 'may', 'could', 'unclear', 'likely'];
  const countHedging = (text: string) => {
    const lower = text.toLowerCase();
    return hedgingWords.reduce((acc, kw) => {
      const matches = lower.match(new RegExp(`\\b${kw}\\b`, 'g'));
      return acc + (matches ? matches.length : 0);
    }, 0);
  };

  const hedgingA = countHedging(trialA.response);
  const hedgingB = countHedging(trialB.response);

  const handleSaveNotes = () => {
    onSaveAnalysisToNotebook(currentRun, analystNotes);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1020]/90 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>BEHAVIORAL INTERPRETABILITY</span>
              <span>·</span>
              <span>OBSERVABLE SIGNALS & AUDIT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Behavioral & Output Divergence Analysis
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-3xl">
              Inspects measured structural, acoustic, and logical differences across conditions while strictly separating direct measurements from inferred internal reasoning.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Trial ID:</span>
            <span className="text-indigo-300">{currentRun.id}</span>
          </div>
        </div>
      </div>

      {/* Epistemic Honesty Alert */}
      <div className="rounded-xl border border-indigo-900/50 bg-[#0d142d] p-4 text-xs text-slate-300 flex items-start gap-3">
        <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-semibold text-slate-100">
            Mandatory Epistemic Rule (Section 6 & 7):
          </div>
          <div>
            Generated text is an observable behavioral response, <strong>not direct evidence of the model&apos;s internal chain of thought</strong>. As documented in Google&apos;s October 13 safety report, models can verbalize one reasoning path while silently taking unstated shortcuts (which jumped from 11% to 36.4% under CoT penalties).
          </div>
        </div>
      </div>

      {/* Metrics Strip: Direct Observable Measurements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Word Count Delta */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Observable Word Delta</div>
          <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
            {lengthDelta > 0 ? `+${lengthDelta}` : lengthDelta}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {wordsA} (A) vs {wordsB} (B)
          </div>
        </div>

        {/* Metric 2: Measured Latency Delta */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Execution Latency Delta</div>
          <div className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
            {latencyDelta > 0 ? `+${latencyDelta}` : latencyDelta} ms
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {trialA.latencyMs}ms vs {trialB.latencyMs}ms
          </div>
        </div>

        {/* Metric 3: Reasoning Step Count */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Reasoning Step Tokens</div>
          <div className="text-2xl font-mono font-bold text-indigo-300 tabular-nums">
            {markersA} vs {markersB}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {markersA > markersB ? 'Condition A more explicit' : markersA === markersB ? 'Equal density' : 'Condition B more explicit'}
          </div>
        </div>

        {/* Metric 4: Hedging Marker Density */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c] space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Hedging & Uncertainty</div>
          <div className="text-2xl font-mono font-bold text-purple-300 tabular-nums">
            {hedgingA} vs {hedgingB}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Instances of uncertainty terms
          </div>
        </div>
      </div>

      {/* Side-by-Side Response Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition A Detail */}
        <div className="rounded-xl border border-slate-800 bg-[#090e1c] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-semibold text-indigo-400">
                CONDITION A: {trialA.conditionLabel}
              </span>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Model: {trialA.model} · Thinking: {trialA.thinkingLevel || 'MEDIUM'}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500">{trialA.latencyMs} ms</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-900">
            {trialA.response}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Refusal Detected:</span>
              <span className={trialA.refusalDetected ? 'text-rose-400' : 'text-emerald-400'}>
                {trialA.refusalDetected ? 'YES' : 'NONE'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Explicit CoT:</span>
              <span className={trialA.hasReasoningMarkers ? 'text-indigo-300' : 'text-slate-500'}>
                {trialA.hasReasoningMarkers ? 'DETECTED' : 'UNSTATED'}
              </span>
            </div>
          </div>
        </div>

        {/* Condition B Detail */}
        <div className="rounded-xl border border-slate-800 bg-[#090e1c] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-semibold text-purple-400">
                CONDITION B: {trialB.conditionLabel}
              </span>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Model: {trialB.model} · Thinking: {trialB.thinkingLevel || 'MEDIUM'}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500">{trialB.latencyMs} ms</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-900">
            {trialB.response}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Refusal Detected:</span>
              <span className={trialB.refusalDetected ? 'text-rose-400' : 'text-emerald-400'}>
                {trialB.refusalDetected ? 'YES' : 'NONE'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Explicit CoT:</span>
              <span className={trialB.hasReasoningMarkers ? 'text-indigo-300' : 'text-slate-500'}>
                {trialB.hasReasoningMarkers ? 'DETECTED' : 'UNSTATED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Synthesis & Notes */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1224] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-400">
            Researcher Observations & Provenance Log
          </div>
          <button
            onClick={handleSaveNotes}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span>Saved to Notebook</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="h-3.5 w-3.5" />
                <span>Attach to Research Notebook</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={3}
          value={analystNotes}
          onChange={(e) => setAnalystNotes(e.target.value)}
          placeholder="Record observed divergences, hypothesis support, or notable failure modes..."
          className="w-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};
