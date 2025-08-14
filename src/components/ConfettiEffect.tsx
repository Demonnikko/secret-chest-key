import { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
  active: boolean;
  intensity?: 'normal' | 'epic' | 'legendary';
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'star' | 'diamond';
  life: number;
  maxLife: number;
}

export function ConfettiEffect({ active, intensity = 'normal', duration = 3000 }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const colors = {
    normal: ['#fbbf24', '#f59e0b', '#d97706', '#92400e'],
    epic: ['#fbbf24', '#f59e0b', '#8b5cf6', '#7c3aed', '#ffffff'],
    legendary: ['#fbbf24', '#f59e0b', '#8b5cf6', '#7c3aed', '#ec4899', '#ffffff', '#10b981']
  };

  const getParticleCount = () => {
    switch (intensity) {
      case 'legendary': return 150;
      case 'epic': return 100;
      default: return 60;
    }
  };

  const createParticle = (startX: number, startY: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;
    const shapes: Particle['shape'][] = ['circle', 'square', 'star', 'diamond'];
    
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (2 + Math.random() * 3),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      size: 4 + Math.random() * 8,
      color: colors[intensity][Math.floor(Math.random() * colors[intensity].length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 0,
      maxLife: 2000 + Math.random() * 2000
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = 1 - (particle.life / particle.maxLife);
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'square':
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        break;
      
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const outerRadius = particle.size / 2;
          const innerRadius = outerRadius * 0.4;
          
          if (i === 0) {
            ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
          } else {
            ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
          }
          
          const innerAngle = angle + Math.PI / 5;
          ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
        }
        ctx.closePath();
        ctx.fill();
        break;
      
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -particle.size / 2);
        ctx.lineTo(particle.size / 2, 0);
        ctx.lineTo(0, particle.size / 2);
        ctx.lineTo(-particle.size / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(particle => {
      // Update physics
      particle.vy += 0.2; // gravity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;
      particle.life += 16;

      // Draw particle
      drawParticle(ctx, particle);

      // Remove if off screen or expired
      return particle.y < canvas.height + 50 && 
             particle.x > -50 && 
             particle.x < canvas.width + 50 && 
             particle.life < particle.maxLife;
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const startConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles from center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particleCount = getParticleCount();

    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(centerX, centerY));
    }

    // Start animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();

    // Auto stop after duration
    setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, duration);
  };

  useEffect(() => {
    if (active) {
      startConfetti();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, intensity, duration]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ 
        width: '100vw', 
        height: '100vh',
        display: active ? 'block' : 'none'
      }}
    />
  );
}