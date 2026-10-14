"use client";

import { useState } from "react";
import { ReactLenis } from "lenis/react";
import CustomCursor from "@/components/CustomCursor";
import CinematicBg from "@/components/CinematicBg";
import ScrollProgress from "@/components/ScrollProgress";
import AudioPlayer from "@/components/AudioPlayer";
import PoemScroller from "@/components/PoemScroller";
import EasterEggs from "@/components/EasterEggs";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0); // 0: Intro, 1-22: Poem lines, 23: Final section
  const [audioPlaying, setAudioPlaying] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.8, smoothWheel: true }}>
      <main className="relative min-h-screen w-full bg-[#070B14] select-none text-[#F8FAFC]">
        {/* Cinematic procedural visual background engine */}
        <CinematicBg activeIndex={activeIndex} />

        {/* Custom pointer cursor (only visible on desktop mice pointer devices) */}
        <CustomCursor />

        {/* Left vertical progress nodes (visible during stanzas 1-22) */}
        <ScrollProgress activeIndex={activeIndex} totalLines={22} />

        {/* Floating Web Audio API procedural synthesiser deck */}
        <AudioPlayer isPlaying={audioPlaying} setIsPlaying={setAudioPlaying} />

        {/* Main poem text layout */}
        <PoemScroller
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setAudioPlaying={setAudioPlaying}
        />

        {/* Interactive easter eggs canvas overlay */}
        <EasterEggs />
      </main>
    </ReactLenis>
  );
}
