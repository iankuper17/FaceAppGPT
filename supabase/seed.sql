-- FaceScore AI — Run in Supabase SQL Editor in this order.
-- Before running the Storage section: create two buckets in Dashboard > Storage:
--   - "selfies" (private)
--   - "results" (private)
-- 1) Extensions and profiles

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMPTZ,
  show_in_leaderboard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) Analyses

CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  face_score NUMERIC(3,1) CHECK (face_score >= 0 AND face_score <= 10),
  report JSONB,
  percentile INTEGER CHECK (percentile >= 0 AND percentile <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own analyses"
  ON public.analyses FOR ALL
  USING (auth.uid() = user_id);

-- 3) Glow-ups (premium)

CREATE TABLE public.glow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id TEXT,
  result_image_path TEXT,
  prompt_used TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_glow_ups_user_id ON public.glow_ups(user_id);
CREATE INDEX idx_glow_ups_analysis_id ON public.glow_ups(analysis_id);

ALTER TABLE public.glow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own glow_ups"
  ON public.glow_ups FOR ALL
  USING (auth.uid() = user_id);

-- 4) Leaderboard view

CREATE OR REPLACE VIEW public.leaderboard AS
  SELECT p.id, p.display_name, p.avatar_url,
         ROUND(AVG(a.face_score)::numeric, 1) AS avg_score,
         COUNT(a.id) AS analyses_count
  FROM public.profiles p
  JOIN public.analyses a ON a.user_id = p.id
  WHERE p.show_in_leaderboard = TRUE
  GROUP BY p.id, p.display_name, p.avatar_url
  ORDER BY avg_score DESC
  LIMIT 100;

-- Allow any authenticated user to read leaderboard (profiles with show_in_leaderboard + their analyses)
CREATE POLICY "Anyone can read leaderboard profiles"
  ON public.profiles FOR SELECT
  USING (show_in_leaderboard = TRUE);

CREATE POLICY "Anyone can read analyses of leaderboard users"
  ON public.analyses FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.profiles WHERE show_in_leaderboard = TRUE)
  );

-- 5) Storage: create buckets and policies.
-- Paths within each bucket: {user_id}/{filename}

INSERT INTO storage.buckets (id, name, public)
VALUES ('selfies', 'selfies', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('results', 'results', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own selfies"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'selfies' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own selfies"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'selfies' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own selfies"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'selfies' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload own results"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'results' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own results"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'results' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own results"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'results' AND (storage.foldername(name))[1] = auth.uid()::text
  );
