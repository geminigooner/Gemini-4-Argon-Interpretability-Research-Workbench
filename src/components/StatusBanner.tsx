import React from 'react';
import { Info, ExternalLink, ShieldCheck } from 'lucide-react';

interface StatusBannerProps {
  hasApiKey: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ hasApiKey }) => {
  return (
    <div className="border-b border-indigo-950/60 bg-gradient-to-r from-slate-950 via-[#0a0f24] to-slate-950 px-4 py-2 text-xs text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>
            <strong className="text-slate-100 font-medium">Epistemic Protocol:</strong> Observed behavioral responses and latency are measured directly. Internal MoE router activations and raw weights are inaccessible via public API endpoints and labeled explicitly as conceptual simulations.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="/assets/aistudio/Gemini_4_Argon_9c6bfecf.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <span>Source Whitepaper (PDF)</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">
            {hasApiKey ? 'Model: Live Backend Proxy' : 'Model: Standalone Test Harness'}
          </span>
        </div>
      </div>
    </div>
  );
};
