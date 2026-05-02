import { createClient } from "@supabase/supabase-js";

// Langsung definisikan URL dan Key di sini untuk memutus ketergantungan pada environment variables
const SUPABASE_URL = "https://psfabkkhcuzekeqdjfws.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZmFia2toY3V6ZWtlcWRqZndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjczMjAsImV4cCI6MjA5MzMwMzMyMH0.FCRieMZnFRdb3E8jSvsHVYaeeo8UCMqgYymz3fbIMxk";

// Buat client secara langsung tanpa pengecekan
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Tambahkan export kosong untuk Database jika diperlukan oleh file lain agar tidak error build
export type Database = any;
