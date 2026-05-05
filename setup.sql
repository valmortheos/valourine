-- Valourine Table Definitions
-- Run these in your Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Listening Stats Table
CREATE TABLE IF NOT EXISTS public.listening_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- 4. Playlists Table
CREATE TABLE IF NOT EXISTS public.playlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Playlist Items Table
CREATE TABLE IF NOT EXISTS public.playlist_items (
  id BIGSERIAL PRIMARY KEY,
  playlist_id BIGINT REFERENCES public.playlists ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS SETTINGS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;

-- POLICIES (Isolated access per user)

-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Stats
CREATE POLICY "Users can view their own stats" ON public.listening_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.listening_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Playlists
CREATE POLICY "Users can view their own playlists" ON public.playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own playlists" ON public.playlists FOR ALL USING (auth.uid() = user_id);

-- Playlist Items
CREATE POLICY "Users can view their own playlist items" ON public.playlist_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);
CREATE POLICY "Users can modify their own playlist items" ON public.playlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);

-- STORAGE BUCKET (Create 'avatars' bucket manually first)
-- Run these after creating bucket 'avatars' in Supabase dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage Policies for 'avatars' bucket
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "User Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
