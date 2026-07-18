-- Run this in your Supabase SQL Editor to allow authenticated users to delete products
CREATE POLICY "Authenticated users can delete products"
ON public.products FOR DELETE
TO authenticated
USING ( true );
