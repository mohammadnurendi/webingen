import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminCounts } from "@/lib/adminApi";
import { Activity, Calendar, Users, Camera } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({ activities: 0, schedules: 0, members: 0, moments: 0 });
  useEffect(() => {
    void adminCounts().then(setCounts);
  }, []);

  const cards = [
    { label: "Activities", count: counts.activities, to: "/admin/activities" as const, Icon: Activity, color: "bg-lime/20 text-navy" },
    { label: "Jadwal", count: counts.schedules, to: "/admin/schedules" as const, Icon: Calendar, color: "bg-navy text-lime" },
    { label: "Members", count: counts.members, to: "/admin/members" as const, Icon: Users, color: "bg-cream text-navy" },
    { label: "Moments", count: counts.moments, to: "/admin/moments" as const, Icon: Camera, color: "bg-amber-100 text-navy" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold italic text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ringkasan konten Ingenious Community.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl bg-card p-6 shadow-soft transition hover:shadow-lg">
            <div className={`grid h-12 w-12 place-items-center rounded-full ${c.color}`}>
              <c.Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-navy">{c.count}</p>
            <p className="text-sm font-semibold text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
