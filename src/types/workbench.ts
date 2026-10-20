export type EpistemicStatus =
  | 'documented_feature'
  | 'empirical_observation'
  | 'interpretation'
  | 'untested_hypothesis'
  | 'proposed_experiment';

export interface ClaimRecord {
  id: string;
  section: number;
  sectionTitle: string;
  title: string;
  epistemicStatus: EpistemicStatus;
  claim: string;
  sourceQuote: string;
  supportingEvidence: string;
  limitations: string;
  page: number;
  tags: string[];
  suggestedProtocolId?: 'cross_modal' | 'context_shift' | 'cot_faithfulness';
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  isPaid?: boolean;
}

export type ThinkingLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ExperimentCondition {
  id: string;
  label: string;
  model: string;
  prompt: string;
  systemInstruction?: string;
  thinkingLevel?: ThinkingLevel;
  temperature: number;
  contextTag?: string;
  modality?: 'text' | 'image' | 'video' | 'audio_perception';
}

export interface TrialResult {
  id: string;
  protocolId: string;
  conditionLabel: string;
  model: string;
  prompt: string;
  response: string;
  latencyMs: number;
  estimatedTokens: number;
  timestamp: string;
  isLiveApi: boolean;
  hasReasoningMarkers: boolean;
  refusalDetected: boolean;
  systemInstruction?: string;
  thinkingLevel?: ThinkingLevel;
  temperature: number;
}

export interface ComparisonRun {
  id: string;
  protocolId: string;
  title: string;
  createdAt: string;
  trialA: TrialResult;
  trialB: TrialResult;
  analystNotes?: string;
}

export interface NotebookEntry {
  id: string;
  createdAt: string;
  title: string;
  hypothesis: string;
  protocolId?: string;
  observations: string;
  limitations: string;
  epistemicStatus: EpistemicStatus;
  linkedTrialIds: string[];
  tags: string[];
}
