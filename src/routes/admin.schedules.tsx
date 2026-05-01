import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminDelete, adminError, adminInsert, adminList, adminUpdate } from "@/lib/adminApi";

export const Route = createFileRoute("/admin/schedules")({ component: AdminSchedules });

type Schedule = { id: string; activity_id: string | null; title: string; event_date: string; start_time: string | null; end_time: string | null; location: string | null };
type Activity = { id: string; name: string };

const empty = { activity_id: "", title: "", event_date: "", start_time: "", end_time: "", location: "" };

function AdminSchedules() {
  const [list, setList] = useState<Schedule[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [form, setForm] = useState(empty);

  async function load() {
    try {
      const [s, a] = await Promise.all([
        adminList<Schedule>({ table: "schedules", order: [{ column: "event_date", ascending: true }] }),
        adminList<Activity>({ table: "activities", select: "id, name", order: [{ column: "name" }] }),
      ]);
      setList(s); setActivities(a);
    } catch (error) {
      toast.error(adminError(error, "Gagal memuat jadwal"));
    }
  }
  useEffect(() => { void load(); }, []);

  function openNew() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(s: Schedule) {
    setEditing(s);
    setForm({
      activity_id: s.activity_id ?? "",
      title: s.title,
      event_date: s.event_date,
      start_time: s.start_time ?? "",
      end_time: s.end_time ?? "",
      location: s.location ?? "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.event_date) { toast.error("Judul dan tanggal wajib diisi"); return; }
    const payload = { ...form, activity_id: form.activity_id || null };
    try {
      if (editing) {
        await adminUpdate({ table: "schedules", values: payload, filters: [{ column: "id", value: editing.id }] });
      } else {
        await adminInsert({ table: "schedules", values: payload });
      }
      toast.success("Tersimpan");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menyimpan jadwal"));
    }
  }

  async function remove(s: Schedule) {
    if (!confirm(`Hapus jadwal "${s.title}"?`)) return;
    try {
      await adminDelete({ table: "schedules", filters: [{ column: "id", value: s.id }] });
      toast.success("Terhapus");
      await load();
    } catch (error) {
      toast.error(adminError(error, "Gagal menghapus jadwal"));
    }
  }

  const actName = (id: string | null) => activities.find((a) => a.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="Jadwal Mendatang"
        description="Atur jadwal kegiatan yang akan datang."
        action={<Button onClick={openNew} className="bg-navy text-navy-foreground"><Plus className="mr-2 h-4 w-4" /> Tambah</Button>}
      />
      <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs font-bold uppercase tracking-wider text-navy/70">
            <tr>
              <th className="p-3">Tanggal</th><th className="p-3">Judul</th><th className="p-3">Activity</th>
              <th className="p-3">Waktu</th><th className="p-3">Lokasi</th><th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3 font-semibold text-navy">{s.event_date}</td>
                <td className="p-3">{s.title}</td>
                <td className="p-3 text-muted-foreground">{actName(s.activity_id)}</td>
                <td className="p-3 text-muted-foreground">{[s.start_time, s.end_time].filter(Boolean).join(" - ") || "—"}</td>
                <td className="p-3 text-muted-foreground">{s.location ?? "—"}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(s)} className="rounded p-1.5 hover:bg-cream"><Pencil className="h-4 w-4 text-navy" /></button>
                    <button onClick={() => remove(s)} className="rounded p-1.5 hover:bg-rose-50"><Trash2 className="h-4 w-4 text-rose-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Belum ada jadwal.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Jadwal" : "Tambah Jadwal"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Judul *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Activity</Label>
              <Select value={form.activity_id || "none"} onValueChange={(v) => setForm({ ...form, activity_id: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Pilih activity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Tidak terkait activity —</SelectItem>
                  {activities.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Tanggal *</Label><Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
              <div><Label>Mulai</Label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
              <div><Label>Selesai</Label><Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
            </div>
            <div><Label>Lokasi</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
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
