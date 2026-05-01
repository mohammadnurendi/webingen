import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { gdriveImage } from "@/lib/gdrive";
import { adminDelete, adminError, adminInsert, adminList, adminUpdate } from "@/lib/adminApi";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/admin/moments")({ component: AdminMoments });

const MAX_PHOTOS = 5;

type Moment = { id: string; title: string; description: string | null; activity_id: string | null; period: string | null; event_date: string | null };
type Photo = { id: string; moment_id: string; url: string; position: number };
type Activity = { id: string; name: string };

const empty = { title: "", description: "", activity_id: "", period: "", event_date: "" };

function AdminMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [photosByMoment, setPhotosByMoment] = useState<Record<string, Photo[]>>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Moment | null>(null);
  const [form, setForm] = useState(empty);
  const [photoLinks, setPhotoLinks] = useState<string[]>([""]);

  async function load() {
    try {
      const [m, p, a] = await Promise.all([
        adminList<Moment>({ table: "moments", order: [{ column: "event_date", ascending: false, nullsFirst: false }] }),
        adminList<Photo>({ table: "moment_photos", order: [{ column: "position" }] }),
        adminList<Activity>({ table: "activities", select: "id, name", order: [{ column: "name" }] }),
      ]);
      setMoments(m);
      setActivities(a);
      const grouped: Record<string, Photo[]> = {};
      p.forEach((ph) => { (grouped[ph.moment_id] ||= []).push(ph); });
      setPhotosByMoment(grouped);
    } catch (error) {
      toast.error(adminError(error, "Gagal memuat moments"));
    }
  }
  useEffect(() => { void load(); }, []);

  function openNew() {
    setEditing(null); setForm(empty); setPhotoLinks([""]); setOpen(true);
  }
  function openEdit(m: Moment) {
    setEditing(m);
    setForm({
      title: m.title, description: m.description ?? "", activity_id: m.activity_id ?? "",
      period: m.period ?? "", event_date: m.event_date ?? "",
    });
    const existing = (photosByMoment[m.id] ?? []).map((p) => p.url);
    setPhotoLinks(existing.length ? existing : [""]);
    setOpen(true);
  }

  function updatePhoto(idx: number, val: string) {
    setPhotoLinks((cur) => cur.map((p, i) => (i === idx ? val : p)));
  }
  function addPhoto() {
    setPhotoLinks((cur) => (cur.length >= MAX_PHOTOS ? cur : [...cur, ""]));
  }
  function removePhoto(idx: number) {
    setPhotoLinks((cur) => (cur.length === 1 ? [""] : cur.filter((_, i) => i !== idx)));
  }

  async function save() {
    if (!form.title.trim()) { toast.error("Judul wajib diisi"); return; }
    const payload = {
      ...form,
      activity_id: form.activity_id || null,
      event_date: form.event_date || null,
      period: form.period || null,
    };
    try {
      const moment = editing
        ? await adminUpdate<Moment>({ table: "moments", values: payload, filters: [{ column: "id", value: editing.id }], select: "*", single: true })
        : await adminInsert<Moment>({ table: "moments", values: payload, select: "*", single: true });
      const momentId = moment.id;

      await adminDelete({ table: "moment_photos", filters: [{ column: "moment_id", value: momentId }] });
      const cleaned = photoLinks.map((p) => p.trim()).filter(Boolean).slice(0, MAX_PHOTOS);
      if (cleaned.length) {
        const rows = cleaned.map((url, i) => ({ moment_id: momentId, url, position: i }));
        await adminInsert({ table: "moment_photos", values: rows });
      }
      toast.success("Tersimpan");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menyimpan moment"));
    }
  }

  async function remove(m: Moment) {
    if (!confirm(`Hapus moment "${m.title}"?`)) return;
    try {
      await adminDelete({ table: "moment_photos", filters: [{ column: "moment_id", value: m.id }] });
      await adminDelete({ table: "moments", filters: [{ column: "id", value: m.id }] });
      toast.success("Terhapus");
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menghapus moment"));
    }
  }

  const actName = (id: string | null) => activities.find((a) => a.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="Moments"
        description="Upload foto kegiatan dari perangkat. Maksimal 5 foto per moment, ditampilkan sebagai carousel."
        action={<Button onClick={openNew} className="bg-navy text-navy-foreground"><Plus className="mr-2 h-4 w-4" /> Tambah Moment</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moments.map((m) => {
          const photos = photosByMoment[m.id] ?? [];
          const cover = photos[0];
          return (
            <div key={m.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              {cover ? (
                <img src={gdriveImage(cover.url)} alt={m.title} className="h-40 w-full object-cover" loading="lazy" />
              ) : (
                <div className="grid h-40 w-full place-items-center bg-gradient-to-br from-navy to-blue-600 text-xs text-white/80">Belum ada foto</div>
              )}
              <div className="p-4">
                <p className="text-xs font-bold tracking-widest text-lime">{actName(m.activity_id).toUpperCase()}</p>
                <p className="mt-1 text-base font-extrabold text-navy">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.event_date ?? "—"} · {photos.length} foto</p>
                <div className="mt-3 flex justify-end gap-1">
                  <button onClick={() => openEdit(m)} className="rounded p-1.5 hover:bg-cream"><Pencil className="h-4 w-4 text-navy" /></button>
                  <button onClick={() => remove(m)} className="rounded p-1.5 hover:bg-rose-50"><Trash2 className="h-4 w-4 text-rose-600" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {moments.length === 0 && <p className="text-sm text-muted-foreground">Belum ada moment.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Moment" : "Tambah Moment"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Judul *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Activity</Label>
                <Select value={form.activity_id || "none"} onValueChange={(v) => setForm({ ...form, activity_id: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih activity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Tidak terkait —</SelectItem>
                    {activities.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Tanggal</Label><Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
            </div>
            <div><Label>Periode (label group)</Label><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="MEI 2024" /></div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Foto Carousel (maks {MAX_PHOTOS})</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPhoto} disabled={photoLinks.length >= MAX_PHOTOS}>
                  <Plus className="mr-1 h-3 w-3" /> Slot Foto
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photoLinks.map((url, i) => (
                  <div key={i} className="relative">
                    <span className="absolute left-1.5 top-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-navy text-[10px] font-bold text-navy-foreground">{i + 1}</span>
                    <button type="button" onClick={() => removePhoto(i)} aria-label="Remove" className="absolute right-1.5 top-1.5 z-10 rounded-full bg-rose-600/90 p-1 text-white hover:bg-rose-600">
                      <X className="h-3 w-3" />
                    </button>
                    <ImageUpload value={url} onChange={(u) => updatePhoto(i, u)} aspect="aspect-square" />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Klik kotak untuk upload. Foto akan ditampilkan sebagai carousel di publik.</p>
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
