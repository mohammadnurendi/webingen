# Instruksi Deployment ke Cloudflare Pages

Proyek frontend ini dapat dengan mudah di-deploy ke Cloudflare Pages. Berikut adalah langkah-langkah dan konfigurasi yang diperlukan:

## 1. Persiapan Lingkungan

Pastikan Anda telah menginstal `wrangler` CLI dan terautentikasi dengan akun Cloudflare Anda. Jika belum, ikuti instruksi resmi Cloudflare untuk instalasi dan autentikasi:

```bash
npm install -g wrangler
wrangler login
```

## 2. Konfigurasi Variabel Lingkungan Supabase

Sebelum deployment, Anda perlu mengatur variabel lingkungan Supabase di Cloudflare Pages. Variabel ini akan digunakan oleh aplikasi frontend untuk terhubung ke proyek Supabase Anda.

Tambahkan variabel lingkungan berikut di pengaturan proyek Cloudflare Pages Anda:

*   `VITE_SUPABASE_URL`: URL proyek Supabase Anda (misalnya, `https://your-project-ref.supabase.co`)
*   `VITE_SUPABASE_ANON_KEY`: Kunci `anon` publik proyek Supabase Anda (juga dikenal sebagai `SUPABASE_ANON_KEY` atau `SUPABASE_PUBLIC_ANON_KEY`)

Anda dapat menemukan nilai-nilai ini di Dashboard Supabase Anda, di bagian `Settings > API`.

## 3. Pengaturan Build di Cloudflare Pages

Saat membuat proyek baru di Cloudflare Pages atau mengonfigurasi proyek yang sudah ada, gunakan pengaturan build berikut:

*   **Build command**: `npm run build`
*   **Output directory**: `dist`

Pengaturan ini sesuai dengan konfigurasi proyek `package.json` dan `vite.config.ts` yang menggunakan Vite untuk proses build.

## 4. Deployment

Setelah variabel lingkungan diatur dan konfigurasi build diterapkan, Cloudflare Pages akan secara otomatis membangun dan mendeploy aplikasi Anda setiap kali ada perubahan pada branch yang terhubung (misalnya, `main` atau `master`).

Jika Anda ingin melakukan deployment manual atau menguji build secara lokal sebelum push, Anda bisa menggunakan perintah berikut:

```bash
npm run build
wrangler pages deploy dist
```

Pastikan Anda berada di direktori root proyek saat menjalankan perintah ini.

## Catatan Tambahan

*   **Cloudflare Workers**: Proyek ini menggunakan `@tanstack/react-start` yang mendukung SSR (Server-Side Rendering) dan dapat di-deploy sebagai Cloudflare Worker. Konfigurasi `wrangler.jsonc` sudah ada dalam proyek, yang menunjukkan kompatibilitas dengan lingkungan Worker. Jika Anda ingin memanfaatkan fitur SSR penuh, pastikan Cloudflare Pages Anda dikonfigurasi untuk menggunakan fungsi Edge.
*   **HTTPS**: Cloudflare Pages secara otomatis menyediakan HTTPS untuk situs Anda.
*   **Domain Kustom**: Anda dapat mengonfigurasi domain kustom untuk proyek Cloudflare Pages Anda melalui dashboard Cloudflare.
