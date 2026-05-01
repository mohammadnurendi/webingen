import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LayoutDashboard, Activity as ActivityIcon, Calendar, Users, Camera, Settings, LogOut, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Ingenious" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin" as const, label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/activities" as const, label: "Activities", Icon: ActivityIcon },
  { to: "/admin/schedules" as const, label: "Jadwal", Icon: Calendar },
  { to: "/admin/members" as const, label: "Members", Icon: Users },
  { to: "/admin/moments" as const, label: "Moments", Icon: Camera },
  { to: "/admin/settings" as const, label: "Settings", Icon: Settings },
];

function AdminLayout() {
  const { user, isAdmin, loading, signOut, signIn, refreshAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Memuat...</div>;
  }

  if (!user) {
    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || password.length < 6) { toast.error("Email & password (min 6 karakter) wajib diisi"); return; }
      setBusy(true);
      const { error } = await signIn(email.trim(), password);
      setBusy(false);
      if (error) toast.error(error);
      else toast.success("Berhasil masuk");
    };
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-soft">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <img src={logo} alt="Ingenious" className="h-9 w-auto" />
          </Link>
          <h1 className="text-2xl font-extrabold italic text-navy">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Masuk untuk mengelola konten.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-navy text-navy-foreground hover:bg-navy/90">
              {busy ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4">
        <div className="max-w-md rounded-3xl bg-card p-8 text-center shadow-soft">
          <h1 className="text-2xl font-extrabold italic text-navy">Akses Ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Akun <span className="font-semibold">{user.email}</span> belum punya role admin. Minta admin menambahkan role-mu di tabel <code className="rounded bg-muted px-1">user_roles</code>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={async () => { await refreshAdmin(); toast.success("Status diperbarui"); }}>Cek Ulang</Button>
            <Button variant="outline" onClick={() => signOut()}>Keluar</Button>
            <Button asChild className="bg-navy text-navy-foreground"><Link to="/">Ke Beranda</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Ingenious" className="h-8 w-auto" />
            <span className="text-sm font-extrabold text-navy">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? "bg-navy text-navy-foreground" : "text-navy/80 hover:bg-cream"}`}
              >
                <n.Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <a href="/" target="_blank" rel="noreferrer" className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-navy/70 hover:bg-cream">
            <ExternalLink className="h-3.5 w-3.5" /> Lihat Website
          </a>
          <button onClick={() => signOut()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-600 hover:bg-rose-50">
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Ingenious" className="h-8 w-auto" />
            <span className="text-sm font-extrabold text-navy">ADMIN</span>
          </Link>
          <button onClick={() => signOut()} className="text-xs font-semibold text-rose-600">Keluar</button>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 md:hidden">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${active ? "bg-navy text-navy-foreground" : "text-navy/70"}`}>
                {n.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
