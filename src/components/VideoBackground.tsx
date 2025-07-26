import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

export const VideoBackground = ({ className = "" }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create animated gradient background as video alternative
    const createAnimatedBackground = () => {
      if (!videoRef.current) return;
      
      const colors = [
        'rgba(99, 102, 241, 0.1)',
        'rgba(6, 182, 212, 0.1)',
        'rgba(139, 92, 246, 0.1)',
        'rgba(16, 185, 129, 0.1)'
      ];
      
      let colorIndex = 0;
      
      const animate = () => {
        if (videoRef.current) {
          videoRef.current.style.background = `
            radial-gradient(circle at 20% 20%, ${colors[colorIndex % colors.length]} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${colors[(colorIndex + 1) % colors.length]} 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, ${colors[(colorIndex + 2) % colors.length]} 0%, transparent 50%)
          `;
          colorIndex++;
        }
        requestAnimationFrame(animate);
      };
      
      animate();
    };

    createAnimatedBackground();
  }, []);

  return (
    <div 
      ref={videoRef}
      className={`absolute inset-0 opacity-30 transition-all duration-1000 ${className}`}
    />
  );
};