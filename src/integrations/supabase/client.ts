import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Hardcoded configuration to bypass Cloudflare environment variable issues
const SUPABASE_URL = "https://psfabkkhcuzekeqdjfws.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZmFia2toY3V6ZWtlcWRqZndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjczMjAsImV4cCI6MjA5MzMwMzMyMH0.FCRieMZnFRdb3E8jSvsHVYaeeo8UCMqgYymz3fbIMxk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
