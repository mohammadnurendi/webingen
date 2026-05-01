import {
  deleteAdminRows,
  getAdminCounts,
  getAdminRows,
  insertAdminRows,
  updateAdminRows,
  upsertAdminRows,
} from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

type AdminTable = "activities" | "members" | "schedules" | "moments" | "moment_photos" | "app_settings";
type AdminFilter = { column: string; value: unknown };
type AdminOrder = { column: string; ascending?: boolean; nullsFirst?: boolean };

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("Sesi admin habis. Silakan login ulang.");
  }
  return data.session.access_token;
}

export async function adminList<T>(options: {
  table: AdminTable;
  select?: string;
  filters?: AdminFilter[];
  order?: AdminOrder[];
}) {
  const rows = await getAdminRows({ data: { accessToken: await getAccessToken(), ...options } });
  return rows as T[];
}

export async function adminCounts() {
  return getAdminCounts({ data: { accessToken: await getAccessToken() } });
}

export async function adminInsert<T = unknown>(options: {
  table: AdminTable;
  values: Record<string, unknown> | Array<Record<string, unknown>>;
  select?: string;
  single?: boolean;
}) {
  const rows = await insertAdminRows({ data: { accessToken: await getAccessToken(), ...options } });
  return rows as T;
}

export async function adminUpdate<T = unknown>(options: {
  table: AdminTable;
  values: Record<string, unknown>;
  filters: AdminFilter[];
  select?: string;
  single?: boolean;
}) {
  const rows = await updateAdminRows({ data: { accessToken: await getAccessToken(), ...options } });
  return rows as T;
}

export async function adminUpsert<T = unknown>(options: {
  table: AdminTable;
  values: Record<string, unknown> | Array<Record<string, unknown>>;
  select?: string;
  single?: boolean;
}) {
  const rows = await upsertAdminRows({ data: { accessToken: await getAccessToken(), ...options } });
  return rows as T;
}

export async function adminDelete(options: { table: AdminTable; filters: AdminFilter[] }) {
  return deleteAdminRows({ data: { accessToken: await getAccessToken(), ...options } });
}

export function adminError(error: unknown, fallback = "Operasi gagal") {
  return error instanceof Error ? error.message : fallback;
}
