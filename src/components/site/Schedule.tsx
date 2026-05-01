import { Bike } from "lucide-react";
import type { ComponentType } from "react";

interface Item {
  day: string;
  date: string;
  month: string;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  time: string;
  location: string;
  iconBg?: "lime" | "navy" | "cream";
}

const items: Item[] = [
  { day: "SAT", date: "18", month: "MAY", Icon: ({ className }) => <span className={className}>⚽</span>, title: "Futsal", time: "16.00 - 18.00", location: "Lapangan ABC", iconBg: "cream" },
  { day: "SUN", date: "19", month: "MAY", Icon: Bike, title: "Ride Together", time: "06.30 - Selesai", location: "Titik Kumpul: Pintu Utara", iconBg: "lime" },
  { day: "FRI", date: "24", month: "MAY", Icon: ({ className }) => <span className={className}>🏸</span>, title: "Badminton", time: "20.00 - 22.00", location: "Gor Indoor", iconBg: "cream" },
];

export function Schedule() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-2 md:flex-nowrap">
      {items.map((it, i) => {
        const bg = it.iconBg === "lime" ? "bg-lime/20" : it.iconBg === "navy" ? "bg-navy text-lime" : "bg-cream";
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="flex w-16 flex-col items-center rounded-2xl border-2 border-lime bg-card px-3 py-2 text-center">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{it.day}</span>
              <span className="text-2xl font-extrabold leading-none text-navy">{it.date}</span>
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{it.month}</span>
            </div>
            <div className={`grid h-14 w-14 place-items-center rounded-full text-2xl ${bg}`}>
              <it.Icon className="h-7 w-7 text-navy" />
            </div>
            <div className="min-w-[140px]">
              <p className="text-base font-extrabold text-navy">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.time}</p>
              <p className="text-xs text-muted-foreground">{it.location}</p>
            </div>
            {i < items.length - 1 && <div className="hidden h-px w-8 bg-border md:block" />}
          </div>
        );
      })}
    </div>
  );
}
