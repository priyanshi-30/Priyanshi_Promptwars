export type DimensionKey = 
  | 'second_order_effects'
  | 'opportunity_costs'
  | 'goal_alignment'
  | 'information_asymmetry'
  | 'hidden_assumptions';

export interface DecisionInput {
  summary: string;
  context: string;
  reasoning: string;
}

export interface FactVSAssumption {
  statedFacts: string[];
  unstatedAssumptions: string[];
}

export interface DimensionAnalysis {
  dimension: DimensionKey;
  title: string;
  description: string;
  riskOrImpact: 'high' | 'medium' | 'low';
  keyQuestion: string;
}

export interface SocraticQuestion {
  id: string;
  question: string;
  targetBlindspot: string;
  reflectionPrompt: string;
  userReflection?: string;
  status: 'unanswered' | 'answered';
}

export interface ActionableDataStep {
  id: string;
  action: string;
  purpose: string;
  metricOrOutput: string;
}

export interface SocraticAnalysisResult {
  factsAndAssumptions: FactVSAssumption;
  dimensions: DimensionAnalysis[];
  socraticQuestions: SocraticQuestion[];
  dataSteps: ActionableDataStep[];
  nonPrescriptiveDisclaimer: string;
  analyzedAt: string;
}

export interface SocraticNode {
  id: string;
  label: string;
  type: 'root' | 'fact' | 'assumption' | 'dimension' | 'question' | 'reflection';
  parentId?: string;
  details?: string;
  status?: string;
}

export interface DecisionRecord {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  input: DecisionInput;
  analysis: SocraticAnalysisResult;
  reflectionsHistory: Record<string, string>; // questionId -> reflection text
  nodes?: SocraticNode[];
}

export type ThemeMode = 'dark' | 'light';

export interface UserProfile {
  uid: string;
  isAnonymous: boolean;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
