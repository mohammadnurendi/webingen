import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Hero } from "@/components/site/Hero";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { useActivities, useMoments } from "@/lib/usePublicData";

export const Route = createFileRoute("/moments")({
  head: () => ({ meta: [{ title: "Moments — Ingenious" }] }),
  component: MomentsPage,
});

function MomentsPage() {
  const activities = useActivities();
  const { moments, photos } = useMoments();
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => filter === "all" ? moments : moments.filter((m) => m.activity_id === filter),
    [moments, filter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof moments>();
    filtered.forEach((m) => {
      const key = m.period || (m.event_date ? new Date(m.event_date).toLocaleDateString("id", { month: "long", year: "numeric" }).toUpperCase() : "LAINNYA");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <>
      <Hero eyebrow="MOMENTS" title={<>Momen Sederhana,<br /><span className="text-lime">Kenangan</span> Luar Biasa.</>}
        description="Setiap langkah, tawa, dan keringat yang jatuh adalah bagian dari perjalanan kita bersama." />

      <section className="bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6">
          <button onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === "all" ? "bg-navy text-navy-foreground" : "bg-card text-navy hover:bg-cream"}`}>Semua</button>
          {activities.map((a) => (
            <button key={a.id} onClick={() => setFilter(a.id)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === a.id ? "bg-navy text-navy-foreground" : "bg-card text-navy hover:bg-cream"}`}>
              {a.name}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl space-y-16 px-6">
          {groups.length === 0 && <p className="text-center text-sm text-muted-foreground">Belum ada momen.</p>}
          {groups.map(([period, items]) => (
            <div key={period} className="grid gap-8 md:grid-cols-[200px_1fr]">
              <div>
                <p className="text-xl font-extrabold tracking-wide text-navy">{period}</p>
                <div className="mt-3 h-0.5 w-12 bg-lime" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((m) => {
                  const act = activities.find((a) => a.id === m.activity_id);
                  return (
                    <div key={m.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
                      <PhotoCarousel urls={(photos[m.id] ?? []).map((p) => p.url)} alt={m.title} className="aspect-[4/3]" />
                      <div className="p-4">
                        {act && <p className="text-[10px] font-bold tracking-widest text-lime">{act.name.toUpperCase()}</p>}
                        <p className="text-sm font-extrabold text-navy">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.event_date ?? ""}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
