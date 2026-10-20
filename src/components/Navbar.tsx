import React from 'react';
import { Database, Cpu, FlaskConical, BarChart3, BookOpen, Download, ShieldCheck, AlertCircle } from 'lucide-react';

export type WorkspaceTab = 'explorer' | 'architecture' | 'workbench' | 'behavioral' | 'notebook';

interface NavbarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  hasApiKey: boolean;
  onQuickExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  hasApiKey,
  onQuickExport,
}) => {
  const navItems: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'explorer', label: 'Analysis Explorer', icon: Database },
    { id: 'architecture', label: 'Architecture Explorer', icon: Cpu },
    { id: 'workbench', label: 'Experiment Workbench', icon: FlaskConical },
    { id: 'behavioral', label: 'Behavioral Analysis', icon: BarChart3 },
    { id: 'notebook', label: 'Research Notebook', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element, no clutter) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <button
            onClick={() => onTabChange('explorer')}
            className="text-left font-bold text-base sm:text-lg tracking-tight text-slate-100 hover:text-indigo-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            Argon Interpretability Lab
          </button>
        </div>

        {/* Zone 2: 5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs xl:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action & Telemetry Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-slate-800 bg-slate-900/60 text-slate-300">
            {hasApiKey ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Live API Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-amber-400">Bench Test Mode</span>
              </>
            )}
          </div>
          <button
            onClick={onQuickExport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-100 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Session</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/60 px-4 py-2 gap-2 bg-[#090e1c]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                  : 'text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
