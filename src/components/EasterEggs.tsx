"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  alpha: number;
}

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  angle: number;
}

interface ConstellationStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
}

interface GrowingFlower {
  x: number;
  y: number;
  growth: number; // 0 to 1
  maxHeight: number;
  color: string;
  stemWidth: number;
  blossomSize: number;
}

export default function EasterEggs() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Easter egg states
  const petalsRef = useRef<Petal[]>([]);
  const firefliesRef = useRef<Firefly[]>([]);
  const starsRef = useRef<ConstellationStar[]>([]);
  const flowersRef = useRef<GrowingFlower[]>([]);
  
  // Buffers for secret inputs
  const typedKeysRef = useRef<string[]>([]);
  const konamiKeysRef = useRef<number[]>([]);
  
  // Long press tracking variables
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressingRef = useRef(false);
  const pressCoordsRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- 1. SECRET TYPING & KONAMI CODE MATCHERS ---
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Typing "juzuuuu" trigger
      typedKeysRef.current.push(e.key.toLowerCase());
      if (typedKeysRef.current.length > 20) {
        typedKeysRef.current.shift();
      }
      const typedString = typedKeysRef.current.join("");
      if (typedString.includes("juzuuuu")) {
        triggerPetalExplosion();
        typedKeysRef.current = []; // Clear buffer
      }

      // Konami Code trigger
      konamiKeysRef.current.push(e.keyCode);
      if (konamiKeysRef.current.length > konamiCode.length) {
        konamiKeysRef.current.shift();
      }
      
      const isKonamiMatch = konamiCode.every((val, index) => val === konamiKeysRef.current[index]);
      if (isKonamiMatch && konamiKeysRef.current.length === konamiCode.length) {
        triggerFireflySwarm();
        konamiKeysRef.current = []; // Clear buffer
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Trigger petal burst from screen center
    const triggerPetalExplosion = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 8 + 3;
        
        petalsRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * 5 + 4,
          angle: Math.random() * Math.PI * 2,
          spin: Math.random() * 0.06 - 0.03,
          alpha: 1.0,
        });
      }
    };

    // Trigger Konami code fireflies swarm
    const triggerFireflySwarm = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      for (let i = 0; i < 150; i++) {
        firefliesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.random() * 3 - 1.5,
          vy: Math.random() * 3 - 1.5,
          size: Math.random() * 2 + 1.5,
          alpha: 1.0,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    // --- 2. LONG PRESS & CLICKS INTERACTIONS ---
    const flowerColors = ["#F9A8D4", "#FDE047", "#C4B5FD", "#7DD3FC", "#6EE7B7"];

    const handleMouseDown = (e: MouseEvent) => {
      // Store coordinates
      pressCoordsRef.current = { x: e.clientX, y: e.clientY };
      isPressingRef.current = true;

      // Start timer for long press
      pressTimerRef.current = setTimeout(() => {
        if (isPressingRef.current) {
          triggerFlowerGrowth(pressCoordsRef.current.x, pressCoordsRef.current.y);
        }
      }, 1500); // 1500ms hold triggers wildflower growth
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Clear long press timer
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }

      // If release was quick (less than 500ms), it's a simple click: spawn star constellation node
      if (isPressingRef.current) {
        const dx = e.clientX - pressCoordsRef.current.x;
        const dy = e.clientY - pressCoordsRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Ensure user clicked instead of dragging
        if (dist < 5) {
          triggerConstellationStar(e.clientX, e.clientY);
        }
      }

      isPressingRef.current = false;
    };

    const triggerFlowerGrowth = (x: number, y: number) => {
      flowersRef.current.push({
        x,
        y,
        growth: 0,
        maxHeight: Math.random() * 100 + 60,
        blossomSize: Math.random() * 6 + 4,
        stemWidth: Math.random() * 1.5 + 1.5,
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
      });
    };

    const triggerConstellationStar = (x: number, y: number) => {
      starsRef.current.push({
        x,
        y,
        size: Math.random() * 2 + 1.5,
        alpha: 1.0,
        pulseSpeed: Math.random() * 0.05 + 0.02,
      });

      // Keep maximum of 40 custom stars on screen to preserve performance
      if (starsRef.current.length > 40) {
        starsRef.current.shift();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Supporting Touch Devices for Easter Eggs
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      pressCoordsRef.current = { x: touch.clientX, y: touch.clientY };
      isPressingRef.current = true;
      pressTimerRef.current = setTimeout(() => {
        if (isPressingRef.current) {
          triggerFlowerGrowth(pressCoordsRef.current.x, pressCoordsRef.current.y);
        }
      }, 1500);
    };

    const handleTouchEnd = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      isPressingRef.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    // --- 3. ANIMATION LOOP RENDERER ---
    let frameId: number;
    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Draw "juzuuuu" exploding petals ---
      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // Gravity pulls down
        p.vx *= 0.98; // Friction drag
        p.angle += p.spin;
        p.alpha -= 0.01; // Slow fade out

        if (p.alpha <= 0 || p.y > canvas.height) {
          petals.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = `rgba(249, 168, 212, ${p.alpha * 0.8})`; // Pink petal color
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- Draw Konami Fireflies ---
      const fflies = firefliesRef.current;
      for (let i = fflies.length - 1; i >= 0; i--) {
        const f = fflies[i];
        f.angle += 0.04;
        f.x += f.vx + Math.sin(f.angle) * 0.5;
        f.y += f.vy + Math.cos(f.angle) * 0.5;
        f.alpha -= 0.002; // Slow fading lifetime

        if (f.alpha <= 0) {
          fflies.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(110, 231, 183, ${f.alpha})`; // Glowing green-mint
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(110, 231, 183, 0.8)";
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0; // Reset shadow

      // --- Draw Clicked Constellation Stars and Connections ---
      const stars = starsRef.current;
      
      // Draw lines between nearby custom stars
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 0.75;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(255,255,255,0.4)";
      
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            const alpha = (1 - dist / 150) * Math.min(stars[i].alpha, stars[j].alpha) * 0.35;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // Draw custom stars cores
      stars.forEach((s) => {
        s.alpha = 0.6 + Math.sin(time * s.pulseSpeed) * 0.4;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // --- Draw Growing Wildflowers from Long Press ---
      const flowers = flowersRef.current;
      flowers.forEach((fl) => {
        if (fl.growth < 1.0) {
          fl.growth += 0.015; // Slow growth animation
        }

        const currentHeight = fl.maxHeight * fl.growth;
        const stemEndY = fl.y - currentHeight;

        // Draw Stem
        ctx.strokeStyle = "rgba(74, 117, 89, 0.6)"; // Mossy green
        ctx.lineWidth = fl.stemWidth;
        ctx.beginPath();
        ctx.moveTo(fl.x, fl.y);
        ctx.quadraticCurveTo(
          fl.x + Math.sin(time * 0.02) * 5 * fl.growth, fl.y - currentHeight * 0.5,
          fl.x, stemEndY
        );
        ctx.stroke();

        // Draw Blossom head once growth starts
        if (fl.growth > 0.4) {
          const blossomAlpha = (fl.growth - 0.4) / 0.6;
          ctx.fillStyle = fl.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = fl.color;
          ctx.globalAlpha = blossomAlpha;
          ctx.beginPath();
          ctx.arc(fl.x, stemEndY, fl.blossomSize * fl.growth, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });
      ctx.shadowBlur = 0;

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30 block"
    />
  );
}
