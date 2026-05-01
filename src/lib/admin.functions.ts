import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const adminTableSchema = z.enum(["activities", "members", "schedules", "moments", "moment_photos", "app_settings"]);
const filterSchema = z.object({ column: z.string().min(1), value: z.unknown() });
const orderSchema = z.object({
  column: z.string().min(1),
  ascending: z.boolean().optional(),
  nullsFirst: z.boolean().optional(),
});

async function requireAdmin(accessToken: string) {
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);

  if (userError || !userData.user) {
    throw new Error("Sesi admin tidak valid. Silakan login ulang.");
  }

  const { data: roleData, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleData) {
    throw new Error("Akun ini belum punya akses admin.");
  }

  return userData.user;
}

function applyFilters(query: any, filters: Array<{ column: string; value?: unknown }>) {
  return filters.reduce((q, filter) => q.eq(filter.column, filter.value), query);
}

export const verifyAdminSession = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ accessToken: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    try {
      await requireAdmin(data.accessToken);
      return { isAdmin: true };
    } catch {
      return { isAdmin: false };
    }
  });

export const getAdminRows = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    accessToken: z.string().min(1),
    table: adminTableSchema,
    select: z.string().optional(),
    filters: z.array(filterSchema).optional(),
    order: z.array(orderSchema).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    let query = (supabaseAdmin as any).from(data.table).select(data.select ?? "*");

    for (const filter of data.filters ?? []) query = query.eq(filter.column, filter.value);
    for (const order of data.order ?? []) {
      query = query.order(order.column, { ascending: order.ascending ?? true, nullsFirst: order.nullsFirst });
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getAdminCounts = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ accessToken: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const admin = supabaseAdmin as any;
    const [activities, schedules, members, moments] = await Promise.all([
      admin.from("activities").select("id", { count: "exact", head: true }),
      admin.from("schedules").select("id", { count: "exact", head: true }),
      admin.from("members").select("id", { count: "exact", head: true }),
      admin.from("moments").select("id", { count: "exact", head: true }),
    ]);

    for (const result of [activities, schedules, members, moments]) {
      if (result.error) throw new Error(result.error.message);
    }

    return {
      activities: activities.count ?? 0,
      schedules: schedules.count ?? 0,
      members: members.count ?? 0,
      moments: moments.count ?? 0,
    };
  });

export const insertAdminRows = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    accessToken: z.string().min(1),
    table: adminTableSchema,
    values: z.union([z.record(z.unknown()), z.array(z.record(z.unknown()))]),
    select: z.string().optional(),
    single: z.boolean().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    let query = (supabaseAdmin as any).from(data.table).insert(data.values);
    if (data.select) query = query.select(data.select);
    if (data.single) query = query.single();
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? null;
  });

export const updateAdminRows = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    accessToken: z.string().min(1),
    table: adminTableSchema,
    values: z.record(z.unknown()),
    filters: z.array(filterSchema).min(1),
    select: z.string().optional(),
    single: z.boolean().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    let query = applyFilters((supabaseAdmin as any).from(data.table).update(data.values), data.filters);
    if (data.select) query = query.select(data.select);
    if (data.single) query = query.single();
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? null;
  });

export const upsertAdminRows = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    accessToken: z.string().min(1),
    table: adminTableSchema,
    values: z.union([z.record(z.unknown()), z.array(z.record(z.unknown()))]),
    select: z.string().optional(),
    single: z.boolean().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    let query = (supabaseAdmin as any).from(data.table).upsert(data.values);
    if (data.select) query = query.select(data.select);
    if (data.single) query = query.single();
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? null;
  });

export const deleteAdminRows = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    accessToken: z.string().min(1),
    table: adminTableSchema,
    filters: z.array(filterSchema).min(1),
  }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const { error } = await applyFilters((supabaseAdmin as any).from(data.table).delete(), data.filters);
    if (error) throw new Error(error.message);
    return { ok: true };
  });