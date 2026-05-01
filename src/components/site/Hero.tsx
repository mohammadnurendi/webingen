import type { ReactNode } from "react";

interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}

export function Hero({ eyebrow, title, description, children }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      {/* decorative shapes */}
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute right-[8%] top-[18%] h-40 w-40 rounded-full bg-lime/90" />
        <div className="absolute right-[26%] top-[58%] h-24 w-24 rounded-full bg-blue-400/70" />
        <div className="absolute right-[18%] top-[10%] h-16 w-16 rounded-full bg-white/80" />
        <svg className="absolute right-[12%] top-[42%] h-20 w-20 text-lime" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
        <div className="absolute -right-10 top-1/3 h-56 w-72 rounded-[50%] bg-white/10 blur-2xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-lime">{eyebrow}</p>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-md text-base text-white/75">{description}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
