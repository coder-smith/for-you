"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { ChevronDown } from "lucide-react";

interface PoemScrollerProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  setAudioPlaying: (playing: boolean) => void;
}

const poemLines = [
  "you're the light to my darkness",
  "you're the magic that feels real",
  "you're the comfort that comes between chaos",
  "you're the beautiful flower that blooms",
  "you're the answer to my prayers",
  "you're the peace that doesn't feel like a burden",
  "you're the presence that is felt and known",
  "you're the colors to my life",
  "you're the one who makes me gentle",
  "you're the one who makes life bearable",
  "you're the one who makes me more human",
  "you're the pause between the worlds",
  "you're the reflection of the sun",
  "you're the warmth after the cold",
  "you're a real, authentic & rare diamond",
  "you're the one I adore",
  "you're the one I cherish the most",
  "you're the one with the most prettiest soul",
  "you're just like as a gentle rain",
  "you're the one with the most mesmerizing voice",
  "you're the bug fix to my code",
  "you're Juzuuuu...",
];

export default function PoemScroller({
  activeIndex,
  setActiveIndex,
  setAudioPlaying
}: PoemScrollerProps) {
  const lenis = useLenis();
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  // Intersection Observer to detect current active section in scroll viewport
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Triggers when section is 50% in view
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          setActiveIndex(index);
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [setActiveIndex]);

  // Blackout disabled — keep the final scene visible always

  const handleStartJourney = () => {
    // Start ambient audio (user interaction allows context initialization)
    setAudioPlaying(true);
    
    // Smooth scroll to the first line
    if (lenis) {
      lenis.scrollTo("#line-1", {
        duration: 2.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // slow, elegant ease
      });
    }
  };

  // Subtitle typewriter helper — split by word to prevent mid-word breaks
  const subtitleWords = "Some people arrive quietly... and unknowingly become home.".split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 1.0 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: {
      opacity: 0.8,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
  };

  return (
    <div className="relative z-10 w-full min-h-screen">

      {/* ── Fixed bottom-center scroll indicator ── */}
      <motion.div
        animate={{ opacity: activeIndex < 23 ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none select-none"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Thin vertical track */}
        <div className="relative w-[1px] h-10 bg-white/15 rounded-full overflow-hidden">
          {/* Travelling dot */}
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", repeatDelay: 0.4 }}
            className="absolute top-0 left-0 w-full rounded-full"
            style={{
              height: "35%",
              background: "linear-gradient(to bottom, transparent, #F9A8D4, transparent)",
              boxShadow: "0 0 6px rgba(249,168,212,0.8)",
            }}
          />
        </div>
        {/* Tiny label */}
        <span className="text-[8px] tracking-[0.3em] text-white/30 uppercase mt-1">scroll</span>
      </motion.div>

      {/* --- INTRO / HERO SECTION (Index 0) --- */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        data-index={0}
        className="relative w-full h-screen flex flex-col items-center justify-center px-6 select-none"
      >
        <div className="text-center max-w-2xl flex flex-col items-center">
          {/* Main heading name */}
          <motion.h1
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="cormorant-heading text-5xl sm:text-6xl md:text-8xl tracking-[0.12em] text-[#F8FAFC] glow-text-gold font-light"
          >
            Juzuuuu
          </motion.h1>

          {/* Typewriter subtitle — word by word */}
          <motion.p
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-5 text-xs sm:text-sm md:text-base tracking-[0.15em] leading-relaxed text-[#CBD5E1] font-light max-w-xs sm:max-w-sm md:max-w-lg text-center flex flex-wrap justify-center gap-x-[5px] gap-y-1"
          >
            {subtitleWords.map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.p>

          {/* Begin the Journey Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 3.5 }}
            className="mt-12"
          >
            <button
              onClick={handleStartJourney}
              className="group relative px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs md:text-sm tracking-[0.25em] text-[#F8FAFC] uppercase transition-all duration-500 hover:border-[#F9A8D4]/40 hover:bg-[#F9A8D4]/5 hover:shadow-[0_0_20px_rgba(249,168,212,0.2)] focus:outline-none"
            >
              Begin the Journey
            </button>
          </motion.div>
        </div>

        {/* Scroll hint chevron */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 4 }}
          className="absolute bottom-10 flex flex-col items-center gap-1 text-white/30"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown size={14} className="animate-bounce" />
        </motion.div>
      </section>

      {/* --- 22 POEM LINES SECTIONS (Index 1 to 22) --- */}
      {poemLines.map((line, idx) => {
        const lineNum = idx + 1;
        const isActive = activeIndex === lineNum;

        return (
          <section
            key={lineNum}
            id={`line-${lineNum}`}
            ref={(el) => { sectionRefs.current[lineNum] = el; }}
            data-index={lineNum}
            className="w-full h-screen flex items-center justify-center px-6 md:px-12 select-none pb-20 md:pb-0"
          >
            <div className="max-w-4xl text-center">
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(12px)" }}
                    transition={{
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="playfair-italic text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-[#F8FAFC] font-light leading-snug tracking-wide"
                  >
                    {line.includes("Juzuuuu") ? (
                      <>
                        {line.split("Juzuuuu")[0]}
                        <span className="playfair-normal">J</span>
                        {"uzuuuu" + line.split("Juzuuuu")[1]}
                      </>
                    ) : line}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </section>
        );
      })}

      {/* --- FINAL SECTION (Index 23) --- */}
      <section
        ref={(el) => { sectionRefs.current[23] = el; }}
        data-index={23}
        className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-16 select-none relative overflow-hidden"
      >
        {/* Soft radial ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 55%, rgba(249,168,212,0.09) 0%, transparent 70%)",
          }}
        />

        <div className="text-center flex flex-col items-center gap-5 w-full max-w-xl mx-auto z-10 px-4">

          {/* Prelude whisper */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
            className="playfair-italic text-xs sm:text-sm text-[#CBD5E1] tracking-[0.3em] font-light"
          >
            after all of this...
          </motion.p>

          {/* The emotional center — the name, now in playfair-italic to match poem lines */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.92, filter: "blur(20px)", y: 20 }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 3.0, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
            className="playfair-italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F8FAFC] font-light tracking-wide leading-tight"
            style={{ textShadow: "0 0 60px rgba(249,168,212,0.35), 0 0 120px rgba(196,181,253,0.15)" }}
          >
            <><span className="playfair-normal">J</span>uzuuuu.</>
          </motion.h2>

          {/* Divider hairline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.0, ease: "easeOut", delay: 2.6 }}
            className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent origin-center"
          />

          {/* Stanza of feelings — boosted opacity */}
          {[
            { text: "you walked into a life that wasn't ready for you,", delay: 3.2 },
            { text: "and made it feel like it always was.", delay: 4.0 },
          ].map(({ text, delay }, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              whileInView={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 2.0, ease: "easeOut", delay }}
              className="playfair-italic text-base sm:text-lg md:text-xl lg:text-2xl text-[#F1F5F9] font-light leading-relaxed px-2"
            >
              {text}
            </motion.p>
          ))}

          {/* Closing gift line — brighter pink */}
          <motion.p
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 5.2 }}
            className="playfair-italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-light tracking-wide mt-2"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55), 0 0 40px rgba(249,168,212,0.3)" }}
          >
            thank you for existing.
          </motion.p>

          {/* Signature whisper */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.45 }}
            viewport={{ once: true }}
            transition={{ duration: 3.0, ease: "easeOut", delay: 6.8 }}
            className="text-[10px] sm:text-xs tracking-[0.3em] text-white/70 uppercase mt-2"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
          >
            — written for you, always
          </motion.p>
        </div>
      </section>
    </div>
  );
}
