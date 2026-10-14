"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const isMovingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;
    
    const handleQueryChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener("change", handleQueryChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      isMovingRef.current = true;

      // Initialize cursor position on first move
      if (mouseRef.current.x === 0 && mouseRef.current.y === 0) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Color list for particles
    const colors = [
      "rgba(255, 209, 102, ",  // Gold
      "rgba(249, 168, 212, ",  // Pink
      "rgba(196, 181, 253, ",  // Lavender
      "rgba(125, 211, 252, ",  // Sky Blue
      "rgba(110, 231, 183, ",  // Mint
    ];

    const createParticles = (x: number, y: number) => {
      if (reducedMotionRef.current) return;

      const dx = x - lastMousePosRef.current.x;
      const dy = y - lastMousePosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Only spawn particles if moving
      if (speed > 1) {
        const particleCount = Math.min(Math.ceil(speed / 4), 5);
        for (let i = 0; i < particleCount; i++) {
          const colorBase = colors[Math.floor(Math.random() * colors.length)];
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 1.5;
          
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * velocity - (dx * 0.1),
            vy: Math.sin(angle) * velocity - (dy * 0.1),
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: colorBase,
          });
        }
      }
      
      lastMousePosRef.current.x = x;
      lastMousePosRef.current.y = y;
    };

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const m = mouseRef.current;
      
      if (reducedMotionRef.current) {
        // Direct jump, no smooth lerp
        m.x = m.targetX;
        m.y = m.targetY;
      } else {
        // Smooth interpolation (lerp)
        m.x += (m.targetX - m.x) * 0.15;
        m.y += (m.targetY - m.y) * 0.15;
      }

      // Generate particles
      createParticles(m.x, m.y);

      // Render particle trails
      if (!reducedMotionRef.current) {
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.02; // Float upwards slightly
          p.alpha -= 0.02; // Fade out
          p.size *= 0.98; // Shrink

          if (p.alpha <= 0 || p.size <= 0.1) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `${p.color}0.5)`;
          ctx.fill();
        }
      }

      // Reset shadow for the main cursor
      ctx.shadowBlur = 0;

      // Draw Main Orb Cursor
      ctx.beginPath();
      ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // Draw Outer Aura
      ctx.beginPath();
      ctx.arc(m.x, m.y, 20, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      mediaQuery.removeEventListener("change", handleQueryChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[99999] hidden md:block"
    />
  );
}
