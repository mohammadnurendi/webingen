import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { gdriveImage } from "@/lib/gdrive";
import { adminDelete, adminError, adminInsert, adminList, adminUpdate } from "@/lib/adminApi";

export const Route = createFileRoute("/admin/members")({ component: AdminMembers });

type Member = { id: string; name: string; role: string | null; photo_url: string | null; quote: string | null; featured: boolean; position: number };
const empty = { name: "", role: "", photo_url: "", quote: "", featured: false, position: 0 };

function AdminMembers() {
  const [list, setList] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(empty);

  async function load() {
    try {
      setList(await adminList<Member>({ table: "members", order: [{ column: "position" }, { column: "name" }] }));
    } catch (error) {
      toast.error(adminError(error, "Gagal memuat members"));
    }
  }
  useEffect(() => { void load(); }, []);

  function openNew() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(m: Member) {
    setEditing(m);
    setForm({
      name: m.name, role: m.role ?? "", photo_url: m.photo_url ?? "",
      quote: m.quote ?? "", featured: m.featured, position: m.position,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { toast.error("Nama wajib diisi"); return; }
    const payload = { ...form, position: Number(form.position) || 0 };
    try {
      if (editing) {
        await adminUpdate({ table: "members", values: payload, filters: [{ column: "id", value: editing.id }] });
      } else {
        await adminInsert({ table: "members", values: payload });
      }
      toast.success("Tersimpan");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menyimpan member"));
    }
  }

  async function remove(m: Member) {
    if (!confirm(`Hapus member "${m.name}"?`)) return;
    try {
      await adminDelete({ table: "members", filters: [{ column: "id", value: m.id }] });
      toast.success("Terhapus");
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menghapus member"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Members"
        description="Tambah, ubah, atau hapus anggota komunitas. Tandai sebagai 'featured' untuk Member Spotlight."
        action={<Button onClick={openNew} className="bg-navy text-navy-foreground"><Plus className="mr-2 h-4 w-4" /> Tambah Member</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <div key={m.id} className="rounded-2xl bg-card p-5 shadow-soft">
            <div className="flex items-start gap-4">
              {m.photo_url ? (
                <img src={gdriveImage(m.photo_url)} alt={m.name} className="h-16 w-16 rounded-full object-cover" loading="lazy" />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-full bg-cream text-xl font-extrabold text-navy">{m.name[0]}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-base font-extrabold text-navy">{m.name}</p>
                  {m.featured && <Star className="h-3.5 w-3.5 fill-lime text-lime" />}
                </div>
                <p className="text-xs text-muted-foreground">{m.role ?? "—"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(m)} className="rounded p-1.5 hover:bg-cream"><Pencil className="h-4 w-4 text-navy" /></button>
                <button onClick={() => remove(m)} className="rounded p-1.5 hover:bg-rose-50"><Trash2 className="h-4 w-4 text-rose-600" /></button>
              </div>
            </div>
            {m.quote && <p className="mt-3 text-sm italic text-muted-foreground">"{m.quote}"</p>}
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">Belum ada member.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Tambah Member"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nama *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Role / Divisi</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Futsal Division" /></div>
            <div><Label>Foto — Google Drive link</Label><Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="https://drive.google.com/file/d/..." /></div>
            <div><Label>Quote</Label><Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Posisi</Label><Input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} /></div>
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4" />
                <span className="text-sm">Featured (Member Spotlight)</span>
              </label>
            </div>
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
