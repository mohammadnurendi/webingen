import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminError, adminList, adminUpsert } from "@/lib/adminApi";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const [googleFormUrl, setGoogleFormUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void adminList<{ google_form_url: string | null; whatsapp_number: string | null }>({
      table: "app_settings",
      filters: [{ column: "id", value: 1 }],
    }).then(([data]) => {
      if (data) {
        setGoogleFormUrl(data.google_form_url ?? "");
        setWhatsapp(data.whatsapp_number ?? "");
      }
    }).catch((error) => {
      toast.error(adminError(error, "Gagal memuat pengaturan"));
    });
  }, []);

  async function save() {
    setSaving(true);
    try {
      await adminUpsert({
        table: "app_settings",
        values: { id: 1, google_form_url: googleFormUrl.trim(), whatsapp_number: whatsapp.trim() },
      });
      toast.success("Pengaturan disimpan");
    } catch (error) {
      toast.error(adminError(error, "Gagal menyimpan pengaturan"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Pengaturan" description="Atur link Google Form dan nomor WhatsApp untuk halaman Join." />
      <div className="space-y-5 rounded-2xl bg-card p-6 shadow-soft">
        <div>
          <Label htmlFor="gform">Google Form URL (untuk tombol "Mulai Bergabung")</Label>
          <Input id="gform" value={googleFormUrl} onChange={(e) => setGoogleFormUrl(e.target.value)} placeholder="https://forms.gle/..." />
        </div>
        <div>
          <Label htmlFor="wa">Nomor WhatsApp (format 08xxx atau 628xxx)</Label>
          <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="085161302226" />
          <p className="mt-1 text-xs text-muted-foreground">Akan otomatis dikonversi ke format wa.me/62…</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-navy text-navy-foreground">
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
