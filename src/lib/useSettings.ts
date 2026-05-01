import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AppSettings {
  google_form_url: string;
  whatsapp_number: string;
}

export function buildWaLink(num: string, message = "Halo, saya ingin gabung Ingenious Community!") {
  const cleaned = (num || "").replace(/[^\d]/g, "").replace(/^0/, "62");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({ google_form_url: "", whatsapp_number: "085161302226" });
  useEffect(() => {
    void supabase.from("app_settings").select("google_form_url, whatsapp_number").eq("id", 1).maybeSingle()
      .then(({ data }) => {
        if (data) setSettings({
          google_form_url: data.google_form_url ?? "",
          whatsapp_number: data.whatsapp_number ?? "",
        });
      });
  }, []);
  return settings;
}
