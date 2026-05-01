import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { gdriveImage } from "@/lib/gdrive";
import { adminDelete, adminError, adminInsert, adminList, adminUpdate } from "@/lib/adminApi";

export const Route = createFileRoute("/admin/activities")({ component: AdminActivities });

type Activity = {
  id: string; slug: string; name: string; description: string | null; icon: string | null;
  image_url: string | null; position: number;
};

const empty = { slug: "", name: "", description: "", icon: "", image_url: "", position: 0 };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminActivities() {
  const [list, setList] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState(empty);

  async function load() {
    try {
      setList(await adminList<Activity>({ table: "activities", order: [{ column: "position" }] }));
    } catch (error) {
      toast.error(adminError(error, "Gagal memuat activities"));
    }
  }
  useEffect(() => { void load(); }, []);

  function openNew() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(a: Activity) {
    setEditing(a);
    setForm({ slug: a.slug, name: a.name, description: a.description ?? "", icon: a.icon ?? "", image_url: a.image_url ?? "", position: a.position });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { toast.error("Nama wajib diisi"); return; }
    const slug = form.slug.trim() || slugify(form.name);
    const payload = { ...form, slug, position: Number(form.position) || 0 };
    try {
      if (editing) {
        await adminUpdate({ table: "activities", values: payload, filters: [{ column: "id", value: editing.id }] });
      } else {
        await adminInsert({ table: "activities", values: payload });
      }
      toast.success("Tersimpan");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menyimpan activity"));
    }
  }

  async function remove(a: Activity) {
    if (!confirm(`Hapus activity "${a.name}"?`)) return;
    try {
      await adminDelete({ table: "activities", filters: [{ column: "id", value: a.id }] });
      toast.success("Terhapus");
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menghapus activity"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Activities"
        description="Kelola jenis kegiatan yang dilakukan komunitas."
        action={<Button onClick={openNew} className="bg-navy text-navy-foreground"><Plus className="mr-2 h-4 w-4" /> Tambah</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <div key={a.id} className="rounded-2xl bg-card p-5 shadow-soft">
            {a.image_url && <img src={gdriveImage(a.image_url)} alt={a.name} className="mb-3 h-32 w-full rounded-xl object-cover" loading="lazy" />}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold tracking-widest text-lime">{a.icon || "ACTIVITY"}</p>
                <p className="text-lg font-extrabold text-navy">{a.name}</p>
                <p className="text-xs text-muted-foreground">/{a.slug} · pos {a.position}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="rounded-lg p-2 text-navy hover:bg-cream"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(a)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            {a.description && <p className="mt-3 text-sm text-muted-foreground">{a.description}</p>}
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">Belum ada activity. Klik "Tambah" untuk mulai.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Activity" : "Tambah Activity"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nama *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Slug (otomatis dari nama bila kosong)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="futsal" /></div>
            <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Icon (emoji atau nama)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚽ atau Bike" /></div>
            <div><Label>Cover Image — Google Drive link</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://drive.google.com/file/d/..." /></div>
            <div><Label>Posisi (urutan)</Label><Input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save} className="bg-navy text-navy-foreground">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
