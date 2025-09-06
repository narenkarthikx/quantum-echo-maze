-- Quantum Echo Maze - Final Database Setup for Supabase
-- Copy and paste this entire script into your Supabase SQL Editor

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create game sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('game', 'lab')),
  score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  fidelity DECIMAL(5,2) DEFAULT 100.00,
  attempts INTEGER DEFAULT 0,
  path_length INTEGER DEFAULT 0,
  completion_time INTEGER, -- in seconds
  maze_seed TEXT, -- for reproducing specific mazes
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create leaderboards table
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  high_score INTEGER NOT NULL DEFAULT 0,
  max_level INTEGER NOT NULL DEFAULT 1,
  best_fidelity DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  total_games INTEGER DEFAULT 1,
  total_playtime INTEGER DEFAULT 0, -- in seconds
  average_fidelity DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own game sessions" ON public.game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Leaderboards are viewable by everyone" ON public.leaderboards
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own leaderboard entry" ON public.leaderboards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leaderboard entry" ON public.leaderboards
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.leaderboards (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update leaderboard
CREATE OR REPLACE FUNCTION public.update_leaderboard(
  p_user_id UUID,
  p_score INTEGER,
  p_level INTEGER,
  p_fidelity DECIMAL(5,2),
  p_playtime INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.leaderboards (
    user_id, 
    high_score, 
    max_level, 
    best_fidelity, 
    total_games, 
    total_playtime,
    updated_at
  )
  VALUES (
    p_user_id, 
    p_score, 
    p_level, 
    p_fidelity, 
    1, 
    p_playtime,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    high_score = GREATEST(leaderboards.high_score, p_score),
    max_level = GREATEST(leaderboards.max_level, p_level),
    best_fidelity = GREATEST(leaderboards.best_fidelity, p_fidelity),
    total_games = leaderboards.total_games + 1,
    total_playtime = leaderboards.total_playtime + p_playtime,
    average_fidelity = (leaderboards.average_fidelity * (leaderboards.total_games - 1) + p_fidelity) / leaderboards.total_games,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_leaderboards_high_score ON public.leaderboards(high_score DESC);
