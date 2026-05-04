import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gdriveImage } from "@/lib/gdrive";

export function PhotoCarousel({ urls, alt, className = "" }: { urls: string[]; alt: string; className?: string }) {
  const [i, setI] = useState(0);
  if (!urls.length) {
    return <div className={`grid place-items-center bg-gradient-to-br from-navy to-blue-600 text-xs text-white/70 ${className}`}>No photo</div>;
  }
  const prev = () => setI((c) => (c - 1 + urls.length) % urls.length);
  const next = () => setI((c) => (c + 1) % urls.length);
  
  return (
    <div className={`group relative overflow-hidden bg-navy ${className}`}>
      <img src={gdriveImage(urls[i])} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      {urls.length > 1 && (
        <>
          {/* Left button - visible on hover (desktop) or always (mobile) */}
          <button 
            onClick={prev} 
            aria-label="Previous" 
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition group-hover:opacity-100 md:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {/* Right button - visible on hover (desktop) or always (mobile) */}
          <button 
            onClick={next} 
            aria-label="Next" 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition group-hover:opacity-100 md:opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          {/* Dots indicator - swipe on mobile */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {urls.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
