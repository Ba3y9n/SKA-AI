-- 1. Create the table
CREATE TABLE public.ambitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    department VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    status VARCHAR(50) DEFAULT 'approved',
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.ambitions ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows anyone to read approved ambitions
CREATE POLICY "Allow public read access for approved ambitions"
ON public.ambitions
FOR SELECT
USING (is_approved = true);

-- 4. Create a policy that allows anyone to insert a new ambition
CREATE POLICY "Allow public insert access"
ON public.ambitions
FOR INSERT
WITH CHECK (true);
