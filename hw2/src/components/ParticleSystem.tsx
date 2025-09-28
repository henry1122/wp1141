import React, { useEffect, useRef } from 'react';
import './ParticleSystem.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

interface ParticleSystemProps {
  isActive: boolean;
  x: number;
  y: number;
  color?: string;
  particleCount?: number;
  type?: 'explosion' | 'sparkle' | 'trail';
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  isActive,
  x,
  y,
  color = '#4ECDC4',
  particleCount = 20,
  type = 'explosion'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticles = () => {
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      let particle: Particle;
      
      switch (type) {
        case 'explosion':
          particle = {
            x,
            y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 0,
            maxLife: 60 + Math.random() * 40,
            size: 2 + Math.random() * 4,
            color,
            alpha: 1
          };
          break;
          
        case 'sparkle':
          particle = {
            x: x + (Math.random() - 0.5) * 50,
            y: y + (Math.random() - 0.5) * 50,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 0,
            maxLife: 40 + Math.random() * 20,
            size: 1 + Math.random() * 2,
            color,
            alpha: 1
          };
          break;
          
        case 'trail':
          particle = {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3 - 1,
            life: 0,
            maxLife: 30 + Math.random() * 30,
            size: 1 + Math.random() * 3,
            color,
            alpha: 1
          };
          break;
          
        default:
          particle = {
            x, y, vx: 0, vy: 0, life: 0, maxLife: 60, size: 2, color, alpha: 1
          };
      }
      
      particles.push(particle);
    }
    
    return particles;
  };

  const updateParticles = (particles: Particle[]) => {
    return particles.filter(particle => {
      particle.life++;
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 重力效果
      if (type === 'explosion' || type === 'trail') {
        particle.vy += 0.2;
      }
      
      // 阻力
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      // 透明度變化
      particle.alpha = 1 - (particle.life / particle.maxLife);
      
      return particle.life < particle.maxLife;
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      
      // 根據類型繪製不同形狀
      switch (type) {
        case 'sparkle':
          // 星形
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = particle.x + Math.cos(angle) * particle.size;
            const y = particle.y + Math.sin(angle) * particle.size;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          break;
          
        default:
          // 圓形
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
      }
      
      ctx.restore();
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    particlesRef.current = updateParticles(particlesRef.current);
    drawParticles(ctx, particlesRef.current);

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isActive) {
      particlesRef.current = createParticles();
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, x, y, color, particleCount, type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};

export default ParticleSystem;
