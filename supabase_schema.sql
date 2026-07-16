-- KONGO Marketplace Database Schema

-- 1. Create Products Table
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Active',
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Row Level Security (RLS) for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.products FOR SELECT 
USING ( true );

-- Allow authenticated admins to insert/update/delete products (For now, allowing all authenticated users for demo purposes)
CREATE POLICY "Authenticated users can insert products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK ( true );

CREATE POLICY "Authenticated users can update products" 
ON public.products FOR UPDATE 
TO authenticated 
USING ( true );


-- 2. Create Orders Table
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING ( auth.uid() = user_id );

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = user_id );


-- 3. Create Profiles Table (Optional, for extending user data)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  first_name text,
  last_name text,
  role text DEFAULT 'customer' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = id );

-- ==========================================
-- 4. SITE SETTINGS (FOR DYNAMIC BANNERS)
-- ==========================================
CREATE TABLE public.site_settings (
  id text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings" 
ON public.site_settings FOR SELECT 
USING ( true );

CREATE POLICY "Admins can manage settings" 
ON public.site_settings FOR ALL 
TO authenticated 
USING ( true ) WITH CHECK ( true );
