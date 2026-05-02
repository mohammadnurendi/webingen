import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin, Clock, Camera, Users, MessageCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { gdriveImage } from "@/lib/gdrive";
import { getActivityIcon } from "@/lib/activityIcon";
import { useSettings, buildWaLink } from "@/lib/useSettings";
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
  const settings = useSettings();
  const waLink = buildWaLink(settings.whatsapp_number);

  useEffect(() => {
    void (async () => {
      setLoading(true);
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

  const Icon = getActivityIcon(activity.name, activity.icon, activity.slug);
  const totalPhotos = Object.values(photos).reduce((acc, arr) => acc + arr.length, 0);

  // Group moments by period
  const groups = new Map<string, MomentRow[]>();
  moments.forEach((m) => {
    const key = m.period || (m.event_date ? new Date(m.event_date).toLocaleDateString("id", { month: "long", year: "numeric" }).toUpperCase() : "LAINNYA");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-20 text-navy-foreground md:py-28">
        {activity.image_url && (
          <img src={gdriveImage(activity.image_url)} alt={activity.name} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/80 to-transparent" />
        <div className="absolute -right-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-lime/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <Link to="/activity" className="inline-flex items-center gap-2 text-xs font-bold text-lime hover:underline">
            <ArrowLeft className="h-3 w-3" /> Semua Activity
          </Link>

          <div className="mt-6 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="animate-fade-up">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-lime text-navy shadow-glow ring-4 ring-lime/20">
                <Icon className="h-10 w-10" />
              </div>
              <p className="text-xs font-bold tracking-[0.3em] text-lime">ACTIVITY</p>
              <h1 className="mt-2 text-balance text-5xl font-extrabold italic md:text-7xl">{activity.name}</h1>
              {activity.description && (
                <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">{activity.description}</p>
              )}
            </div>

            {/* stat chips */}
            <div className="flex flex-wrap gap-3">
              <Stat icon={<Calendar className="h-4 w-4" />} value={schedules.length} label="Jadwal" />
              <Stat icon={<Users className="h-4 w-4" />} value={moments.length} label="Moments" />
              <Stat icon={<Camera className="h-4 w-4" />} value={totalPhotos} label="Foto" />
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE TIMELINE */}
      {schedules.length > 0 && (
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-lime">UPCOMING</p>
                <h2 className="text-3xl font-extrabold italic text-navy md:text-4xl">Jadwal Mendatang</h2>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 hidden w-0.5 bg-lime/40 md:block" />
              <div className="space-y-4">
                {schedules.map((s, idx) => {
                  const d = new Date(s.event_date);
                  return (
                    <div key={s.id} className="animate-fade-up md:pl-12" style={{ animationDelay: `${idx * 70}ms` }}>
                      <div className="absolute left-2 mt-6 hidden h-5 w-5 rounded-full border-4 border-cream bg-lime md:block" />
                      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center">
                        <div className="flex w-20 shrink-0 flex-col items-center rounded-2xl border-2 border-lime bg-lime/5 px-3 py-2">
                          <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{d.toLocaleDateString("en", { weekday: "short" }).toUpperCase()}</span>
                          <span className="text-3xl font-extrabold leading-none text-navy">{d.getDate()}</span>
                          <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{d.toLocaleDateString("en", { month: "short" }).toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-extrabold text-navy">{s.title}</p>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {[s.start_time, s.end_time].filter(Boolean).join(" - ") || "TBA"}</span>
                            {s.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MOMENTS GALLERY */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-lime">GALLERY</p>
            <h2 className="text-3xl font-extrabold italic text-navy md:text-4xl">Momen {activity.name}</h2>
          </div>

          {moments.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-muted-foreground/20 p-12 text-center">
              <Camera className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">Belum ada momen untuk activity ini.</p>
            </div>
          ) : Array.from(groups.entries()).map(([period, items]) => (
            <div key={period} className="grid gap-8 md:grid-cols-[200px_1fr]">
              <div className="md:sticky md:top-24 md:self-start">
                <p className="text-xl font-extrabold tracking-wide text-navy">{period}</p>
                <div className="mt-3 h-1 w-12 rounded-full bg-lime" />
                <p className="mt-2 text-xs text-muted-foreground">{items.length} moment{items.length > 1 ? "s" : ""}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m, idx) => (
                  <div key={m.id} className="animate-scale-in group overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${idx * 60}ms` }}>
                    <PhotoCarousel urls={(photos[m.id] ?? []).map((p) => p.url)} alt={m.title} className="aspect-[4/3]" />
                    <div className="p-4">
                      <p className="text-sm font-extrabold text-navy">{m.title}</p>
                      {m.event_date && <p className="text-xs text-muted-foreground">📅 {m.event_date}</p>}
                      {m.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{m.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-navy-foreground md:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-lime">JOIN US</p>
                <h3 className="mt-2 text-2xl font-extrabold italic md:text-3xl">Tertarik ikut <span className="text-lime">{activity.name}</span>?</h3>
                <p className="mt-2 max-w-lg text-sm text-white/70">Hubungi kami atau jelajahi activity lainnya.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-extrabold text-navy shadow-glow">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <Link to="/activity" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-5 py-3 text-sm font-extrabold text-white hover:border-lime hover:text-lime">
                  Activity Lain <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-navy">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-[10px] font-bold tracking-widest text-white/60">{label.toUpperCase()}</p>
      </div>
    </div>
  );
}
