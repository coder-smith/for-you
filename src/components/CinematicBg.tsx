"use client";

import { useEffect, useRef } from "react";

interface CinematicBgProps {
  activeIndex: number; // 0: Intro, 1-22: Poem lines, 23: Final section
}

// Particle Interfaces
interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
}

interface Snow {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
}

interface Rain {
  x: number;
  y: number;
  len: number;
  vy: number;
  alpha: number;
}

interface CherryBlossom {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  angle: number;
  rSpeed: number;
}

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  angle: number;
  rSpeed: number;
  color: string;
}

interface Firefly {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
  speed: number;
  glowSpeed: number;
}

interface Butterfly {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  speed: number;
  color: string;
  wingAngle: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
}

interface BirdParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  wingPhase: number;
}

interface DigitalParticle {
  x: number;
  y: number;
  char: string;
  speed: number;
  alpha: number;
  isStar: boolean;
  targetX: number;
  targetY: number;
  size: number;
}

interface Flower {
  x: number;
  height: number;
  sway: number;
  swaySpeed: number;
  color: string;
  bloom?: number;
  petalCount?: number;
  maxPetalSize?: number;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}

interface SceneState {
  stars: Star[];
  snow: Snow[];
  rain: Rain[];
  cherryBlossoms: CherryBlossom[];
  leaves: LeafParticle[];
  fireflies: Firefly[];
  butterflies: Butterfly[];
  ripples: Ripple[];
  birds: BirdParticle[];
  digitalParticles: DigitalParticle[];
  flowers: Flower[];
  clouds: Cloud[];
  auroraTime: number;
  initialized: boolean;
}

