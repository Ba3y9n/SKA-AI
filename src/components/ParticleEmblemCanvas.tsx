import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

export const ParticleEmblemCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 120 : 260;

    const colors = [
      '#006C35', // Saudi Green
      '#C9A227', // Luxury Gold
      '#FFFFFF', // Radiant White
      '#008A44', // Soft Green
      '#E6CA65'  // Bright Gold
    ];

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false
    };

    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.42;

    for (let i = 0; i < particleCount; i++) {
      const orbitRadius = 40 + Math.random() * (maxRadius - 40);
      const angle = Math.random() * Math.PI * 2;
      const x = centerX + Math.cos(angle) * orbitRadius;
      const y = centerY + Math.sin(angle) * orbitRadius;

      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        angle,
        orbitRadius,
        orbitSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let angleRing = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      angleRing += 0.003;
      const curCenterX = width / 2 + (mouse.x - width / 2) * 0.05;
      const curCenterY = height / 2 + (mouse.y - height / 2) * 0.05;

      // Draw Orbit Rings
      ctx.save();
      ctx.translate(curCenterX, curCenterY);
      
      // Ring 1 (Gold dashed)
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.75, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.2)';
      ctx.setLineDash([6, 12]);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Ring 2 (Soft Green)
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 108, 53, 0.15)';
      ctx.setLineDash([15, 20]);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ring 3 (Outer Gold Glow)
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.25)';
      ctx.setLineDash([4, 8]);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();

      // Render Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbit calculation
        p.angle += p.orbitSpeed;
        const targetX = curCenterX + Math.cos(p.angle) * p.orbitRadius;
        const targetY = curCenterY + Math.sin(p.angle) * p.orbitRadius;

        // Mouse displacement
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist && mouse.isHovered) {
          const force = (1 - dist / maxDist) * 18;
          p.vx -= (dx / dist) * force * 0.2;
          p.vy -= (dy / dist) * force * 0.2;
        }

        p.vx += (targetX - p.x) * 0.04;
        p.vy += (targetY - p.y) * 0.04;
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-auto z-0" 
    />
  );
};
