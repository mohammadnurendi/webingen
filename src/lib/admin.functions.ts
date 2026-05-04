// Admin functions — semua operasi dijalankan langsung di client menggunakan
// Supabase dengan session user yang sudah login. RLS di Supabase memastikan
// hanya admin yang bisa mengakses data sensitif.
import { supabase } from "@/integrations/supabase/client";

type AdminTable = "activities" | "members" | "schedules" | "moments" | "moment_photos" | "app_settings";
type AdminFilter = { column: string; value: unknown };
type AdminOrder = { column: string; ascending?: boolean; nullsFirst?: boolean };

async function requireAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Sesi admin habis. Silakan login ulang.");

  const { data: roleData, error } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !roleData) throw new Error("Akun ini belum punya akses admin.");
  return session.user;
}

export async function verifyAdminSession(_opts?: unknown): Promise<{ isAdmin: boolean }> {
  try {
    await requireAdmin();
    return { isAdmin: true };
  } catch {
    return { isAdmin: false };
  }
}

export async function getAdminRows(opts: {
  data: {
    table: AdminTable;
    select?: string;
    filters?: AdminFilter[];
    order?: AdminOrder[];
    accessToken?: string;
  };
}) {
  await requireAdmin();
  const { table, select, filters, order } = opts.data;
  let query = (supabase as any).from(table).select(select ?? "*");
  for (const f of filters ?? []) query = query.eq(f.column, f.value);
  for (const o of order ?? []) query = query.order(o.column, { ascending: o.ascending ?? true, nullsFirst: o.nullsFirst });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminCounts(_opts?: unknown) {
  await requireAdmin();
  const [activities, schedules, members, moments] = await Promise.all([
    supabase.from("activities").select("id", { count: "exact", head: true }),
    supabase.from("schedules").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("moments").select("id", { count: "exact", head: true }),
  ]);
  for (const r of [activities, schedules, members, moments]) {
    if (r.error) throw new Error(r.error.message);
  }
  return {
    activities: activities.count ?? 0,
    schedules: schedules.count ?? 0,
    members: members.count ?? 0,
    moments: moments.count ?? 0,
  };
}

export async function insertAdminRows(opts: {
  data: {
    table: AdminTable;
    values: Record<string, unknown> | Array<Record<string, unknown>>;
    select?: string;
    single?: boolean;
    accessToken?: string;
  };
}) {
  await requireAdmin();
  const { table, values, select, single } = opts.data;
  let query = (supabase as any).from(table).insert(values);
  if (select) query = query.select(select);
  if (single) query = query.single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function updateAdminRows(opts: {
  data: {
    table: AdminTable;
    values: Record<string, unknown>;
    filters: AdminFilter[];
    select?: string;
    single?: boolean;
    accessToken?: string;
  };
}) {
  await requireAdmin();
  const { table, values, filters, select, single } = opts.data;
  let query = (supabase as any).from(table).update(values);
  for (const f of filters) query = query.eq(f.column, f.value);
  if (select) query = query.select(select);
  if (single) query = query.single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function upsertAdminRows(opts: {
  data: {
    table: AdminTable;
    values: Record<string, unknown> | Array<Record<string, unknown>>;
    select?: string;
    single?: boolean;
    accessToken?: string;
  };
}) {
  await requireAdmin();
  const { table, values, select, single } = opts.data;
  let query = (supabase as any).from(table).upsert(values);
  if (select) query = query.select(select);
  if (single) query = query.single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function deleteAdminRows(opts: {
  data: {
    table: AdminTable;
    filters: AdminFilter[];
    accessToken?: string;
  };
}) {
  await requireAdmin();
  const { table, filters } = opts.data;
  let query = (supabase as any).from(table).delete();
  for (const f of filters) query = query.eq(f.column, f.value);
  const { error } = await query;
  if (error) throw new Error(error.message);
  return { ok: true };
}
