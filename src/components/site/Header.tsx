import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/" as const, label: "Home" },
  { to: "/activity" as const, label: "Activity" },
  { to: "/community" as const, label: "Community" },
  { to: "/moments" as const, label: "Moments" },
  { to: "/join" as const, label: "Join" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Ingenious" className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="group relative text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
              <span className="absolute -bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-lime transition-all group-data-[status=active]:w-6" />
            </Link>
          ))}
        </nav>
        <Link
          to="/join"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-navy-foreground shadow-soft transition hover:opacity-90"
        >
          Join Community <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
