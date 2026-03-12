export interface FacialStructure {
  jawline: number;
  eye_symmetry: number;
  facial_balance: number;
}

export interface SkinAnalysis {
  clarity: number;
  texture: number;
  tone_balance: number;
}

export interface ExpressionImpact {
  smile_boost: number;
  neutral_rating: number;
}

export interface AttractiveFeature {
  label: string;
  description: string;
}

export interface ImprovementArea {
  label: string;
  description: string;
}

export interface PerceivedTraits {
  confidence: number;
  trustworthiness: number;
  dominance: number;
  approachability: number;
  intelligence: number;
}

export interface LifePredictions {
  estimated_age: number;
  personality: string;
  likely_hobbies: string[];
  vibe: string;
}

export interface DeepReading {
  personality_signals: string[];
  social_role: { role: string; explanation: string };
  conversation_style: string[];
  mental_energy: { profile: string; description: string };
  hidden_strengths: Array<{ strength: string; explanation: string }>;
  internet_vibe: string[];
  life_trajectory: string;
  cosmic_message: string;
  life_hints: string[];
  curious_observations: string[];
}

export interface AnalysisReport {
  facial_structure: FacialStructure;
  skin_analysis: SkinAnalysis;
  expression_impact: ExpressionImpact;
  attractive_features?: AttractiveFeature[];
  improvement_areas?: ImprovementArea[];
  perceived_traits?: PerceivedTraits;
  life_predictions?: LifePredictions;
  deep_reading?: DeepReading;
}

export interface Analysis {
  id: string;
  user_id: string;
  image_path: string;
  face_score: number;
  report: AnalysisReport | null;
  percentile: number | null;
  global_rank: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  show_in_leaderboard: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlowUp {
  id: string;
  analysis_id: string;
  user_id: string;
  task_id: string | null;
  result_image_path: string | null;
  prompt_used: string | null;
  status: "pending" | "processing" | "success" | "failed";
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  avg_score: number;
  analyses_count: number;
}
