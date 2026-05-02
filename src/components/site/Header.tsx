import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-mark.png";

const navItems = [
  { to: "/" as const, label: "Home" },
  { to: "/activity" as const, label: "Activity" },
  { to: "/community" as const, label: "Community" },
  { to: "/moments" as const, label: "Moments" },
  { to: "/join" as const, label: "Join" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img src={logo} alt="Ingenious Generation" className="h-9 w-auto md:h-11" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex lg:gap-9">
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

        <div className="flex items-center gap-2">
          <Link
            to="/join"
            className="hidden items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-navy-foreground shadow-soft transition hover:opacity-90 sm:inline-flex md:px-5 md:py-2.5"
          >
            Join Community <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur transition-[max-height] duration-300 ease-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 transition hover:bg-muted data-[status=active]:bg-muted data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/join"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-navy-foreground shadow-soft sm:hidden"
          >
            Join Community <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
