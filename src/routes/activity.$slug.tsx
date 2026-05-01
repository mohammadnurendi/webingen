import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { gdriveImage } from "@/lib/gdrive";
import type { ActivityRow, MomentRow, PhotoRow, ScheduleRow } from "@/lib/usePublicData";

export const Route = createFileRoute("/activity/$slug")({
  component: ActivityDetail,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-3xl font-extrabold italic text-navy">Activity tidak ditemukan</h1>
        <Link to="/activity" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-lime"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
      </div>
    </div>
  ),
});

function ActivityDetail() {
  const { slug } = Route.useParams();
  const [activity, setActivity] = useState<ActivityRow | null>(null);
  const [moments, setMoments] = useState<MomentRow[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [photos, setPhotos] = useState<Record<string, PhotoRow[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data: a } = await supabase.from("activities").select("*").eq("slug", slug).maybeSingle();
      if (!a) { setLoading(false); return; }
      setActivity(a as ActivityRow);
      const [{ data: m }, { data: s }] = await Promise.all([
        supabase.from("moments").select("*").eq("activity_id", a.id).order("event_date", { ascending: false, nullsFirst: false }),
        supabase.from("schedules").select("*").eq("activity_id", a.id).gte("event_date", new Date().toISOString().slice(0, 10)).order("event_date"),
      ]);
      setMoments((m ?? []) as MomentRow[]);
      setSchedules((s ?? []) as ScheduleRow[]);
      if (m?.length) {
        const { data: p } = await supabase.from("moment_photos").select("*").in("moment_id", m.map((x) => x.id)).order("position");
        const grouped: Record<string, PhotoRow[]> = {};
        (p ?? []).forEach((ph) => { (grouped[ph.moment_id] ||= []).push(ph); });
        setPhotos(grouped);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Memuat...</div>;
  if (!activity) throw notFound();

  // Group moments by period
  const groups = new Map<string, MomentRow[]>();
  moments.forEach((m) => {
    const key = m.period || (m.event_date ? new Date(m.event_date).toLocaleDateString("id", { month: "long", year: "numeric" }).toUpperCase() : "LAINNYA");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  });

  return (
    <>
      <section className="relative overflow-hidden bg-navy py-20 text-navy-foreground">
        {activity.image_url && <img src={gdriveImage(activity.image_url)} alt={activity.name} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="relative mx-auto max-w-7xl px-6">
          <Link to="/activity" className="inline-flex items-center gap-2 text-xs font-bold text-lime hover:underline"><ArrowLeft className="h-3 w-3" /> Semua Activity</Link>
          <h1 className="mt-4 text-balance text-5xl font-extrabold italic md:text-6xl">{activity.name}</h1>
          {activity.description && <p className="mt-4 max-w-2xl text-white/80">{activity.description}</p>}
        </div>
      </section>

      {schedules.length > 0 && (
        <section className="bg-cream py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-6 text-2xl font-extrabold italic text-navy">Jadwal Mendatang</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {schedules.map((s) => {
                const d = new Date(s.event_date);
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
                    <Calendar className="h-5 w-5 text-lime" />
                    <div>
                      <p className="text-sm font-extrabold text-navy">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{d.toLocaleDateString("id", { day: "numeric", month: "long", year: "numeric" })} · {[s.start_time, s.end_time].filter(Boolean).join("-") || "TBA"}</p>
                      {s.location && <p className="text-xs text-muted-foreground">{s.location}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl space-y-12 px-6">
          <h2 className="text-3xl font-extrabold italic text-navy">Momen {activity.name}</h2>
          {moments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada momen untuk activity ini.</p>
          ) : Array.from(groups.entries()).map(([period, items]) => (
            <div key={period} className="grid gap-8 md:grid-cols-[180px_1fr]">
              <div>
                <p className="text-xl font-extrabold tracking-wide text-navy">{period}</p>
                <div className="mt-3 h-0.5 w-12 bg-lime" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => (
                  <div key={m.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
                    <PhotoCarousel urls={(photos[m.id] ?? []).map((p) => p.url)} alt={m.title} className="aspect-[4/3]" />
                    <div className="p-4">
                      <p className="text-sm font-extrabold text-navy">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.event_date}</p>
                      {m.description && <p className="mt-2 text-xs text-muted-foreground">{m.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
