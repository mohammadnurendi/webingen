import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, MessageCircle, CheckCircle2, Users, Sparkles, Zap, Heart, FileText, MessageSquare, UsersRound, Handshake, Star, Plus, Minus } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { useSettings, buildWaLink } from "@/lib/useSettings";
import { toast } from "sonner";
import heroImg from "@/assets/ing5.png";

export const Route = createFileRoute("/join")(({
  head: () => ({ meta: [{ title: "Join — Ingenious Community" }] }),
  component: JoinPage,
}));

const values = [
  { Icon: Users, label: "Brotherhood", desc: "Kebersamaan yang tulus dan saling support." },
  { Icon: Sparkles, label: "Growth", desc: "Terus belajar dan jadi versi terbaik dari diri sendiri." },
  { Icon: Zap, label: "Movement", desc: "Bergerak bersama, memberi manfaat dan inspirasi." },
  { Icon: Heart, label: "Impact", desc: "Memberi dampak positif untuk lingkungan sekitar." },
];
const steps = [
  { Icon: FileText, title: "Isi Formulir", desc: "Isi data diri pada form pendaftaran singkat." },
  { Icon: MessageSquare, title: "Kenal Lebih Dekat", desc: "Tim kami akan menghubungi untuk sesi kenal." },
  { Icon: UsersRound, title: "Trial Activity", desc: "Ikuti salah satu kegiatan untuk merasakan vibe-nya." },
  { Icon: Handshake, title: "Review", desc: "Tim akan melakukan review dan memberikan konfirmasi." },
  { Icon: Star, title: "Welcome!", desc: "Selamat! Kamu resmi menjadi bagian Ingenious." },
];
const faqs = [
  { q: "Apakah ada biaya untuk bergabung?", a: "Sebagian besar kegiatan gratis. Untuk kegiatan tertentu mungkin ada iuran kecil." },
  { q: "Kegiatan apa saja yang ada?", a: "Lihat halaman Activity untuk daftar lengkap." },
  { q: "Berapa lama proses bergabung?", a: "Sekitar 1-2 minggu mulai dari isi formulir hingga resmi menjadi member." },
  { q: "Apakah wajib ikut semua kegiatan?", a: "Tidak. Kamu bebas memilih kegiatan sesuai minat." },
];

function JoinPage() {
  const [open, setOpen] = useState<number | null>(0);
  const settings = useSettings();
  const waLink = buildWaLink(settings.whatsapp_number);

  function handleJoinClick(e: React.MouseEvent) {
    if (!settings.google_form_url) {
      e.preventDefault();
      toast.error("Link Google Form belum diatur. Hubungi admin.");
    }
  }

  return (
    <>
      <Hero 
        eyebrow="JOIN" 
        title={<>Be Part of<br />the <span className="text-lime">Movement.</span></>}
        description="Ingenious bukan hanya tentang kegiatan, tapi tentang kebersamaan yang bikin kita jadi lebih baik."
        bgImage={heroImg}
      >
        <a href={settings.google_form_url || "#"} onClick={handleJoinClick} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-extrabold text-navy shadow-glow">
          Mulai Bergabung <ArrowRight className="h-4 w-4" />
        </a>
        <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-extrabold text-white hover:border-lime hover:text-lime">
          <MessageCircle className="h-4 w-4" /> Chat WhatsApp
        </a>
      </Hero>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-cream p-6 sm:p-8 shadow-soft">
            <p className="mb-2 text-xs font-bold tracking-[0.25em] text-lime">SIAPA KITA?</p>
            <h2 className="text-3xl font-extrabold italic text-navy">Tentang Ingenious</h2>
            <p className="mt-4 text-sm text-muted-foreground">Berawal dari ikatan angkatan, kini Ingenious menjadi komunitas yang aktif, positif, dan terus bertumbuh.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {values.map((v) => (
                <div key={v.label}>
                  <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-navy text-lime"><v.Icon className="h-5 w-5" /></div>
                  <p className="text-sm font-extrabold text-navy">{v.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-cream p-6 sm:p-8 shadow-soft">
            <p className="mb-2 text-xs font-bold tracking-[0.25em] text-lime">SIAPA YANG BISA BERGABUNG?</p>
            <h2 className="text-3xl font-extrabold italic text-navy">We're Open for You!</h2>
            <ul className="mt-6 space-y-3">
              {["Punya semangat untuk bertumbuh", "Ingin terlibat dalam kegiatan positif", "Menjunjung nilai kebersamaan dan respect"].map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-navy">
                  <CheckCircle2 className="h-5 w-5 text-lime" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-2 text-xs font-bold tracking-[0.25em] text-lime">ALUR BERGABUNG</p>
          <h2 className="mb-8 sm:mb-12 text-3xl font-extrabold italic text-navy">Bagaimana Cara Bergabung?</h2>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-card shadow-soft">
                  <s.Icon className="h-8 w-8 text-navy" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-navy text-xs font-extrabold text-lime">{i + 1}</span>
                </div>
                <p className="mt-4 text-sm font-extrabold text-navy">{s.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background pb-12 sm:pb-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-soft">
            <h2 className="text-2xl font-extrabold italic text-navy">FAQ</h2>
            <div className="mt-6 space-y-2">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q} className="rounded-xl border border-border">
                    <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-bold text-navy">
                      <span>{f.q}</span>
                      {isOpen ? <Minus className="h-4 w-4 text-lime" /> : <Plus className="h-4 w-4 text-lime" />}
                    </button>
                    {isOpen && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-navy p-6 sm:p-8 text-navy-foreground shadow-soft">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-lime/20 blur-3xl" />
            <p className="relative text-xs font-bold tracking-[0.25em] text-lime">SIAP BERGABUNG?</p>
            <h3 className="relative mt-2 text-3xl font-extrabold italic">Mulai sekarang, <br /><span className="text-lime">jadi bagian kami!</span></h3>
            <div className="relative mt-6 space-y-3">
              <a href={settings.google_form_url || "#"} onClick={handleJoinClick} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-lime px-4 py-3 text-sm font-extrabold text-navy">
                <span>Isi Formulir Pendaftaran</span> <ArrowRight className="h-4 w-4" />
              </a>
              <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white">
                <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-lime" /> WhatsApp {settings.whatsapp_number}</span> <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/community" className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white">
                <span>Lihat Member Komunitas</span> <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
