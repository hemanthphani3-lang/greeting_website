-- schema.sql
-- Run this in your Supabase SQL Editor to set up the database tables

-- 1. Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    sender_name TEXT,
    message TEXT NOT NULL,
    occasion TEXT NOT NULL,
    template TEXT NOT NULL,
    music_url TEXT,
    slug TEXT UNIQUE NOT NULL
);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS memories_slug_idx ON public.memories(slug);
CREATE INDEX IF NOT EXISTS memories_user_id_idx ON public.memories(user_id);

-- Enable Row Level Security (RLS) on memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Create policies for memories
CREATE POLICY "Allow public read access to memories" ON public.memories
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to memories" ON public.memories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their own memories" ON public.memories
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to delete their own memories" ON public.memories
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);


-- 2. Create memory_photos table
CREATE TABLE IF NOT EXISTS public.memory_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    display_order INT NOT NULL
);

CREATE INDEX IF NOT EXISTS memory_photos_memory_id_idx ON public.memory_photos(memory_id);

-- Enable RLS on memory_photos
ALTER TABLE public.memory_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for memory_photos
CREATE POLICY "Allow public read access to memory_photos" ON public.memory_photos
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to memory_photos" ON public.memory_photos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update/delete memory_photos" ON public.memory_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.memories 
            WHERE memories.id = memory_photos.memory_id 
            AND (memories.user_id = auth.uid() OR memories.user_id IS NULL)
        )
    );


-- 3. Create memory_views table
CREATE TABLE IF NOT EXISTS public.memory_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
    device_type TEXT,
    country TEXT
);

CREATE INDEX IF NOT EXISTS memory_views_memory_id_idx ON public.memory_views(memory_id);

-- Enable RLS on memory_views
ALTER TABLE public.memory_views ENABLE ROW LEVEL SECURITY;

-- Create policies for memory_views
CREATE POLICY "Allow public insert to memory_views" ON public.memory_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their own memory analytics" ON public.memory_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.memories 
            WHERE memories.id = memory_views.memory_id 
            AND (memories.user_id = auth.uid() OR memories.user_id IS NULL)
        )
    );


-- 4. Create memory_shares table
CREATE TABLE IF NOT EXISTS public.memory_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS memory_shares_memory_id_idx ON public.memory_shares(memory_id);

-- Enable RLS on memory_shares
ALTER TABLE public.memory_shares ENABLE ROW LEVEL SECURITY;

-- Create policies for memory_shares
CREATE POLICY "Allow public insert to memory_shares" ON public.memory_shares
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their own memory share analytics" ON public.memory_shares
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.memories 
            WHERE memories.id = memory_shares.memory_id 
            AND (memories.user_id = auth.uid() OR memories.user_id IS NULL)
        )
    );

-- Create a storage bucket for memory photos
-- Note: In Supabase, you can create a bucket named 'memory-photos' from the Storage tab of the dashboard and set it to public.
