import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { verifyAdminSession } from "@/lib/admin.functions";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // defer role check to avoid deadlock
        setLoading(true);
        setTimeout(() => {
          void checkAdmin(sess.access_token).finally(() => setLoading(false));
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void checkAdmin(s.access_token).finally(() => setLoading(false));
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    }).catch(() => {
      setIsAdmin(false);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(accessToken: string) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const result = await verifyAdminSession({ data: { accessToken } });
        setIsAdmin(result.isAdmin);
        return;
      } catch {
        if (attempt < 2) {
          await new Promise((resolve) => window.setTimeout(resolve, 600 * (attempt + 1)));
        }
      }
    }

    setIsAdmin(false);
  }

  const value: AuthCtx = {
    user, session, isAdmin, loading,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signUp: async (email, password) => {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } });
      return { error: error?.message ?? null };
    },
    signOut: async () => { await supabase.auth.signOut(); },
    refreshAdmin: async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (s?.user) await checkAdmin(s.access_token);
      else setIsAdmin(false);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
