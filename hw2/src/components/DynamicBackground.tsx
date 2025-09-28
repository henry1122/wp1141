import React, { useEffect, useRef } from 'react';
import { LevelConfig } from '../types/levels';
import './DynamicBackground.css';

interface DynamicBackgroundProps {
  level: LevelConfig;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ level }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      life: number;
    }> = [];

    // 初始化粒子
    const initParticles = () => {
      particles = [];
      const particleCount = level.background.particles ? 50 : 0;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          color: getParticleColor(),
          life: Math.random() * 100 + 50,
        });
      }
    };

    const getParticleColor = () => {
      const colors = ['#ffffff', '#f0f0f0', '#e0e0e0'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和繪製粒子
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // 邊界檢查
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 重生粒子
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = Math.random() * 100 + 50;
          particle.opacity = Math.random() * 0.5 + 0.1;
        }

        // 繪製粒子
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        
        // 根據動畫類型調整粒子效果
        switch (level.background.animation) {
          case 'pulse':
            const pulseSize = particle.size * (1 + Math.sin(timestamp * 0.005) * 0.3);
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          case 'wave':
            particle.y += Math.sin(timestamp * 0.003 + particle.x * 0.01) * 0.5;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          case 'rotate':
            const angle = timestamp * 0.002 + index;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
            particle.x = centerX + Math.cos(angle) * radius * 0.1;
            particle.y = centerY + Math.sin(angle) * radius * 0.1;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          case 'matrix':
            // 矩陣雨效果
            ctx.fillStyle = particle.color;
            ctx.font = `${particle.size * 8}px monospace`;
            const chars = '01';
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, particle.x, particle.y);
            particle.y += particle.size * 2;
            if (particle.y > canvas.height) {
              particle.y = 0;
              particle.x = Math.random() * canvas.width;
            }
            break;
            
          default:
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (level.background.particles) {
      initParticles();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [level]);

  return (
    <div className="dynamic-background">
      <div 
        className={`background-gradient ${level.background.animation || ''}`}
        style={{ background: level.background.gradient }}
      />
      {level.background.particles && (
        <canvas
          ref={canvasRef}
          className="background-canvas"
        />
      )}
    </div>
  );
};

export default DynamicBackground;
