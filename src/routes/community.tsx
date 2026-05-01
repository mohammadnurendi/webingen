import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote, MessageCircle, Calendar } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { SectionTitle } from "@/components/site/SectionTitle";
import { useMembers } from "@/lib/usePublicData";
import { useSettings, buildWaLink } from "@/lib/useSettings";
import { gdriveImage } from "@/lib/gdrive";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — Ingenious" }] }),
  component: CommunityPage,
});

function CommunityPage() {
  const members = useMembers();
  const featured = members.filter((m) => m.featured);
  const settings = useSettings();
  const waLink = buildWaLink(settings.whatsapp_number);

  return (
    <>
      <Hero eyebrow="COMMUNITY" title={<>The People<br />Behind <span className="text-lime">Ingenious</span></>}
        description="Kami berbeda latar, tapi punya tujuan yang sama. Belajar, bertumbuh, dan memberi manfaat bersama." />

      {featured.length > 0 && (
        <section className="bg-background py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle eyebrow="MEMBER SPOTLIGHT" title={<>Kenalan dengan<br />Teman-Teman Kami</>} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <div key={m.id} className="rounded-2xl bg-card p-6 shadow-soft">
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-lime to-navy p-1">
                    {m.photo_url ? (
                      <img src={gdriveImage(m.photo_url)} alt={m.name} className="h-full w-full rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="grid h-full w-full place-items-center rounded-full bg-cream text-3xl font-extrabold text-navy">{m.name[0]}</div>
                    )}
                  </div>
                  <p className="mt-4 text-center text-base font-extrabold text-navy">{m.name}</p>
                  <p className="text-center text-xs text-muted-foreground">{m.role}</p>
                  {m.quote && (
                    <>
                      <Quote className="mx-auto mt-4 h-4 w-4 text-lime" />
                      <p className="mt-2 text-center text-sm italic text-muted-foreground">"{m.quote}"</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="ALL MEMBERS" title="Seluruh Anggota" />
          {members.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Belum ada member. Tambah di admin.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
              {members.map((m) => (
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
          )}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-lime">SIAP JADI BAGIAN?</p>
            <h3 className="mt-1 text-3xl font-extrabold italic text-navy">Yuk, Jadi Bagian dari <span className="text-lime">Ingenious</span>!</h3>
          </div>
          <div className="flex gap-3">
            <Link to="/join" className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-extrabold text-navy"><Calendar className="h-4 w-4" /> Join Now <ArrowRight className="h-4 w-4" /></Link>
            <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-navy px-5 py-3 text-sm font-extrabold text-navy"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
