import { ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

interface Props {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  variant?: "lime" | "navy";
  tint?: "cream" | "white";
}

export function ActivityCard({ Icon, title, description, variant = "lime", tint = "cream" }: Props) {
  const iconBg = variant === "lime" ? "bg-lime text-navy" : "bg-navy text-lime";
  const cardBg = tint === "cream" ? "bg-cream" : "bg-card";
  const link = variant === "lime" ? "text-[oklch(0.55_0.18_125)]" : "text-navy";
  return (
    <div className={`group hover-lift animate-fade-up flex flex-col gap-4 rounded-3xl ${cardBg} p-6 shadow-soft`}>
      <div className={`grid h-14 w-14 place-items-center rounded-full ${iconBg}`}>
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h3 className="mb-2 text-base font-extrabold tracking-wide text-navy">{title.toUpperCase()}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <a href="#" className={`mt-2 inline-flex items-center gap-1 text-sm font-semibold ${link}`}>
        Lihat detail <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </a>
    </div>
  );
}
