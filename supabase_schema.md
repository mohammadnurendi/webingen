# Struktur Tabel Supabase

Berdasarkan file migrasi `20260501164942_e502fe43-b178-434b-a9c1-3fafbc3f1c17.sql` yang ditemukan dalam proyek, struktur database Supabase sudah didefinisikan dengan baik. Berikut adalah ringkasan tabel-tabel utama dan relasinya:

## 1. `users` (Supabase Auth)

Ini adalah tabel bawaan Supabase Auth yang digunakan untuk mengelola pengguna. Tidak ada definisi eksplisit dalam migrasi ini, tetapi tabel lain merujuk padanya.

## 2. `user_roles`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `uuid`    | Primary Key, UUID yang dihasilkan secara acak |
| `user_id`  | `uuid`    | Foreign Key ke `auth.users.id`, CASCADE DELETE |
| `role`     | `app_role`| Enum (`admin`, `user`)                         |
| `created_at`| `timestamptz`| Waktu pembuatan, default `now()`               |

**Relasi:** `user_id` mereferensikan `auth.users.id`.
**Kebijakan RLS:**
* Pengguna dapat melihat peran mereka sendiri.
* Admin dapat melihat semua peran.
* Admin dapat mengelola (INSERT, UPDATE, DELETE) peran.

## 3. `activities`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `uuid`    | Primary Key, UUID yang dihasilkan secara acak |
| `slug`     | `text`    | Unik, digunakan untuk URL aktivitas             |
| `name`     | `text`    | Nama aktivitas                                 |
| `description`| `text`    | Deskripsi aktivitas (opsional)                 |
| `icon`     | `text`    | Ikon aktivitas (opsional)                      |
| `image_url`| `text`    | URL gambar aktivitas (opsional)                |
| `position` | `int`     | Urutan tampilan, default `0`                   |
| `created_at`| `timestamptz`| Waktu pembuatan, default `now()`               |
| `updated_at`| `timestamptz`| Waktu pembaruan, default `now()`, diupdate oleh trigger `trg_activities_updated`|

**Kebijakan RLS:**
* Publik dapat membaca aktivitas.
* Admin dapat mengelola (ALL) aktivitas.

## 4. `schedules`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `uuid`    | Primary Key, UUID yang dihasilkan secara acak |
| `activity_id`| `uuid`    | Foreign Key ke `public.activities.id`, SET NULL ON DELETE |
| `title`    | `text`    | Judul jadwal                                   |
| `event_date`| `date`    | Tanggal acara                                  |
| `start_time`| `text`    | Waktu mulai (opsional)                         |
| `end_time` | `text`    | Waktu selesai (opsional)                       |
| `location` | `text`    | Lokasi acara (opsional)                        |
| `created_at`| `timestamptz`| Waktu pembuatan, default `now()`               |
| `updated_at`| `timestamptz`| Waktu pembaruan, default `now()`, diupdate oleh trigger `trg_schedules_updated`|

**Relasi:** `activity_id` mereferensikan `public.activities.id`.
**Kebijakan RLS:**
* Publik dapat membaca jadwal.
* Admin dapat mengelola (ALL) jadwal.

## 5. `members`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `uuid`    | Primary Key, UUID yang dihasilkan secara acak |
| `name`     | `text`    | Nama anggota                                   |
| `role`     | `text`    | Peran anggota (opsional)                       |
| `photo_url`| `text`    | URL foto anggota (opsional)                    |
| `quote`    | `text`    | Kutipan anggota (opsional)                     |
| `featured` | `boolean` | Menandai anggota unggulan, default `false`     |
| `position` | `int`     | Urutan tampilan, default `0`                   |
| `created_at`| `timestamptz`| Waktu pembuatan, default `now()`               |
| `updated_at`| `timestamptz`| Waktu pembaruan, default `now()`, diupdate oleh trigger `trg_members_updated`|

**Kebijakan RLS:**
* Publik dapat membaca anggota.
* Admin dapat mengelola (ALL) anggota.

## 6. `moments`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `uuid`    | Primary Key, UUID yang dihasilkan secara acak |
| `title`    | `text`    | Judul momen                                    |
| `description`| `text`    | Deskripsi momen (opsional)                     |
| `activity_id`| `uuid`    | Foreign Key ke `public.activities.id`, SET NULL ON DELETE |
| `period`   | `text`    | Periode momen (opsional)                       |
| `event_date`| `date`    | Tanggal acara momen (opsional)                 |
| `created_at`| `timestamptz`| Waktu pembuatan, default `now()`               |
| `updated_at`| `timestamptz`| Waktu pembaruan, default `now()`, diupdate oleh trigger `trg_moments_updated`|

**Relasi:** `activity_id` mereferensikan `public.activities.id`.
**Kebijakan RLS:**
* Publik dapat membaca momen.
* Admin dapat mengelola (ALL) momen.

## 7. `moment_photos`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `uuid`    | Primary Key, UUID yang dihasilkan secara acak |
| `moment_id`| `uuid`    | Foreign Key ke `public.moments.id`, CASCADE DELETE |
| `url`      | `text`    | URL foto                                       |
| `position` | `int`     | Urutan tampilan, default `0`                   |
| `created_at`| `timestamptz`| Waktu pembuatan, default `now()`               |

**Relasi:** `moment_id` mereferensikan `public.moments.id`.
**Kebijakan RLS:**
* Publik dapat membaca foto momen.
* Admin dapat mengelola (ALL) foto momen.

## 8. `app_settings`

| Kolom      | Tipe Data | Keterangan                                     |
| :--------- | :-------- | :--------------------------------------------- |
| `id`       | `int`     | Primary Key, default `1`, dengan constraint `singleton`|
| `google_form_url`| `text`    | URL Google Form (opsional)                     |
| `whatsapp_number`| `text`    | Nomor WhatsApp (opsional)                      |
| `updated_at`| `timestamptz`| Waktu pembaruan, default `now()`, diupdate oleh trigger `trg_settings_updated`|

**Kebijakan RLS:**
* Publik dapat membaca pengaturan aplikasi.
* Admin dapat mengelola (ALL) pengaturan aplikasi.

## Fungsi dan Trigger Penting

*   **`app_role` ENUM**: Mendefinisikan peran pengguna (`admin`, `user`).
*   **`has_role(_user_id uuid, _role app_role)`**: Fungsi untuk memeriksa apakah pengguna memiliki peran tertentu.
*   **`set_updated_at()`**: Trigger untuk secara otomatis memperbarui kolom `updated_at` pada tabel yang relevan saat ada perubahan.
*   **`grant_first_admin()`**: Trigger yang berjalan setelah pengguna baru terdaftar di `auth.users`. Jika belum ada admin, pengguna pertama akan diberi peran `admin`, jika tidak, akan diberi peran `user`.

## Supabase Storage

*   **Bucket `media`**: Dibuat untuk menyimpan media yang diunggah. Bersifat publik (`public: true`).
*   **Kebijakan RLS untuk `storage.objects` di bucket `media`:**
    *   Publik dapat membaca objek di bucket `media`.
    *   Admin dapat mengunggah, memperbarui, dan menghapus objek di bucket `media`.