export default function CinematicBg({ activeIndex }: CinematicBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  // Opacities for all 24 possible states (0 to 23)
  const opacitiesRef = useRef<number[]>(new Array(24).fill(0));
  
  // Scene-specific particle states stored in refs to avoid React re-renders
  const sceneStateRef = useRef<SceneState>({
    stars: [],
    snow: [],
    rain: [],
    cherryBlossoms: [],
    leaves: [],
    fireflies: [],
    butterflies: [],
    ripples: [],
    birds: [],
    digitalParticles: [],
    flowers: [],
    clouds: [],
    auroraTime: 0,
    initialized: false,
  });

  useEffect(() => {
    // Set intro scene (index 0) opacity to 1 immediately
    opacitiesRef.current[0] = 1;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSceneData(canvas.width, canvas.height);
    };
    
    // Initialize procedural particle vectors
    const initializeSceneData = (w: number, h: number) => {
      const state = sceneStateRef.current;
      if (state.initialized) return;

      // Twinkling stars
      state.stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * w,
        y: Math.random() * (h * 0.7),
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
      }));

      // Snow
      state.snow = Array.from({ length: 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        vy: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 1 - 0.5,
      }));

      // Rain
      state.rain = Array.from({ length: 120 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - h,
        len: Math.random() * 20 + 10,
        vy: Math.random() * 10 + 15,
        alpha: Math.random() * 0.3 + 0.1,
      }));

      // Cherry blossom petals
      state.cherryBlossoms = Array.from({ length: 80 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - 100,
        r: Math.random() * 5 + 3,
        vy: Math.random() * 1.5 + 0.8,
        vx: Math.random() * 1.2 - 0.2,
        angle: Math.random() * Math.PI * 2,
        rSpeed: Math.random() * 0.03 - 0.015,
      }));

      // Autumn leaves
      const leafColors = ["#E76F51", "#F4A261", "#E9C46A", "#D62828"];
      state.leaves = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - 100,
        size: Math.random() * 8 + 4,
        vy: Math.random() * 1.2 + 0.8,
        vx: Math.random() * 1.5 - 0.5,
        angle: Math.random() * Math.PI * 2,
        rSpeed: Math.random() * 0.02 - 0.01,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      }));

      // Fireflies
      state.fireflies = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1.5,
        vy: Math.random() * 0.6 - 0.3,
        vx: Math.random() * 0.8 - 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.03 + 0.01,
        glowSpeed: Math.random() * 0.05 + 0.02,
      }));

      // Clouds
      state.clouds = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * w * 1.5 - w * 0.25,
        y: Math.random() * (h * 0.4) + 50,
        scale: Math.random() * 1.5 + 0.8,
        speed: (Math.random() * 0.2 + 0.1) * (i % 2 === 0 ? 1 : -1),
        opacity: Math.random() * 0.2 + 0.1,
      }));

      // Butterflies
      const butterflyColors = ["#7DD3FC", "#F9A8D4", "#C4B5FD", "#FCD34D"];
      state.butterflies = Array.from({ length: 8 }, () => {
        const tx = Math.random() * w;
        const ty = Math.random() * h;
        return {
          x: tx + Math.random() * 200 - 100,
          y: ty + Math.random() * 200 - 100,
          targetX: tx,
          targetY: ty,
          size: Math.random() * 3 + 3,
          speed: Math.random() * 0.02 + 0.01,
          color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
          wingAngle: 0,
        };
      });

      // Digital matrix-to-stars particles
      const chars = "01010101<>[]{}+-*%#$@&".split("");
      state.digitalParticles = Array.from({ length: 120 }, () => {
        const tx = Math.random() * w;
        const ty = Math.random() * (h * 0.8);
        return {
          x: Math.random() * w,
          y: Math.random() * h - h,
          char: chars[Math.floor(Math.random() * chars.length)],
          speed: Math.random() * 3 + 2,
          alpha: Math.random() * 0.6 + 0.2,
          isStar: false,
          targetX: tx,
          targetY: ty,
          size: Math.random() * 2 + 1,
        };
      });

      // Flowers (swaying in meadow)
      const flowerColors = ["#F9A8D4", "#FDE047", "#C4B5FD", "#F8FAFC"];
      state.flowers = Array.from({ length: 45 }, () => ({
        x: Math.random() * w,
        height: Math.random() * 120 + 80,
        sway: 0,
        swaySpeed: Math.random() * 0.03 + 0.01,
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
        bloom: 0,
        petalCount: Math.floor(Math.random() * 3) + 5,
        maxPetalSize: Math.random() * 5 + 4,
      }));

      // Birds
      state.birds = Array.from({ length: 7 }, () => ({
        x: Math.random() * (w * 0.3) - 200,
        y: Math.random() * (h * 0.3) + 100,
        size: Math.random() * 6 + 4,
        speed: Math.random() * 1.5 + 1.2,
        wingPhase: Math.random() * Math.PI * 2,
      }));

      state.initialized = true;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse movement listeners with interpolation targets
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- DRAW SCENES ---
    const drawScene = (sceneIndex: number, currentOpacity: number, w: number, h: number, time: number) => {
      ctx.save();
      ctx.globalAlpha = currentOpacity;
      const mouse = mouseRef.current;
      const mX = mouse.x * 25; // Parallax amplitude
      const mY = mouse.y * 25;
      const state = sceneStateRef.current;

      switch (sceneIndex) {
        // --- 0. HERO / INTRO: Deep night sky with misty breathing horizon ---
        case 0: {
          const grad = ctx.createRadialGradient(
            w / 2 + mX, h * 0.7 + mY, 10,
            w / 2 + mX, h * 0.7 + mY, w * 0.8
          );
          grad.addColorStop(0, "#0F172A");
          grad.addColorStop(1, "#070B14");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Render subtle background starfield
          drawStars(w, time, 0.4);

          // Sunrise glow leaking slightly on the horizon
          const horizonGlow = ctx.createLinearGradient(0, h * 0.7, 0, h);
          horizonGlow.addColorStop(0, "rgba(255, 209, 102, 0)");
          horizonGlow.addColorStop(1, "rgba(255, 209, 102, 0.05)");
          ctx.fillStyle = horizonGlow;
          ctx.fillRect(0, h * 0.7, w, h * 0.3);
          break;
        }

        // --- 1. LIGHT TO DARKNESS: Sunrise ---
        case 1: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#0B1120"); // Deep blue top
          grad.addColorStop(0.5, "#1F1A3A"); // Dusk violet
          grad.addColorStop(0.8, "#B05663"); // Deep sunset red
          grad.addColorStop(1, "#E9A17C"); // Warm peach horizon
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw rising sun
          const sunY = h * 0.75 - Math.sin(time * 0.005) * 50 - (mouse.y * 30);
          const sunX = w / 2 - (mouse.x * 30);
          const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 120);
          sunGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
          sunGlow.addColorStop(0.3, "rgba(255, 209, 102, 0.7)");
          sunGlow.addColorStop(0.7, "rgba(255, 122, 122, 0.2)");
          sunGlow.addColorStop(1, "rgba(255, 122, 122, 0)");
          ctx.fillStyle = sunGlow;
          ctx.beginPath();
          ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
          ctx.fill();

          // Soft volumetric rays
          drawSunRays(sunX, sunY, time, 6, "rgba(255, 245, 220, 0.08)");
          break;
        }

        // --- 2. MAGIC THAT FEELS REAL: Aurora Borealis ---
        case 2: {
          ctx.fillStyle = "#070B14";
          ctx.fillRect(0, 0, w, h);

          // Starfield
          drawStars(w, time, 0.8);

          // Aurora dynamic lines
          state.auroraTime += 0.002;
          const colors = [
            "rgba(110, 231, 183, 0.2)", // Mint green
            "rgba(196, 181, 253, 0.15)", // Lavender
            "rgba(56, 189, 248, 0.1)" // Light sky blue
          ];
          
          ctx.lineWidth = 150;
          ctx.shadowBlur = 100;
          ctx.globalCompositeOperation = "screen";

          colors.forEach((col, idx) => {
            ctx.strokeStyle = col;
            ctx.shadowColor = col;
            ctx.beginPath();
            const yOffset = h * 0.35 + idx * 80 + mY * 2;
            
            for (let x = 0; x <= w; x += 20) {
              const sineVal = Math.sin(x * 0.002 + state.auroraTime + idx * 1.5) * 60;
              const cosineVal = Math.cos(x * 0.001 - state.auroraTime * 0.8) * 30;
              const y = yOffset + sineVal + cosineVal;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          });
          
          ctx.globalCompositeOperation = "source-over";
          ctx.shadowBlur = 0;
          break;
        }

        // --- 3. COMFORT IN CHAOS: Calm Lake with ripples ---
        case 3: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#081A2D");
          grad.addColorStop(0.5, "#1B3B5A"); // Sky reflection
          grad.addColorStop(0.52, "#0D253A"); // Horizon separator
          grad.addColorStop(1, "#051322");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Distant mountains
          ctx.fillStyle = "rgba(10, 20, 35, 0.7)";
          ctx.beginPath();
          ctx.moveTo(0, h * 0.52);
          ctx.lineTo(w * 0.15, h * 0.44 - mY * 0.2);
          ctx.lineTo(w * 0.3, h * 0.52);
          ctx.lineTo(w * 0.5, h * 0.42 - mY * 0.3);
          ctx.lineTo(w * 0.7, h * 0.52);
          ctx.lineTo(w * 0.85, h * 0.47 - mY * 0.1);
          ctx.lineTo(w, h * 0.52);
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();

          // Symmetrical reflection mountains (darker)
          ctx.fillStyle = "rgba(5, 10, 20, 0.4)";
          ctx.beginPath();
          ctx.moveTo(0, h * 0.52);
          ctx.lineTo(w * 0.15, h * 0.60 + mY * 0.2);
          ctx.lineTo(w * 0.3, h * 0.52);
          ctx.lineTo(w * 0.5, h * 0.62 + mY * 0.3);
          ctx.lineTo(w * 0.7, h * 0.52);
          ctx.lineTo(w * 0.85, h * 0.57 + mY * 0.1);
          ctx.lineTo(w, h * 0.52);
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();

          // Random ripples spawning near mouse or on timer
          if (time % 80 === 0 || (mouse.targetX !== mouse.x && Math.random() < 0.02)) {
            const rx = mouse.targetX !== mouse.x ? (mouse.x + 1) * w/2 : Math.random() * w;
            const ry = h * 0.55 + Math.random() * (h * 0.4);
            state.ripples.push({
              x: rx,
              y: ry,
              r: 2,
              maxR: Math.random() * 80 + 40,
              alpha: 0.8,
            });
          }

          // Render ripples
          ctx.lineWidth = 1;
          state.ripples.forEach((rip, i) => {
            rip.r += 0.4;
            rip.alpha -= 0.005;
            if (rip.alpha <= 0 || rip.r >= rip.maxR) {
              state.ripples.splice(i, 1);
              return;
            }
            ctx.strokeStyle = `rgba(125, 211, 252, ${rip.alpha * 0.35})`;
            ctx.beginPath();
            ctx.ellipse(rip.x, rip.y, rip.r, rip.r * 0.2, 0, 0, Math.PI * 2);
            ctx.stroke();
          });
          break;
        }

        // --- 4. BEAUTIFUL FLOWER: Blooming Flower Field ---
        case 4: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#111827");
          grad.addColorStop(0.6, "#1A2535");
          grad.addColorStop(1, "#18322A"); // Mint bottom
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw swaying flowers
          ctx.lineWidth = 2.5;
          state.flowers.forEach((flower) => {
            flower.sway = Math.sin(time * flower.swaySpeed) * 12 + (mouse.x * 8);

            // Animate bloom towards 1.0 when active
            const isScene4Active = activeIndex === 4;
            const targetBloom = isScene4Active ? 1.0 : 0.0;
            if (flower.bloom === undefined) flower.bloom = 0;
            // Bloom speed varies slightly per flower for organic growth
            flower.bloom += (targetBloom - flower.bloom) * (0.015 + flower.swaySpeed * 0.2);

            const bloom = flower.bloom;
            const headX = flower.x + flower.sway;
            const headY = h - flower.height;

            // Flower stem
            ctx.strokeStyle = "rgba(74, 117, 89, 0.4)";
            ctx.beginPath();
            ctx.moveTo(flower.x, h);
            ctx.quadraticCurveTo(
              flower.x + flower.sway * 0.5, h - flower.height * 0.5,
              headX, headY
            );
            ctx.stroke();

            // Draw glowing petals expanding around the center
            if (bloom > 0.01) {
              const petalCount = flower.petalCount || 5;
              const maxPetSize = flower.maxPetalSize || 6;
              const curPetSize = maxPetSize * bloom;
              const angleStep = (Math.PI * 2) / petalCount;
              
              // Rotate slightly based on time and sway for organic life
              const baseAngle = time * 0.001 * (flower.swaySpeed > 0.02 ? 1 : -1) + (flower.sway * 0.02);

              ctx.fillStyle = flower.color;
              ctx.shadowBlur = 12 * bloom;
              ctx.shadowColor = flower.color;

              for (let i = 0; i < petalCount; i++) {
                const angle = i * angleStep + baseAngle;
                // Move petal centers outward from the bud center as they bloom
                const dist = (3 + maxPetSize * 0.35) * bloom;
                const px = headX + Math.cos(angle) * dist;
                const py = headY + Math.sin(angle) * dist;

                ctx.beginPath();
                // Draw petal
                ctx.ellipse(px, py, curPetSize, curPetSize * 0.65, angle, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // Flower head center (pistil)
            // Starts larger and glows brighter as flower blooms
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowBlur = 15;
            ctx.shadowColor = flower.color;
            ctx.beginPath();
            ctx.arc(headX, headY, 2 + 2 * (1 - bloom), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          // Floating flower pollen (dandelion seeds)
          drawFireflies(w, h, time, "rgba(249, 168, 212, 0.35)", 1.2);
          break;
        }

        // --- 5. ANSWER TO MY PRAYERS: Forest with Sunlight Rays ---
        case 5: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#08101E");
          grad.addColorStop(0.7, "#112233");
          grad.addColorStop(1, "#1F352B"); // Green hues
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Drawing tree trunks (Silhouettes)
          ctx.fillStyle = "rgba(5, 10, 18, 0.8)";
          for (let i = 0; i < w; i += 220) {
            const tX = i + (i % 3) * 30 + mX * 0.4;
            const trunkW = 35 + (i % 2) * 15;
            ctx.fillRect(tX, 0, trunkW, h);
            
            // Branch outlines
            ctx.beginPath();
            ctx.arc(tX + trunkW/2, 200, trunkW * 2, 0, Math.PI, true);
            ctx.fill();
          }

          // Volumetric rays of morning sunlight
          const rayX = w * 0.2 + (mouse.x * 40);
          drawSunRays(rayX, 0, time, 8, "rgba(255, 230, 170, 0.1)");

          // Floating golden forest dust
          drawFireflies(w, h, time, "rgba(255, 209, 102, 0.35)", 0.8);
          break;
        }

        // --- 6. PEACE: Snow-covered Valley ---
        case 6: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#0E1525");
          grad.addColorStop(0.7, "#1F293D");
          grad.addColorStop(1, "#374151"); // Grey blue mist
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Snowy mountains
          ctx.fillStyle = "rgba(220, 225, 235, 0.15)";
          ctx.beginPath();
          ctx.moveTo(0, h * 0.7);
          ctx.lineTo(w * 0.3, h * 0.45 + mY * 0.15);
          ctx.lineTo(w * 0.6, h * 0.7);
          ctx.lineTo(w * 0.8, h * 0.52 + mY * 0.1);
          ctx.lineTo(w, h * 0.7);
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();

          // Render drifting snow particles
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          state.snow.forEach((flake) => {
            flake.y += flake.vy;
            flake.x += flake.vx + Math.sin(time * 0.01 + flake.r) * 0.2 + (mouse.x * 0.5);
            
            if (flake.y > h) {
              flake.y = -10;
              flake.x = Math.random() * w;
            }
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        // --- 7. PRESENCE KNOWN: Quiet Foggy Forest ---
        case 7: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#080F1B");
          grad.addColorStop(0.7, "#131C2C");
          grad.addColorStop(1, "#1D2A3F");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Three layers of silhouette trees for heavy parallax depth
          const layers = [
            { opacity: 0.15, scale: 0.5, spacing: 140, color: "#1E2A38" },
            { opacity: 0.35, scale: 0.8, spacing: 220, color: "#131D28" },
            { opacity: 0.65, scale: 1.2, spacing: 320, color: "#0A111A" },
          ];

          layers.forEach((layer, depthIdx) => {
            ctx.fillStyle = layer.color;
            ctx.globalAlpha = layer.opacity * currentOpacity;
            const pX = mX * (depthIdx + 1) * 0.3;
            
            for (let x = -50; x < w + 100; x += layer.spacing) {
              const trunkW = 20 * layer.scale;
              const trunkX = x + pX;
              ctx.fillRect(trunkX, 0, trunkW, h);
              
              // Leafy crowns
              ctx.beginPath();
              ctx.arc(trunkX + trunkW/2, h * 0.2 + (x%2)*50, trunkW * 6, 0, Math.PI, true);
              ctx.fill();
            }
          });

          ctx.globalAlpha = currentOpacity; // Reset alpha

          // Floating fog clouds on top
          drawClouds(w);
          break;
        }

        // --- 8. COLORS TO MY LIFE: Autumn Trees ---
        case 8: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#1F1512"); // Warm copper
          grad.addColorStop(0.6, "#3F1E15"); // Deep amber sunset
          grad.addColorStop(1, "#4E2B1E");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Silhouette maple trees with red crowns
          ctx.fillStyle = "rgba(40, 15, 10, 0.7)";
          for (let i = 40; i < w; i += 300) {
            const tx = i + mX * 0.5;
            ctx.fillRect(tx, 0, 30, h);
            ctx.fillStyle = "rgba(180, 60, 45, 0.4)";
            ctx.beginPath();
            ctx.arc(tx + 15, h * 0.35, 120, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(40, 15, 10, 0.7)";
          }

          // Drifting autumn leaves
          state.leaves.forEach((leaf) => {
            leaf.y += leaf.vy;
            leaf.x += leaf.vx + Math.sin(time * 0.02 + leaf.size) * 0.5 + (mouse.x * 0.6);
            leaf.angle += leaf.rSpeed;

            if (leaf.y > h + 20) {
              leaf.y = -20;
              leaf.x = Math.random() * w;
            }

            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.angle);
            ctx.fillStyle = leaf.color;
            // Draw a diamond/leaf shape
            ctx.beginPath();
            ctx.moveTo(0, -leaf.size);
            ctx.quadraticCurveTo(leaf.size * 0.6, 0, 0, leaf.size);
            ctx.quadraticCurveTo(-leaf.size * 0.6, 0, 0, -leaf.size);
            ctx.fill();
            ctx.restore();
          });
          break;
        }

        // --- 9. MAKES ME GENTLE: Butterflies ---
        case 9: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#08151A");
          grad.addColorStop(0.6, "#15333F");
          grad.addColorStop(1, "#264F54"); // Soft teal
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Tiny particles
          drawFireflies(w, h, time, "rgba(110, 231, 183, 0.2)", 0.6);

          // Animate and draw butterflies
          state.butterflies.forEach((bf) => {
            // Lerp butterfly towards its target
            bf.x += (bf.targetX - bf.x) * bf.speed;
            bf.y += (bf.targetY - bf.y) * bf.speed;
            bf.wingAngle = Math.sin(time * 0.15) * Math.PI / 4;

            // Change target occasionally
            if (Math.abs(bf.x - bf.targetX) < 15 && Math.abs(bf.y - bf.targetY) < 15) {
              bf.targetX = Math.random() * w + (mouse.x * 100);
              bf.targetY = Math.random() * h + (mouse.y * 100);
            }

            ctx.save();
            ctx.translate(bf.x, bf.y);
            ctx.fillStyle = bf.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = bf.color;

            // Left Wing
            ctx.beginPath();
            ctx.ellipse(-bf.size * 0.8, 0, bf.size * Math.cos(bf.wingAngle), bf.size * 1.5, Math.PI/6, 0, Math.PI * 2);
            ctx.fill();

            // Right Wing
            ctx.beginPath();
            ctx.ellipse(bf.size * 0.8, 0, bf.size * Math.cos(bf.wingAngle), bf.size * 1.5, -Math.PI/6, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.fillStyle = "#F8FAFC";
            ctx.beginPath();
            ctx.ellipse(0, 0, 1, bf.size * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            ctx.shadowBlur = 0;
          });
          break;
        }

        // --- 10. MAKES LIFE BEARABLE: Mountain Path ---
        case 10: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#050B14");
          grad.addColorStop(0.6, "#0F1A2A");
          grad.addColorStop(1, "#182C44");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Star background
          drawStars(w, time, 0.4);

          // Tall mountain ridges
          ctx.fillStyle = "rgba(10, 18, 30, 0.95)";
          ctx.beginPath();
          ctx.moveTo(0, h);
          ctx.lineTo(0, h * 0.7);
          ctx.quadraticCurveTo(w * 0.35, h * 0.35 + mY * 0.2, w * 0.6, h * 0.8);
          ctx.quadraticCurveTo(w * 0.8, h * 0.55 + mY * 0.1, w, h * 0.95);
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fill();

          // Winding glowing path outline
          ctx.strokeStyle = "rgba(255, 209, 102, 0.25)";
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(255, 209, 102, 0.3)";
          ctx.beginPath();
          ctx.moveTo(w * 0.52, h * 0.78);
          ctx.quadraticCurveTo(w * 0.45, h * 0.85, w * 0.56, h * 0.90);
          ctx.quadraticCurveTo(w * 0.65, h * 0.94, w * 0.48, h);
          ctx.stroke();
          ctx.shadowBlur = 0;
          break;
        }

        // --- 11. MAKES ME MORE HUMAN: Ocean Waves ---
        case 11: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#071220");
          grad.addColorStop(0.6, "#0C233C"); // Deep sea
          grad.addColorStop(1, "#0A3B57"); // Waves glow
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Layered ocean waves moving at different frequencies
          const waves = [
            { freq: 0.003, speed: 0.003, amp: 22, color: "rgba(10, 40, 70, 0.3)" },
            { freq: 0.002, speed: -0.002, amp: 18, color: "rgba(15, 60, 95, 0.4)" },
            { freq: 0.004, speed: 0.004, amp: 12, color: "rgba(25, 80, 120, 0.5)" },
          ];

          waves.forEach((wave, idx) => {
            ctx.fillStyle = wave.color;
            ctx.beginPath();
            const yOffset = h * 0.65 + idx * 40 + mY * 0.5;
            ctx.moveTo(0, h);
            
            for (let x = 0; x <= w; x += 15) {
              const y = yOffset + Math.sin(x * wave.freq + time * wave.speed) * wave.amp;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fill();
          });
          break;
        }

        // --- 12. PAUSE BETWEEN WORLDS: Floating Clouds ---
        case 12: {
          // Dreamy purple-pink evening sky
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#0B0C16");
          grad.addColorStop(0.5, "#251F3D");
          grad.addColorStop(0.8, "#5A3D5C"); // Sunset pastel pink/purple
          grad.addColorStop(1, "#7D5265");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Render slow moving puffy clouds
          drawClouds(w);
          break;
        }

        // --- 13. REFLECTION OF THE SUN: Mirror Lake ---
        case 13: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#091221");
          grad.addColorStop(0.48, "#182A4A");
          grad.addColorStop(0.5, "#1B325A"); // Midline horizon
          grad.addColorStop(0.52, "#182A4A");
          grad.addColorStop(1, "#091221");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw sun reflection
          const sunX = w / 2 - (mouse.x * 20);
          
          // Draw top sun
          ctx.fillStyle = "rgba(255, 209, 102, 0.2)";
          ctx.beginPath();
          ctx.arc(sunX, h * 0.35, 45, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw mirrored bottom sun reflection (wobbly ripple effect)
          ctx.fillStyle = "rgba(255, 209, 102, 0.15)";
          ctx.beginPath();
          ctx.ellipse(sunX, h * 0.65 + Math.sin(time * 0.05) * 2, 45, 45 * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Horizon line overlay
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, h * 0.5);
          ctx.lineTo(w, h * 0.5);
          ctx.stroke();
          break;
        }

        // --- 14. WARMTH AFTER COLD: Warm Golden Forest ---
        case 14: {
          // Sunset warmth
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#130A06");
          grad.addColorStop(0.5, "#301509");
          grad.addColorStop(0.8, "#5E250A"); // Light warmth leaking
          grad.addColorStop(1, "#8A3C0F");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Golden rays
          drawSunRays(w * 0.8 + (mouse.x * 30), 0, time, 6, "rgba(255, 175, 70, 0.15)");

          // Floating golden dust spores (heavy density)
          drawFireflies(w, h, time, "rgba(255, 195, 80, 0.45)", 1.5);
          break;
        }

        // --- 15. RARE DIAMOND: Crystal Cave ---
        case 15: {
          const grad = ctx.createRadialGradient(
            w / 2 + mX, h / 2 + mY, 10,
            w / 2 + mX, h / 2 + mY, w * 0.7
          );
          grad.addColorStop(0, "#100B24"); // Indigo core
          grad.addColorStop(1, "#05020F"); // Shadow edges
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Procedural crystal polygons pulsing
          ctx.fillStyle = "rgba(196, 181, 253, 0.15)"; // Lavender glow
          ctx.strokeStyle = "rgba(196, 181, 253, 0.4)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(196, 181, 253, 0.6)";

          // Draw 5 main crystals growing from screen borders
          const crystalPoints = [
            [[0, h], [120, h - 180], [180, h]],
            [[w, h], [w - 150, h - 220], [w - 250, h]],
            [[w * 0.2, 0], [w * 0.25, 130], [w * 0.32, 0]],
            [[0, h * 0.3], [140, h * 0.38], [0, h * 0.46]],
          ];

          crystalPoints.forEach((pts) => {
            ctx.beginPath();
            ctx.moveTo(pts[0][0] + mX * 0.2, pts[0][1] + mY * 0.2);
            ctx.lineTo(pts[1][0] + mX * 0.3 + Math.sin(time * 0.02) * 5, pts[1][1] + mY * 0.3);
            ctx.lineTo(pts[2][0] + mX * 0.2, pts[2][1] + mY * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          });
          
          ctx.shadowBlur = 0;
          break;
        }

        // --- 16. ADORE: Cherry Blossoms ---
        case 16: {
          // Dreamy romantic sky
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#1A0F1A");
          grad.addColorStop(0.6, "#381B34");
          grad.addColorStop(1, "#542145"); // Pink/Magenta sunset
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Tree branch silhouettes hanging from top right
          ctx.fillStyle = "rgba(25, 10, 20, 0.75)";
          ctx.beginPath();
          ctx.moveTo(w, 0);
          ctx.bezierCurveTo(w - 150, 80, w - 300, 120, w - 450, 100);
          ctx.lineTo(w - 450, 80);
          ctx.bezierCurveTo(w - 300, 70, w - 100, 0, w, 0);
          ctx.fill();

          // Render cherry blossom petals
          state.cherryBlossoms.forEach((petal) => {
            petal.y += petal.vy;
            petal.x += petal.vx + Math.sin(time * 0.015 + petal.r) * 0.4 + (mouse.x * 0.5);
            petal.angle += petal.rSpeed;

            if (petal.y > h + 10) {
              petal.y = -10;
              petal.x = Math.random() * w;
            }

            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.angle);
            ctx.fillStyle = "rgba(249, 168, 212, 0.75)"; // Cherry pink
            // Draw small oval petal
            ctx.beginPath();
            ctx.ellipse(0, 0, petal.r * 1.5, petal.r * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
          break;
        }

        // --- 17. CHERISH: Starry Sky ---
        case 17: {
          ctx.fillStyle = "#05070F"; // Deepest cosmic night
          ctx.fillRect(0, 0, w, h);

          // Twilight stars dense background
          drawStars(w, time, 1.0);

          // Constellations logic drawn based on active coordinate hovering
          const activeStars = state.stars.filter((_, idx) => idx % 6 === 0);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 0.5;
          
          for (let i = 0; i < activeStars.length; i++) {
            for (let j = i + 1; j < activeStars.length; j++) {
              const dx = activeStars[i].x - activeStars[j].x;
              const dy = activeStars[i].y - activeStars[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(activeStars[i].x, activeStars[i].y);
                ctx.lineTo(activeStars[j].x, activeStars[j].y);
                ctx.stroke();
              }
            }
          }
          break;
        }

        // --- 18. BEAUTIFUL SOUL: Glowing Enchanted Forest ---
        case 18: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#030A14");
          grad.addColorStop(0.6, "#091D26"); // Mystical teal
          grad.addColorStop(1, "#0A282D");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Silhouette trees
          ctx.fillStyle = "rgba(3, 8, 12, 0.9)";
          for (let i = 20; i < w; i += 250) {
            const tx = i + mX * 0.3;
            ctx.fillRect(tx, 0, 25, h);
          }

          // Spores drifting upwards (Enchanted bio-luminescent fireflies)
          drawFireflies(w, h, time, "rgba(110, 231, 183, 0.45)", 1.2);
          break;
        }

        // --- 19. GENTLE RAIN: Soft Rainfall ---
        case 19: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#080C14");
          grad.addColorStop(0.8, "#161B24");
          grad.addColorStop(1, "#20252D"); // Cold grey rain sky
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw rain lines
          ctx.strokeStyle = "rgba(156, 163, 175, 0.25)";
          ctx.lineWidth = 1;
          state.rain.forEach((drop) => {
            drop.y += drop.vy;
            drop.x += (mouse.x * 2); // Wind drag
            
            if (drop.y > h) {
              drop.y = -drop.len;
              drop.x = Math.random() * w;
            }

            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x + (mouse.x * 2), drop.y + drop.len);
            ctx.stroke();
          });
          break;
        }

        // --- 20. MESMERIZING VOICE: Sunrise with Flying Birds ---
        case 20: {
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#0C1B2A");
          grad.addColorStop(0.5, "#253A4D");
          grad.addColorStop(0.85, "#936551"); // Sunrise orange horizon
          grad.addColorStop(1, "#DCA060");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw flying birds flock
          ctx.fillStyle = "rgba(45, 30, 20, 0.8)";
          state.birds.forEach((bird) => {
            bird.x += bird.speed + (mouse.x * 0.2);
            bird.y += Math.sin(time * 0.05 + bird.x * 0.01) * 0.5;
            bird.wingPhase += 0.12;

            if (bird.x > w + 100) {
              bird.x = -100;
              bird.y = Math.random() * (h * 0.3) + 100;
            }

            const wingY = Math.sin(bird.wingPhase) * bird.size * 0.8;

            ctx.beginPath();
            ctx.moveTo(bird.x - bird.size, bird.y - wingY);
            ctx.quadraticCurveTo(bird.x, bird.y, bird.x + bird.size, bird.y - wingY);
            ctx.quadraticCurveTo(bird.x, bird.y + bird.size * 0.5, bird.x - bird.size, bird.y - wingY);
            ctx.fill();
          });
          break;
        }

        // --- 21. CODE BUG FIX: Code columns morphing into stars ---
        case 21: {
          ctx.fillStyle = "#03060C";
          ctx.fillRect(0, 0, w, h);

          ctx.font = "12px monospace";
          ctx.fillStyle = "rgba(110, 231, 183, 0.4)"; // Matrix Green

          state.digitalParticles.forEach((part) => {
            if (time > 150) {
              part.isStar = true;
            }

            if (!part.isStar) {
              // Standard Falling Matrix code columns
              part.y += part.speed;
              if (part.y > h) {
                part.y = -20;
                part.x = Math.random() * w;
              }
              ctx.fillStyle = `rgba(110, 231, 183, ${part.alpha})`;
              ctx.fillText(part.char, part.x, part.y);
            } else {
              // Morphing and floating towards targets (glowing stars)
              part.x += (part.targetX - part.x) * 0.02;
              part.y += (part.targetY - part.y) * 0.02;
              part.alpha += (0.8 - part.alpha) * 0.05;
              
              ctx.fillStyle = `rgba(255, 255, 255, ${part.alpha})`;
              ctx.shadowBlur = 8;
              ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
              ctx.beginPath();
              ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          });
          break;
        }

        // --- 22. FINAL BEAUTIFUL SUNRISE ENDING ---
        case 22:
        case 23: {
          // Glorious sunrise
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, "#1A0E2E"); // Violet sky top
          grad.addColorStop(0.4, "#6B355A"); // Magenta
          grad.addColorStop(0.75, "#DF744A"); // Orange
          grad.addColorStop(1, "#FCD34D"); // Yellow gold base
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Volumetric rays of warm sunlight (heavy and moving)
          drawSunRays(w / 2 + (mouse.x * 20), h * 0.6, time, 12, "rgba(255, 245, 180, 0.16)");

          // Floating cherry blossom petals
          state.cherryBlossoms.forEach((petal) => {
            petal.y += petal.vy * 0.7;
            petal.x += petal.vx * 0.7 + Math.sin(time * 0.01 + petal.r) * 0.3 + (mouse.x * 0.3);
            if (petal.y > h + 10) {
              petal.y = -10;
              petal.x = Math.random() * w;
            }
            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.angle);
            ctx.fillStyle = "rgba(249, 168, 212, 0.8)";
            ctx.beginPath();
            ctx.ellipse(0, 0, petal.r * 1.5, petal.r * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          // Silhouette birds flying across screen
          ctx.fillStyle = "rgba(50, 25, 10, 0.75)";
          state.birds.forEach((bird) => {
            bird.x += bird.speed * 0.8 + (mouse.x * 0.1);
            bird.y += Math.sin(time * 0.04 + bird.x * 0.01) * 0.4;
            bird.wingPhase += 0.09;

            if (bird.x > w + 100) {
              bird.x = -100;
              bird.y = Math.random() * (h * 0.25) + 80;
            }

            const wingY = Math.sin(bird.wingPhase) * bird.size * 0.8;
            ctx.beginPath();
            ctx.moveTo(bird.x - bird.size, bird.y - wingY);
            ctx.quadraticCurveTo(bird.x, bird.y, bird.x + bird.size, bird.y - wingY);
            ctx.quadraticCurveTo(bird.x, bird.y + bird.size * 0.5, bird.x - bird.size, bird.y - wingY);
            ctx.fill();
          });
          break;
        }
      }
      ctx.restore();
    };

    // Draw twinkling star background helper
    const drawStars = (w: number, time: number, maxAlpha: number) => {
      const state = sceneStateRef.current;
      ctx.fillStyle = "#F8FAFC";
      state.stars.forEach((star) => {
        star.alpha += star.speed * (Math.random() > 0.5 ? 1 : -1);
        if (star.alpha > maxAlpha) star.alpha = maxAlpha;
        if (star.alpha < 0.1) star.alpha = 0.1;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
    };

    // Draw drifting clouds helper
    const drawClouds = (w: number) => {
      const state = sceneStateRef.current;
      state.clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.speed > 0 && cloud.x > w + 300) cloud.x = -300;
        if (cloud.speed < 0 && cloud.x < -300) cloud.x = w + 300;

        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(255, 255, 255, 0.05)";
        
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 60 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloud.x + 50 * cloud.scale, cloud.y - 20 * cloud.scale, 50 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloud.x - 50 * cloud.scale, cloud.y - 10 * cloud.scale, 45 * cloud.scale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    // Draw sunlight volumetric rays helper
    const drawSunRays = (srcX: number, srcY: number, time: number, numRays: number, color: string) => {
      ctx.fillStyle = color;
      for (let i = 0; i < numRays; i++) {
        const angle = 0.2 + (i * 0.12) + Math.sin(time * 0.005 + i) * 0.02;
        const width = 120 + Math.sin(time * 0.01 + i) * 30;
        
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        // Draw outward polygon ray
        ctx.lineTo(srcX + Math.cos(angle - 0.1) * 2000, srcY + Math.sin(angle - 0.1) * 2000);
        ctx.lineTo(srcX + Math.cos(angle + 0.1) * 2000 + width, srcY + Math.sin(angle + 0.1) * 2000);
        ctx.closePath();
        ctx.fill();
      }
    };

    // Draw ambient floating fireflies helper
    const drawFireflies = (w: number, h: number, time: number, color: string, speedMult: number) => {
      const state = sceneStateRef.current;
      state.fireflies.forEach((ff) => {
        ff.x += ff.vx * speedMult + (mouseRef.current.x * 0.2);
        ff.y += ff.vy * speedMult + (mouseRef.current.y * 0.2);
        ff.alpha += Math.sin(time * ff.glowSpeed) * 0.02;

        if (ff.alpha > 0.9) ff.alpha = 0.9;
        if (ff.alpha < 0.1) ff.alpha = 0.1;

        if (ff.x > w) ff.x = 0;
        if (ff.x < 0) ff.x = w;
        if (ff.y > h) ff.y = 0;
        if (ff.y < 0) ff.y = h;

        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.globalAlpha = ff.alpha;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    };

    // --- ANIMATION LOOP MANAGER ---
    let frameId: number;
    let time = 0;

    const renderLoop = () => {
      time += 1;
      
      // Clear main buffer
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp mouse variables for smooth parallax
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      // Update opacities of all scenes
      const ops = opacitiesRef.current;
      for (let i = 0; i < ops.length; i++) {
        const target = i === activeIndex ? 1 : 0;
        // Smooth cross-fade transition
        ops[i] += (target - ops[i]) * 0.045;
        
        // Render scene if its opacity is above threshold
        if (ops[i] > 0.002) {
          drawScene(i, ops[i], canvas.width, canvas.height, time);
        }
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeIndex]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      {/* Cinematic backgrounds rendering canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Cinematic Film Grain Overlay */}
      <div className="film-grain" />
    </div>
  );
}
