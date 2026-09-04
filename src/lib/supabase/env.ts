export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Situs tetap jalan dari seed selama ini false. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Bucket Storage yang dibuat lewat SETUP.md. */
export const BUCKET_ASSETS = "assets";
export const BUCKET_DOCS = "documents";
