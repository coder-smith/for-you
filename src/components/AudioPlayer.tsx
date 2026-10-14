"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, CloudRain, Wind, Bird, Music } from "lucide-react";

declare global {
  interface YouTubePlayer {
    destroy: () => void;
    playVideo: () => void;
    pauseVideo: () => void;
    setVolume: (volume: number) => void;
  }

  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: { onReady: (event: { target: YouTubePlayer }) => void };
        },
      ) => YouTubePlayer;
    };
  }
}

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function AudioPlayer({ isPlaying, setIsPlaying }: AudioPlayerProps) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  // Track toggle states
  const [pianoActive, setPianoActive] = useState(true);
  const [rainActive, setRainActive] = useState(false);
  const [windActive, setWindActive] = useState(false);
  const [birdsActive, setBirdsActive] = useState(true);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Channel gain nodes
  const pianoGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const birdsGainRef = useRef<GainNode | null>(null);

  // Buffer sources and oscillators
  const activeSourcesRef = useRef<AudioScheduledSourceNode[]>([]);
  const intervalsRef = useRef<Array<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>>([]);

  // YouTube State & Ref
  const ytPlayerRef = useRef<YouTubePlayer | null>(null);
  const [usingReflections, setUsingReflections] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initYoutubePlayer();
      };
    } else {
      initYoutubePlayer();
    }

    return () => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === "function") {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  const initYoutubePlayer = () => {
    if (ytPlayerRef.current) return;
    const YouTube = window.YT;
    if (!YouTube) return;

    try {
      ytPlayerRef.current = new YouTube.Player("youtube-player", {
        videoId: "x47TgeRJtH0",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          loop: 1,
          playlist: "x47TgeRJtH0",
        },
        events: {
          onReady: (event) => {
            setUsingReflections(true);
            const initialVol = muted ? 0 : volume;
            event.target.setVolume(initialVol * 100);
            
            // Sync initial state if audio context is already playing
            if (isPlaying && pianoActive) {
              event.target.playVideo();
            }
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize YouTube player, using synth fallback", err);
    }
  };

  // Sync YouTube player state with React controls
  useEffect(() => {
    const player = ytPlayerRef.current;
    if (!player || typeof player.playVideo !== "function") return;

    try {
      if (isPlaying && pianoActive) {
        if (muted) {
          player.setVolume(0);
        } else {
          player.playVideo();
          player.setVolume(volume * 100);
        }
      } else {
        player.pauseVideo();
      }
    } catch (err) {
      console.warn("Error synchronizing YT Player:", err);
    }
  }, [isPlaying, pianoActive, volume, muted]);

  // Initialize Web Audio API Synthesizer
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Create master gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(muted ? 0 : volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Create channel gain nodes
    pianoGainRef.current = ctx.createGain();
    pianoGainRef.current.gain.setValueAtTime(pianoActive && !usingReflections ? 0.35 : 0, ctx.currentTime);
    pianoGainRef.current.connect(masterGain);

    rainGainRef.current = ctx.createGain();
    rainGainRef.current.gain.setValueAtTime(rainActive ? 0.25 : 0, ctx.currentTime);
    rainGainRef.current.connect(masterGain);

    windGainRef.current = ctx.createGain();
    windGainRef.current.gain.setValueAtTime(windActive ? 0.15 : 0, ctx.currentTime);
    windGainRef.current.connect(masterGain);

    birdsGainRef.current = ctx.createGain();
    birdsGainRef.current.gain.setValueAtTime(birdsActive ? 0.2 : 0, ctx.currentTime);
    birdsGainRef.current.connect(masterGain);

    // Start synthesizers
    startPianoEngine();
    startRainEngine();
    startWindEngine();
    startBirdsEngine();

    // Trigger YT player if ready
    const player = ytPlayerRef.current;
    if (player && typeof player.playVideo === "function") {
      if (isPlaying && pianoActive) {
        player.playVideo();
        player.setVolume(volume * 100);
      }
    }
  };

  // --- FALLBACK PIANO SYNTHESIS ENGINE ---
  const playPianoNote = (frequency: number, delay: number, duration: number) => {
    const ctx = audioCtxRef.current;
    const pianoGain = pianoGainRef.current;
    if (!ctx || !pianoGain || ctx.state === "suspended") return;

    const time = ctx.currentTime + delay;

    // Oscillator 1 (Triangle)
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(frequency, time);

    // Oscillator 2 (Soft Sine fundamental)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency * 0.99, time);

    // Note gain envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(0.08, time + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration - 0.05);

    // Soft Lowpass Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, time);
    filter.Q.setValueAtTime(1, time);

    // Reverb simulator delay node
    const delayNode = ctx.createDelay();
    delayNode.delayTime.setValueAtTime(0.3, time);
    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.02, time);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(filter);
    
    filter.connect(pianoGain);
    filter.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(pianoGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  };

  const startPianoEngine = () => {
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [130.81, 196.00, 261.63, 329.63], // Cmaj7
      [146.83, 220.00, 261.63, 349.23], // Dm7
      [196.00, 246.94, 293.66, 392.00], // G6
    ];

    let chordIdx = 0;

    const playChordSequence = () => {
      if (usingReflections) return; // Disables procedural piano if YouTube plays successfully

      const notes = chords[chordIdx];
      notes.forEach((freq, noteIdx) => {
        playPianoNote(freq, noteIdx * 0.4, 7.5);
      });

      chordIdx = (chordIdx + 1) % chords.length;
    };

    playChordSequence();
    const interval = setInterval(playChordSequence, 8000);
    intervalsRef.current.push(interval);
  };

  // --- RAIN SYNTHESIS ENGINE ---
  const startRainEngine = () => {
    const ctx = audioCtxRef.current;
    const rainGain = rainGainRef.current;
    if (!ctx || !rainGain) return;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    whiteNoise.start(0);
    activeSourcesRef.current.push(whiteNoise);
  };

  // --- WIND SYNTHESIS ENGINE ---
  const startWindEngine = () => {
    const ctx = audioCtxRef.current;
    const windGain = windGainRef.current;
    if (!ctx || !windGain) return;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.setValueAtTime(300, ctx.currentTime);
    windFilter.Q.setValueAtTime(6.0, ctx.currentTime);

    const triggerGusts = () => {
      const time = ctx.currentTime;
      const nextFreq = Math.random() * 400 + 150;
      const transitionDuration = Math.random() * 4 + 3;
      windFilter.frequency.exponentialRampToValueAtTime(nextFreq, time + transitionDuration);
    };

    triggerGusts();
    const interval = setInterval(triggerGusts, 5000);
    intervalsRef.current.push(interval);

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    noiseSource.start(0);
    activeSourcesRef.current.push(noiseSource);
  };

  // --- BIRDS SYNTHESIS ENGINE ---
  const triggerBirdChirp = () => {
    const ctx = audioCtxRef.current;
    const birdsGain = birdsGainRef.current;
    if (!ctx || !birdsGain || ctx.state === "suspended") return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";

    const baseFreq = Math.random() * 800 + 1400;
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 500, time + 0.15);

    const chirpGain = ctx.createGain();
    chirpGain.gain.setValueAtTime(0, time);
    chirpGain.gain.linearRampToValueAtTime(0.04, time + 0.02);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

    osc.connect(chirpGain);
    chirpGain.connect(birdsGain);
    osc.start(time);
    osc.stop(time + 0.18);
  };

  const startBirdsEngine = () => {
    const loop = () => {
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        setTimeout(triggerBirdChirp, i * 180);
      }
      
      const nextDelay = Math.random() * 8000 + 6000;
      const timeout = setTimeout(loop, nextDelay);
      intervalsRef.current.push(timeout);
    };

    const initialTimeout = setTimeout(loop, 4000);
    intervalsRef.current.push(initialTimeout);
  };

  // --- AUDIO LIFE CYCLE MANAGEMENT ---
  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
    }

    return () => {
      intervalsRef.current.forEach((int) => {
        clearInterval(int as unknown as number);
        clearTimeout(int as unknown as number);
      });
      intervalsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Master volume effect
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const vol = muted ? 0 : volume;
      masterGainRef.current.gain.linearRampToValueAtTime(vol, audioCtxRef.current.currentTime + 0.2);
    }
  }, [volume, muted]);

  // Handle individual toggle switches
  useEffect(() => {
    if (pianoGainRef.current && audioCtxRef.current) {
      const target = (pianoActive && !usingReflections) ? 0.35 : 0;
      pianoGainRef.current.gain.linearRampToValueAtTime(target, audioCtxRef.current.currentTime + 0.5);
    }
  }, [pianoActive, usingReflections]);

  useEffect(() => {
    if (rainGainRef.current && audioCtxRef.current) {
      const target = rainActive ? 0.25 : 0;
      rainGainRef.current.gain.linearRampToValueAtTime(target, audioCtxRef.current.currentTime + 0.5);
    }
  }, [rainActive]);

  useEffect(() => {
    if (windGainRef.current && audioCtxRef.current) {
      const target = windActive ? 0.15 : 0;
      windGainRef.current.gain.linearRampToValueAtTime(target, audioCtxRef.current.currentTime + 0.5);
    }
  }, [windActive]);

  useEffect(() => {
    if (birdsGainRef.current && audioCtxRef.current) {
      const target = birdsActive ? 0.2 : 0;
      birdsGainRef.current.gain.linearRampToValueAtTime(target, audioCtxRef.current.currentTime + 0.5);
    }
  }, [birdsActive]);

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed right-3 md:right-8 bottom-4 md:bottom-6 z-50 flex items-center gap-2 md:gap-3">
      {/* Hidden YouTube IFrame Container */}
      <div id="youtube-player" style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />

      {/* Visual audio equalizer waves */}
      {isPlaying && !muted && (
        <div className="flex gap-[3px] items-end h-[16px] px-2 select-none pointer-events-none">
          <div className="w-[2px] rounded-full animate-bounce [animation-duration:0.6s]" style={{ height: "40%", background: "#F9A8D4" }} />
          <div className="w-[2px] rounded-full animate-bounce [animation-duration:0.8s]" style={{ height: "90%", background: "#C4B5FD" }} />
          <div className="w-[2px] rounded-full animate-bounce [animation-duration:0.5s]" style={{ height: "60%", background: "#7DD3FC" }} />
          <div className="w-[2px] rounded-full animate-bounce [animation-duration:0.7s]" style={{ height: "85%", background: "#FFD166" }} />
        </div>
      )}

      {/* Main Glassmorphism Controller */}
      <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-full px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2 md:gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className="text-white transition-colors focus:outline-none"
          style={{} as React.CSSProperties}
          onMouseEnter={e => (e.currentTarget.style.color = "#F9A8D4")}
          onMouseLeave={e => (e.currentTarget.style.color = "white")}
          aria-label={isPlaying ? "Pause Ambient Journey" : "Play Ambient Journey"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-white/10" />

        {/* Modular Layer Toggles */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setPianoActive(!pianoActive)}
            className="transition-colors focus:outline-none"
            style={{ color: pianoActive ? "#FFD166" : "rgba(255,255,255,0.3)" }}
            title={usingReflections ? "Reflections by The Neighbourhood" : "Piano Ambient Melody"}
          >
            <Music size={14} />
          </button>
          <button
            onClick={() => setRainActive(!rainActive)}
            className="transition-colors focus:outline-none"
            style={{ color: rainActive ? "#7DD3FC" : "rgba(255,255,255,0.3)" }}
            title="Soft Raindrops"
          >
            <CloudRain size={14} />
          </button>
          <button
            onClick={() => setWindActive(!windActive)}
            className="transition-colors focus:outline-none"
            style={{ color: windActive ? "#6EE7B7" : "rgba(255,255,255,0.3)" }}
            title="Rustling Wind"
          >
            <Wind size={14} />
          </button>
          <button
            onClick={() => setBirdsActive(!birdsActive)}
            className="transition-colors focus:outline-none"
            style={{ color: birdsActive ? "#F9A8D4" : "rgba(255,255,255,0.3)" }}
            title="Nature Birds Chirping"
          >
            <Bird size={14} />
          </button>
          
          <div className="w-[1px] h-4 bg-white/10" />
        </div>

        {/* Mute and Master Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white transition-colors focus:outline-none"
            onMouseEnter={e => (e.currentTarget.style.color = "#7DD3FC")}
            onMouseLeave={e => (e.currentTarget.style.color = "white")}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (muted) setMuted(false);
            }}
            className="hidden sm:block w-16 md:w-20 h-1 rounded-full cursor-pointer transition-all duration-300"
            style={{
              background: `linear-gradient(to right, #F9A8D4 0%, #F9A8D4 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
