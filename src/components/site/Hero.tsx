import { useEffect, useRef, type ReactNode } from "react";

interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  bgImage?: string;
}

export function Hero({ eyebrow, title, description, children, bgImage }: HeroProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgImage) return;
    const el = parallaxRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const bgEl = el.querySelector<HTMLElement>(".parallax-bg");
      if (bgEl) {
        bgEl.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bgImage]);

  return (
    <section
      ref={parallaxRef}
      className="relative overflow-hidden bg-navy text-navy-foreground"
      style={{ minHeight: "420px" }}
    >
      {bgImage && (
        <div
          className="parallax-bg pointer-events-none absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            top: "-15%",
            bottom: "-15%",
            opacity: 0.35,
          }}
        />
      )}

      {bgImage && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/70 to-navy/50" />
      )}

      {!bgImage && (
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="animate-blob absolute right-[8%] top-[18%] h-40 w-40 rounded-full bg-lime/90" />
          <div className="animate-float absolute right-[26%] top-[58%] h-24 w-24 rounded-full bg-blue-400/70" />
          <div className="animate-float absolute right-[18%] top-[10%] h-16 w-16 rounded-full bg-white/80 [animation-delay:1.5s]" />
          <svg className="animate-float absolute right-[12%] top-[42%] h-20 w-20 text-lime [animation-delay:0.8s]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
          </svg>
          <div className="animate-blob absolute -right-10 top-1/3 h-56 w-72 rounded-[50%] bg-white/10 blur-2xl" />
        </div>
      )}

      {bgImage && (
        <>
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-lime/10 blur-3xl" />
        </>
      )}

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:py-28">
        <div className="max-w-xl">
          {eyebrow && <p className="animate-fade-up mb-4 text-[11px] font-bold tracking-[0.25em] text-lime sm:text-xs">{eyebrow}</p>}
          <h1 className="animate-fade-up delay-100 text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          <p className="animate-fade-up delay-200 mt-4 max-w-md text-sm text-white/75 sm:mt-5 sm:text-base">{description}</p>
          {children && <div className="animate-fade-up delay-300 mt-6 flex flex-wrap gap-3 sm:mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
