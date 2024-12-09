export interface VerificationResult {
  verdict: string;
  confidence: number;
  reasoning: string;
  model: string;
}

export interface Post {
  id: string;
  user_id: string;
  statement: string;
  created_at: string;
  reference_post_id?: string;
  verification_results: VerificationResult[];
}