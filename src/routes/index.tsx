import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Users, MessageCircle } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ActivityCard } from "@/components/site/ActivityCard";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { useActivities, useMembers, useMoments, useSchedules } from "@/lib/usePublicData";
import { useSettings, buildWaLink } from "@/lib/useSettings";
import { gdriveImage } from "@/lib/gdrive";
import { Sparkles as SparkIcon, Heart, Bike, Users as UsersIcon } from "lucide-react";
import { getActivityIcon } from "@/lib/activityIcon";
import heroImg from "@/assets/ing1.png";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Ingenious Community — Learn, Grow, Connect" },
      {
        name: "description",
        content: "Komunitas tempat bergerak, bertumbuh, dan memberi manfaat bersama.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  component: HomePage,
}));

const fallbackIcons = [Heart, SparkIcon, Bike, UsersIcon];

function HomePage() {
  const activities = useActivities();
  const members = useMembers();
  const schedules = useSchedules();
  const { moments, photos } = useMoments();
  const settings = useSettings();
  const waLink = buildWaLink(settings.whatsapp_number);

  return (
    <>
      <Hero
        eyebrow=""
        title={<>Ingenious<br />Community</>}
        description="Dari angkatan, menjadi ruang untuk bergerak, bertumbuh, dan memberi manfaat bersama."
        bgImage={heroImg}
      >
        <p className="mb-1 w-full text-xs font-bold tracking-[0.3em] text-lime">LEARN • GROW • CONNECT</p>
        <Link to="/activity" className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-extrabold text-navy shadow-glow">
          Join Activity <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/community" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-extrabold text-white hover:border-lime hover:text-lime">
          Explore Community
        </Link>
      </Hero>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.25em] text-lime">ABOUT US</p>
            <h2 className="text-balance text-2xl font-extrabold italic text-navy sm:text-3xl md:text-4xl">
              Lebih dari sekadar angkatan,<br />kita adalah gerakan.
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
              Ingenious hadir untuk saling belajar, bertumbuh, dan terhubung melalui kegiatan positif yang memberi dampak nyata.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 self-center sm:gap-4">
            {[
              { Icon: Users, label: "BROTHERHOOD", desc: "Kebersamaan yang tulus dan suportif." },
              { Icon: Sparkles, label: "GROWTH", desc: "Terus belajar dan menjadi versi terbaik." },
              { Icon: ShieldCheck, label: "MOVEMENT", desc: "Bergerak bersama, memberi manfaat." },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-cream text-navy ring-4 ring-lime/30 sm:h-16 sm:w-16">
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <p className="text-[10px] font-extrabold tracking-wider text-navy sm:text-xs">{label}</p>
                <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle 
            eyebrow="WHAT WE DO" 
            title="Kegiatan Kami"
            action={activities.length > 4 ? <Link to="/activity" className="inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-lime">Lihat semua <ArrowRight className="h-4 w-4" /></Link> : undefined}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activities.slice(0, 4).map((a, i) => (
              <Link key={a.id} to="/activity/$slug" params={{ slug: a.slug }}>
                <ActivityCard Icon={getActivityIcon(a.name, a.icon, a.slug)} title={a.name} description={a.description ?? ""} variant={i % 2 === 0 ? "lime" : "navy"} tint={i % 2 === 0 ? "cream" : "white"} />
              </Link>
            ))}
            {activities.length === 0 && <p className="col-span-full text-sm text-muted-foreground">Belum ada activity. Tambahkan di admin.</p>}
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="NEXT MOVES" title="Jadwal Mendatang" />
          {schedules.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Belum ada jadwal mendatang.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {schedules.slice(0, 3).map((s) => {
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
          <SectionTitle 
            eyebrow="THE PEOPLE" 
            title="Komunitas Kami"
            action={members.length > 6 ? <Link to="/community" className="inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-lime">Lihat semua <ArrowRight className="h-4 w-4" /></Link> : undefined}
          />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
            {members.slice(0, 6).map((m) => (
              <div key={m.id} className="text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-lime to-navy p-1">
                  {m.photo_url ? (
                    <img src={gdriveImage(m.photo_url)} alt={m.name} className="h-full w-full rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded-full bg-cream text-2xl font-extrabold text-navy">{m.name[0]}</div>
                  )}
                </div>
                <p className="mt-3 text-sm font-extrabold text-navy">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle 
            eyebrow="MOMENTS" 
            title="Momen Kebersamaan"
            action={moments.length > 5 ? <Link to="/moments" className="inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-lime">Lihat semua <ArrowRight className="h-4 w-4" /></Link> : undefined}
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {moments.slice(0, 5).map((m) => (
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

      <section className="bg-background pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-6 text-navy-foreground sm:p-10 md:p-14">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lime/20 blur-3xl" />
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-balance text-2xl font-extrabold italic sm:text-3xl md:text-4xl">
                  Be Part of<br />the <span className="text-lime">Movement</span>
                </h3>
                <p className="mt-3 max-w-md text-sm text-white/70">
                  Komunitas terbuka terbatas untuk kamu yang ingin bergerak, bertumbuh, dan memberi manfaat bersama.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <a href={waLink} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-lime/40 hover:bg-white/10">
                  <p className="mb-1 text-xs font-bold tracking-widest text-lime">Join Us</p>
                  <p className="mb-4 text-xs text-white/70">Hubungi kami via WhatsApp</p>
                  <span className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-xs font-extrabold text-navy"><MessageCircle className="h-3 w-3" /> Chat Now</span>
                </a>
                <Link to="/join" className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-lime/40 hover:bg-white/10">
                  <p className="mb-1 text-xs font-bold tracking-widest text-lime">Become a Member</p>
                  <p className="mb-4 text-xs text-white/70">Isi form singkat untuk bergabung</p>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-navy">Isi Formulir <ArrowRight className="h-3 w-3" /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
