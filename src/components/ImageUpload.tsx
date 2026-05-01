import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  /** ratio of preview, e.g. "aspect-video", "aspect-square" */
  aspect?: string;
  rounded?: "lg" | "full";
}

const BUCKET = "media";

function randomKey(file: File) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${id}.${ext}`;
}

export function ImageUpload({ value, onChange, label, className = "", aspect = "aspect-video", rounded = "lg" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const radius = rounded === "full" ? "rounded-full" : "rounded-xl";

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus gambar");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran maksimal 5MB");
      return;
    }
    setBusy(true);
    try {
      const path = randomKey(file);
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Gambar terupload");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal upload";
      toast.error(msg);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    onChange("");
  }

  return (
    <div className={className}>
      {label && <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>}
      <div
        className={`group relative w-full overflow-hidden border-2 border-dashed border-border bg-muted/40 ${radius} ${aspect}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
                <Upload className="mr-1 h-3.5 w-3.5" /> Ganti
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={clear} disabled={busy}>
                <X className="mr-1 h-3.5 w-3.5" /> Hapus
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition hover:bg-muted hover:text-navy"
          >
            {busy ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">Klik atau drag gambar ke sini</span>
                <span className="text-[10px] text-muted-foreground/70">PNG, JPG, max 5MB</span>
              </>
            )}
          </button>
        )}
        {busy && value && (
          <div className="absolute inset-0 grid place-items-center bg-black/50">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
    </div>
  );
}
