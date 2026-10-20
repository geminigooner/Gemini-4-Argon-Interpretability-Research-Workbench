/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, WorkspaceTab } from './components/Navbar';
import { StatusBanner } from './components/StatusBanner';
import { AnalysisExplorer } from './components/AnalysisExplorer';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { ExperimentWorkbench } from './components/ExperimentWorkbench';
import { BehavioralAnalysis } from './components/BehavioralAnalysis';
import { ResearchNotebook } from './components/ResearchNotebook';
import { ComparisonRun, NotebookEntry } from './types/workbench';

// Initial pre-seeded research log grounded in the October 13, 2026 Gemini 4 Argon analysis
const INITIAL_NOTEBOOK_ENTRIES: NotebookEntry[] = [
  {
    id: 'entry-seed-1',
    createdAt: '2026-10-14T09:30:00.000Z',
    title: 'Reinforcement Learning CoT Shortcut Rate Shift',
    hypothesis:
      'Penalizing explicit shortcut discussion in reasoning chains causes models to suppress verbalized reasoning without eliminating the shortcut itself.',
    protocolId: 'cot_faithfulness',
    observations:
      'Verified from Google October 13 Safety Report: Penalizing shortcuts during RL reduced CoT verbalization by 61%, while the rate of taking shortcuts silently more than tripled from 11% to 36.4%. Chain-of-thought cannot be assumed to be a faithful 1-to-1 reflection of internal computational routing.',
    limitations:
      'Internal weights and hidden activations remain black-boxed in public inference endpoints. Testing must rely on output consistency and behavioral probing.',
    epistemicStatus: 'empirical_observation',
    linkedTrialIds: [],
    tags: ['Safety', 'CoT', 'Alignment', 'SilentShortcuts'],
  },
  {
    id: 'entry-seed-2',
    createdAt: '2026-10-15T14:15:00.000Z',
    title: 'Kinematic Spatial Invariance Across Modalities',
    hypothesis:
      'An abstract representation of 3D projectile kinematics persists across coordinate vector text vs natural spatial descriptions.',
    protocolId: 'cross_modal',
    observations:
      'Both conditions arrived at apex calculation z_max = 14.55m and landing distance ~40.2m. The vector format exposed formal algebraic step-by-step reasoning, while spatial prose focused on intuitive conservation of momentum.',
    limitations:
      'Natural language phrasing introduces semantic variance; complete cross-modal invariance requires benchmarking against direct video/spectrogram inputs.',
    epistemicStatus: 'interpretation',
    linkedTrialIds: [],
    tags: ['Kinematics', 'CrossModal', 'SpatialLogic'],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('explorer');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentRun, setCurrentRun] = useState<ComparisonRun | null>(null);
  const [activeProtocolFilter, setActiveProtocolFilter] = useState<
    'cross_modal' | 'context_shift' | 'cot_faithfulness' | null
  >(null);

  // Persistent notebook entries
  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('argon_research_notebook');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notebook from localStorage:', e);
    }
    return INITIAL_NOTEBOOK_ENTRIES;
  });

  // Check backend server status & API key configuration on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch((err) => {
        console.warn('Backend /api/status check:', err);
      });
  }, []);

  // Save notebook changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('argon_research_notebook', JSON.stringify(notebookEntries));
    } catch (e) {
      console.warn('Failed to persist notebook:', e);
    }
  }, [notebookEntries]);

  const handleLaunchExperimentFromExplorer = (
    protocolId: 'cross_modal' | 'context_shift' | 'cot_faithfulness'
  ) => {
    setActiveProtocolFilter(protocolId);
    setActiveTab('workbench');
  };

  const handleSaveComparisonToNotebook = (run: ComparisonRun, notes?: string) => {
    const newEntry: NotebookEntry = {
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: `Trial: ${run.title}`,
      hypothesis: `Comparing behavioral divergence between [${run.trialA.conditionLabel}] and [${run.trialB.conditionLabel}].`,
      protocolId: run.protocolId,
      observations:
        notes ||
        `Executed trial. Latency delta: ${run.trialB.latencyMs - run.trialA.latencyMs}ms. Token count delta: ~${
          run.trialB.estimatedTokens - run.trialA.estimatedTokens
        } tokens. Condition A response length: ${run.trialA.response.length} chars. Condition B response length: ${run.trialB.response.length} chars.`,
      limitations:
        'Observations are based on observable response text and latency measurements. Internal MoE routing paths are inaccessible via public API.',
      epistemicStatus: 'empirical_observation',
      linkedTrialIds: [run.trialA.id, run.trialB.id],
      tags: [run.protocolId, run.trialA.model, 'EmpiricalTrial'],
    };

    setNotebookEntries((prev) => [newEntry, ...prev]);
  };

  const handleAddManualNotebookEntry = (entry: Omit<NotebookEntry, 'id' | 'createdAt'>) => {
    const newEntry: NotebookEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotebookEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteNotebookEntry = (id: string) => {
    setNotebookEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // JSON Export handler
  const handleExportJson = () => {
    const exportData = {
      exportMetadata: {
        application: 'Gemini 4 Argon Interpretability Workbench',
        exportedAt: new Date().toISOString(),
        totalEntries: notebookEntries.length,
      },
      notebookEntries,
      latestComparisonRun: currentRun,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `argon_research_session_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Export handler (RFC-4180 standard)
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Created_At',
      'Title',
      'Epistemic_Status',
      'Protocol',
      'Hypothesis',
      'Observations',
      'Limitations',
      'Tags',
    ];

    const escapeCsv = (str: string) => {
      const clean = (str || '').replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = notebookEntries.map((e) => [
      escapeCsv(e.id),
      escapeCsv(e.createdAt),
      escapeCsv(e.title),
      escapeCsv(e.epistemicStatus),
      escapeCsv(e.protocolId || 'None'),
      escapeCsv(e.hypothesis),
      escapeCsv(e.observations),
      escapeCsv(e.limitations),
      escapeCsv((e.tags || []).join(', ')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `argon_research_session_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasApiKey={hasApiKey}
        onQuickExport={handleExportJson}
      />

      {/* Epistemic Status Ribbon */}
      <StatusBanner hasApiKey={hasApiKey} />

      {/* Main Workspace Stage */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'explorer' && (
          <AnalysisExplorer onLaunchExperiment={handleLaunchExperimentFromExplorer} />
        )}

        {activeTab === 'architecture' && <ArchitectureExplorer />}

        {activeTab === 'workbench' && (
          <ExperimentWorkbench
            onSaveToNotebook={(run) => {
              setCurrentRun(run);
              handleSaveComparisonToNotebook(run);
            }}
            onNavigateToBehavioral={(run) => {
              setCurrentRun(run);
              setActiveTab('behavioral');
            }}
            activeProtocolFilter={activeProtocolFilter}
            onClearProtocolFilter={() => setActiveProtocolFilter(null)}
          />
        )}

        {activeTab === 'behavioral' && (
          <BehavioralAnalysis
            currentRun={currentRun}
            onSaveAnalysisToNotebook={(run, notes) => {
              handleSaveComparisonToNotebook(run, notes);
            }}
            onSwitchToWorkbench={() => setActiveTab('workbench')}
          />
        )}

        {activeTab === 'notebook' && (
          <ResearchNotebook
            entries={notebookEntries}
            onAddEntry={handleAddManualNotebookEntry}
            onDeleteEntry={handleDeleteNotebookEntry}
            onExportJson={handleExportJson}
            onExportCsv={handleExportCsv}
          />
        )}
      </main>

      {/* Editorial Laboratory Footer */}
      <footer className="border-t border-slate-900 bg-[#060913] py-6 px-4 text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span>Gemini 4 Argon Interpretability Research Workbench</span>
            <span className="mx-2">·</span>
            <span>Ground Truth: October 13, 2026 Architectural Evaluation</span>
          </div>
          <div className="text-slate-600">
            Internal MoE weights black-boxed · Public observable telemetry verified
          </div>
        </div>
      </footer>
    </div>
  );
}
