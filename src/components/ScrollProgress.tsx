"use client";

import { useLenis } from "lenis/react";

interface ScrollProgressProps {
  activeIndex: number;
  totalLines: number;
}

export default function ScrollProgress({ activeIndex, totalLines }: ScrollProgressProps) {
  const lenis = useLenis();

  const handleDotClick = (lineNum: number) => {
    if (lenis) {
      lenis.scrollTo(`#line-${lineNum}`, {
        duration: 2.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  const isVisible = activeIndex > 0 && activeIndex <= totalLines;

  return (
    // Hidden on mobile — sidebar overlaps poem text on small screens
    <div className="hidden md:block">
      <div
        className={`fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-1000 ease-in-out ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
        }`}
      >
        {/* Scroll indicator track */}
        <div className="relative w-[2px] h-[320px] bg-white/10 rounded-full flex flex-col justify-between py-2">
          {/* Glowing fill bar */}
          <div
            className="absolute top-0 left-0 w-full rounded-full transition-all duration-700 ease-out"
            style={{
              height: `${((activeIndex - 1) / (totalLines - 1)) * 100}%`,
              background: "#FFD166",
              boxShadow: "0 0 12px rgba(255,209,102,0.8)",
            }}
          />

          {/* 22 Poem line nodes */}
          {Array.from({ length: totalLines }).map((_, idx) => {
            const lineNum = idx + 1;
            const isActive = activeIndex === lineNum;
            const isPassed = activeIndex >= lineNum;

            return (
              <button
                key={lineNum}
                onClick={() => handleDotClick(lineNum)}
                aria-label={`Scroll to line ${lineNum}`}
                className="group relative z-10 w-3 h-3 flex items-center justify-center -mx-1"
              >
                {/* Outer hover ring */}
                <span
                  className="absolute w-5 h-5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                  style={{ border: "1px solid rgba(255,209,102,0.4)" }}
                />

                {/* Node core */}
                <span
                  className="w-2 h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={
                    isActive
                      ? {
                          background: "#FFD166",
                          transform: "scale(1.25)",
                          boxShadow: "0 0 10px #FFD166, 0 0 20px #FFD166",
                        }
                      : isPassed
                      ? {
                          background: "rgba(255,255,255,0.8)",
                          boxShadow: "0 0 5px rgba(255,255,255,0.5)",
                        }
                      : {
                          background: "rgba(255,255,255,0.2)",
                          transform: "scale(0.75)",
                        }
                  }
                />

                {/* Tooltip */}
                <span className="absolute left-7 px-2 py-0.5 rounded text-[10px] font-sans tracking-widest uppercase bg-slate-900/90 text-slate-300 border border-white/5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 whitespace-nowrap">
                  Stanza {lineNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress counter */}
        <div className="text-[10px] font-sans tracking-[0.25em] text-white/40 uppercase rotate-90 mt-8 origin-center translate-y-2 select-none">
          {String(Math.min(Math.max(activeIndex, 1), totalLines)).padStart(2, "0")} / {totalLines}
        </div>
      </div>
    </div>
  );
}
