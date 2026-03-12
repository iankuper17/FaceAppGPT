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

export interface PerceivedTraits {
  confidence: string;
  approachability: string;
  dominance: string;
}

export interface AnalysisReport {
  facial_structure: FacialStructure;
  skin_analysis: SkinAnalysis;
  expression_impact: ExpressionImpact;
  perceived_traits?: PerceivedTraits;
}

export interface Analysis {
  id: string;
  user_id: string;
  image_path: string;
  face_score: number;
  report: AnalysisReport | null;
  percentile: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  premium_until: string | null;
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
