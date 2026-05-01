import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ActivityRow = { id: string; slug: string; name: string; description: string | null; icon: string | null; image_url: string | null; position: number };
export type ScheduleRow = { id: string; activity_id: string | null; title: string; event_date: string; start_time: string | null; end_time: string | null; location: string | null };
export type MemberRow = { id: string; name: string; role: string | null; photo_url: string | null; quote: string | null; featured: boolean; position: number };
export type MomentRow = { id: string; title: string; description: string | null; activity_id: string | null; period: string | null; event_date: string | null };
export type PhotoRow = { id: string; moment_id: string; url: string; position: number };

export function useActivities() {
  const [data, setData] = useState<ActivityRow[]>([]);
  useEffect(() => {
    void supabase.from("activities").select("*").order("position").then(({ data }) => setData(data ?? []));
  }, []);
  return data;
}
export function useSchedules() {
  const [data, setData] = useState<ScheduleRow[]>([]);
  useEffect(() => {
    void supabase.from("schedules").select("*").gte("event_date", new Date().toISOString().slice(0, 10)).order("event_date").then(({ data }) => setData(data ?? []));
  }, []);
  return data;
}
export function useMembers() {
  const [data, setData] = useState<MemberRow[]>([]);
  useEffect(() => {
    void supabase.from("members").select("*").order("position").order("name").then(({ data }) => setData(data ?? []));
  }, []);
  return data;
}
export function useMoments(activityId?: string) {
  const [moments, setMoments] = useState<MomentRow[]>([]);
  const [photos, setPhotos] = useState<Record<string, PhotoRow[]>>({});
  useEffect(() => {
    let q = supabase.from("moments").select("*").order("event_date", { ascending: false, nullsFirst: false });
    if (activityId) q = q.eq("activity_id", activityId);
    void q.then(async ({ data: m }) => {
      setMoments(m ?? []);
      if (!m?.length) { setPhotos({}); return; }
      const { data: p } = await supabase.from("moment_photos").select("*").in("moment_id", m.map((x) => x.id)).order("position");
      const grouped: Record<string, PhotoRow[]> = {};
      (p ?? []).forEach((ph) => { (grouped[ph.moment_id] ||= []).push(ph); });
      setPhotos(grouped);
    });
  }, [activityId]);
  return { moments, photos };
}
