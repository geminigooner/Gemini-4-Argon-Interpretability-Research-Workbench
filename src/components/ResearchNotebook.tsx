import React, { useState } from 'react';
import { NotebookEntry, EpistemicStatus } from '../types/workbench';
import {
  BookOpen,
  Plus,
  Trash2,
  Download,
  Calendar,
  Tag,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResearchNotebookProps {
  entries: NotebookEntry[];
  onAddEntry: (entry: Omit<NotebookEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  onExportJson: () => void;
  onExportCsv: () => void;
}

export const ResearchNotebook: React.FC<ResearchNotebookProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  onExportJson,
  onExportCsv,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // New entry form state
  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [observations, setObservations] = useState('');
  const [limitations, setLimitations] = useState('');
  const [epistemicStatus, setEpistemicStatus] = useState<EpistemicStatus>('empirical_observation');
  const [tagInput, setTagInput] = useState('');

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags || [])));

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.hypothesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.observations.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || (e.tags && e.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleSubmitNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hypothesis.trim()) return;

    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddEntry({
      title: title.trim(),
      hypothesis: hypothesis.trim(),
      observations: observations.trim(),
      limitations: limitations.trim(),
      epistemicStatus,
      linkedTrialIds: [],
      tags: parsedTags.length > 0 ? parsedTags : ['General'],
    });

    // Reset form
    setTitle('');
    setHypothesis('');
    setObservations('');
    setLimitations('');
    setTagInput('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1020]/90 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span>RESEARCH NOTEBOOK</span>
              <span>·</span>
              <span>PROVENANCE LEDGER & AUDIT TRAIL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Experimental Notebook & Findings Log
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-3xl">
              Document testable hypotheses, attach observed experimental runs, record epistemic limitations, and export comprehensive audit records as JSON or RFC-4180 CSV.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Entry</span>
            </button>

            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5 text-indigo-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notebook titles, hypotheses, or observations..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Tag className="h-4 w-4 text-slate-500" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Tags ({entries.length})</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* New Entry Modal/Drawer */}
      {isCreating && (
        <form
          onSubmit={handleSubmitNewEntry}
          className="rounded-xl border border-indigo-500/50 bg-[#0c1328] p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100">Log New Experimental Hypothesis</h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Entry Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cross-Modal Spatial Invariance in Kinematic Derivations"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Epistemic Classification
              </label>
              <select
                value={epistemicStatus}
                onChange={(e) => setEpistemicStatus(e.target.value as EpistemicStatus)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="documented_feature">Documented Architectural Feature</option>
                <option value="empirical_observation">Empirical Observation</option>
                <option value="interpretation">Analytical Interpretation</option>
                <option value="untested_hypothesis">Untested Research Hypothesis</option>
                <option value="proposed_experiment">Proposed Experimental Protocol</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Falsifiable Hypothesis
            </label>
            <textarea
              rows={2}
              required
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="State the expected invariant, behavioral difference, or shortcut trigger..."
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Recorded Empirical Observations
              </label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observed latency delta, reasoning markers, refusal triggers..."
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Known Limitations & Confounders
              </label>
              <textarea
                rows={3}
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                placeholder="Inaccessible internal weights, potential prompt phrasing bias..."
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. CoT, Safety, Latency, FraudAnalysis"
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
            >
              Save Record to Notebook
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
            <p className="text-sm">No research entries found matching your query.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isExpanded = expandedEntryId === entry.id;
            return (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-800 bg-[#090e1c] overflow-hidden transition-all hover:border-slate-700"
              >
                <div
                  onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-400 font-semibold">{entry.epistemicStatus.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-100">
                      {entry.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                      <strong className="text-slate-400 font-mono text-xs">HYPOTHESIS: </strong>
                      {entry.hypothesis}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-5 space-y-4 bg-slate-950/40 text-xs sm:text-sm">
                    {entry.observations && (
                      <div className="space-y-1">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                          Directly Observed Findings
                        </div>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {entry.observations}
                        </p>
                      </div>
                    )}

                    {entry.limitations && (
                      <div className="space-y-1">
                        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                          Known Epistemic Limitations & Inaccessible Weights
                        </div>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {entry.limitations}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/60 text-xs font-mono">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-slate-500" />
                        {entry.tags.map((t) => (
                          <span key={t} className="text-indigo-300">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="text-slate-500">
                        Record ID: {entry.id}
                      </div>
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
