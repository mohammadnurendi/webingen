import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Login — Ingenious" }] }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Email tidak valid" }).max(255),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }).max(100),
});

function AuthPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Input tidak valid");
      return;
    }
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(mode === "signin" ? "Berhasil masuk" : "Akun dibuat. Silakan login.");
    if (mode === "signup") setMode("signin");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-soft">
        <Link to="/" className="mb-6 inline-flex items-center gap-2">
          <img src={logo} alt="Ingenious" className="h-9 w-auto" />
        </Link>
        <h1 className="text-2xl font-extrabold italic text-navy">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Masuk untuk mengelola konten." : "Buat akun admin pertama."}
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-navy text-navy-foreground hover:bg-navy/90">
            {busy ? "Memproses..." : mode === "signin" ? "Masuk" : "Daftar"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-navy"
        >
          {mode === "signin" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
        <p className="mt-6 text-xs text-muted-foreground">
          Catatan: Akun yang baru daftar belum punya akses admin. Hubungi admin awal untuk diberi role admin (atau set di tabel user_roles).
        </p>
      </div>
    </div>
  );
}
