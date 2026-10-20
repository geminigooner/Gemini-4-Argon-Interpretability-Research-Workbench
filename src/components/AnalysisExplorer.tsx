import React, { useState, useMemo } from 'react';
import { ARGON_CLAIMS, ARGON_PAPER_METADATA } from '../data/argonAnalysisData';
import { ClaimRecord, EpistemicStatus } from '../types/workbench';
import {
  Search,
  Filter,
  FileText,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AnalysisExplorerProps {
  onLaunchExperiment: (protocolId: 'cross_modal' | 'context_shift' | 'cot_faithfulness') => void;
}

export const AnalysisExplorer: React.FC<AnalysisExplorerProps> = ({ onLaunchExperiment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<number | 'all'>('all');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>('claim-1');
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const statusConfig: Record<
    EpistemicStatus,
    { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    documented_feature: {
      label: 'Documented Architectural Feature',
      icon: CheckCircle2,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    },
    empirical_observation: {
      label: 'Empirical Observation',
      icon: Layers,
      color: 'text-indigo-300 border-indigo-500/30 bg-indigo-950/20',
    },
    interpretation: {
      label: 'Analytical Interpretation',
      icon: Sparkles,
      color: 'text-purple-300 border-purple-500/30 bg-purple-950/20',
    },
    untested_hypothesis: {
      label: 'Untested Research Hypothesis',
      icon: HelpCircle,
      color: 'text-amber-300 border-amber-500/30 bg-amber-950/20',
    },
    proposed_experiment: {
      label: 'Proposed Experimental Protocol',
      icon: FlaskConical,
      color: 'text-cyan-300 border-cyan-500/30 bg-cyan-950/20',
    },
  };

  const sections = [
    { num: 1, title: 'Sparse MoE Architecture' },
    { num: 2, title: 'Unified Multimodal Model' },
    { num: 3, title: 'Audio Capabilities Distinction' },
    { num: 4, title: 'Long-Horizon Reasoning' },
    { num: 5, title: 'Physical-World Reasoning' },
    { num: 6, title: 'Reasoning-Monitoring & CoT' },
    { num: 7, title: 'Proposed Experimental Protocols' },
    { num: 8, title: 'Bottom Line & Synthesis' },
  ];

  const filteredClaims = useMemo(() => {
    return ARGON_CLAIMS.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'all' || c.epistemicStatus === selectedStatus;
      const matchesSection = selectedSection === 'all' || c.section === selectedSection;

      return matchesSearch && matchesStatus && matchesSection;
    });
  }, [searchQuery, selectedStatus, selectedSection]);

  const epistemicCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ARGON_CLAIMS.length };
    ARGON_CLAIMS.forEach((c) => {
      counts[c.epistemicStatus] = (counts[c.epistemicStatus] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Source Paper Context */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1020]/90 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>SOURCE WHITEPAPER</span>
              <span>·</span>
              <span>GOOGLE GEMINI 4 ARGON (OCTOBER 13, 2026)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Analysis Explorer & Epistemic Taxonomy
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-3xl">
              Deconstructs the Gemini 4 Argon analysis into verified architectural specifications, empirical safety observations, theoretical interpretations, and proposed protocols.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowPdfViewer(!showPdfViewer)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>{showPdfViewer ? 'Hide PDF Document' : 'View Source PDF'}</span>
            </button>
            <a
              href={ARGON_PAPER_METADATA.sourceFile}
              download="Gemini_4_Argon_9c6bfecf.pdf"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Raw PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF toggle viewer */}
        {showPdfViewer && (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80 text-xs text-slate-400 font-mono">
              <span>DOCUMENT VIEWER: /public/assets/aistudio/Gemini_4_Argon_9c6bfecf.pdf</span>
              <button
                onClick={() => setShowPdfViewer(false)}
                className="hover:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="h-[550px] w-full">
              <iframe
                src={ARGON_PAPER_METADATA.sourceFile}
                className="h-full w-full border-none"
                title="Gemini 4 Argon Source Whitepaper"
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter and Query Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims, evidence, quotes, or keywords..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Section filter */}
        <div className="md:col-span-6 flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Paper Sections (1–8)</option>
            {sections.map((s) => (
              <option key={s.num} value={s.num}>
                Section {s.num}: {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Epistemic Status Segmented Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/70 border border-slate-800/80 rounded-lg">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          All Claims ({epistemicCounts.all})
        </button>
        {Object.entries(statusConfig).map(([statusKey, config]) => {
          const count = epistemicCounts[statusKey] || 0;
          const isActive = selectedStatus === statusKey;
          return (
            <button
              key={statusKey}
              onClick={() => setSelectedStatus(statusKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{config.label}</span>
              <span className="font-mono text-[11px] text-slate-500">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {filteredClaims.length === 0 ? (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-8 text-center text-slate-400">
            <p className="text-sm">No analysis claims match your current filter parameters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedSection('all');
              }}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredClaims.map((claim) => {
            const isExpanded = expandedClaimId === claim.id;
            const statusInfo = statusConfig[claim.epistemicStatus];
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={claim.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-indigo-500/40 bg-[#0d1428]'
                    : 'border-slate-800/80 bg-[#090e1a]/80 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="text-indigo-400 font-semibold">Section {claim.section}</span>
                      <span aria-hidden="true">·</span>
                      <span>Page {claim.page}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300">{statusInfo.label}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight">
                      {claim.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {claim.claim}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <StatusIcon className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 p-4 sm:p-6 space-y-5 bg-slate-950/40">
                    {/* Source Quote */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Source Quote (Page {claim.page})</span>
                      </div>
                      <blockquote className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-4 text-xs sm:text-sm italic text-slate-200 leading-relaxed">
                        &ldquo;{claim.sourceQuote}&rdquo;
                      </blockquote>
                    </div>

                    {/* Evidence & Limitations Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-1.5">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                          Supporting Evidence
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {claim.supportingEvidence}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-1.5">
                        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                          Epistemic Limitations
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {claim.limitations}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Experiment Trigger Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                        <span>Tags:</span>
                        {claim.tags.map((tag) => (
                          <span key={tag} className="text-indigo-300">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {claim.suggestedProtocolId && (
                        <button
                          onClick={() => onLaunchExperiment(claim.suggestedProtocolId!)}
                          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-100 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <FlaskConical className="h-3.5 w-3.5" />
                          <span>Test in Experiment Workbench</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
