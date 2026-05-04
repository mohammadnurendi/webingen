import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ActivityCard } from "@/components/site/ActivityCard";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { useActivities, useMoments, useSchedules } from "@/lib/usePublicData";
import { useSettings, buildWaLink } from "@/lib/useSettings";
import { getActivityIcon } from "@/lib/activityIcon";
import heroImg from "@/assets/ing2.png";

export const Route = createFileRoute("/activity")(({
  head: () => ({ meta: [{ title: "Activity — Ingenious Community" }] }),
  component: ActivityPage,
}));

function ActivityPage() {
  const activities = useActivities();
  const schedules = useSchedules();
  const { moments, photos } = useMoments();
  const settings = useSettings();
  const waLink = buildWaLink(settings.whatsapp_number);

  return (
    <>
      <Hero 
        eyebrow="ACTIVITY" 
        title={<>Let's Move<br />Together</>}
        description="Berbagai kegiatan positif yang kami lakukan untuk belajar, bertumbuh, dan memberi manfaat."
        bgImage={heroImg}
      >
        <a href="#schedule" className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-extrabold text-navy shadow-glow">
          <Calendar className="h-4 w-4" /> Jadwal Mendatang <ArrowRight className="h-4 w-4" />
        </a>
      </Hero>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="OUR ACTIVITIES" title="Apa yang Kami Lakukan" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((a, i) => (
              <Link key={a.id} to="/activity/$slug" params={{ slug: a.slug }}>
                <ActivityCard Icon={getActivityIcon(a.name, a.icon, a.slug)} title={a.name} description={a.description ?? ""}
                  variant={i % 2 === 0 ? "lime" : "navy"} tint={i % 2 === 0 ? "cream" : "white"} />
              </Link>
            ))}
            {activities.length === 0 && <p className="col-span-full text-sm text-muted-foreground">Belum ada activity. Tambah di admin.</p>}
          </div>
        </div>
      </section>

      <section id="schedule" className="bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="UPCOMING SCHEDULE" title="Jadwal Mendatang" />
          {schedules.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Belum ada jadwal mendatang.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {schedules.map((s) => {
                const d = new Date(s.event_date);
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
                    <div className="flex w-16 flex-col items-center rounded-2xl border-2 border-lime px-3 py-2">
                      <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{d.toLocaleDateString("en", { weekday: "short" }).toUpperCase()}</span>
                      <span className="text-2xl font-extrabold leading-none text-navy">{d.getDate()}</span>
                      <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{d.toLocaleDateString("en", { month: "short" }).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-navy">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{[s.start_time, s.end_time].filter(Boolean).join(" - ") || "TBA"}</p>
                      <p className="text-xs text-muted-foreground">{s.location ?? "—"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="RECENT" title="Kegiatan Terbaru" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moments.slice(0, 4).map((m) => (
              <div key={m.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
                <PhotoCarousel urls={(photos[m.id] ?? []).map((p) => p.url)} alt={m.title} className="aspect-square" />
                <div className="p-3">
                  <p className="text-sm font-extrabold text-navy">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.event_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream pb-12 sm:pb-16 pt-4 sm:pt-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
          <div>
            <p className="text-2xl font-extrabold italic text-navy">Siap untuk <span className="text-lime">Aktivitas</span> Berikutnya?</p>
            <p className="mt-1 text-sm text-muted-foreground">Ayo bergerak bareng bersama Ingenious!</p>
          </div>
          <div className="flex gap-3">
            <a href="#schedule" className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-extrabold text-navy"><Calendar className="h-4 w-4" /> Lihat Jadwal</a>
            <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-navy px-5 py-3 text-sm font-extrabold text-navy hover:border-lime hover:text-lime"><MessageCircle className="h-4 w-4" /> Chat</a>
          </div>
        </div>
      </section>
    </>
  );
}
