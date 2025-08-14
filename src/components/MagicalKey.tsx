import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MagicalKeyProps {
  onClick: () => void;
  variant?: 'common' | 'rare' | 'epic';
  rotation?: number;
  index: number;
}

export function MagicalKey({ onClick, variant = 'common', rotation = 0, index }: MagicalKeyProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
    setTimeout(() => setIsClicked(false), 600);
  };

  const getKeyColor = () => {
    switch (variant) {
      case 'rare':
        return 'from-gold-400 to-gold-600';
      case 'epic':
        return 'from-purple-400 via-gold-400 to-purple-600';
      default:
        return 'from-gold-500 to-gold-700';
    }
  };

  const getGlowEffect = () => {
    switch (variant) {
      case 'rare':
        return 'glow-gold';
      case 'epic':
        return 'glow-purple';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative w-14 h-14 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-background rounded-lg",
        "transform-gpu hover:scale-110 hover:-translate-y-2 hover:-rotate-3",
        isClicked && "scale-95 translate-y-1",
        getGlowEffect()
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${index * 50}ms`
      }}
      aria-label={`Magical key ${index + 1} - ${variant}`}
    >
      {/* Key SVG */}
      <svg
        viewBox="0 0 120 64"
        className="w-full h-full drop-shadow-lg"
        style={{
          filter: isHovering ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 0 12px rgba(251,191,36,0.6))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}
      >
        <defs>
          <linearGradient id={`keyGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(48 100% 80%)" />
            <stop offset="50%" stopColor="hsl(42 87% 55%)" />
            <stop offset="100%" stopColor="hsl(32 81% 39%)" />
          </linearGradient>
          <linearGradient id={`keyGradientRare-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(48 100% 85%)" />
            <stop offset="50%" stopColor="hsl(42 87% 60%)" />
            <stop offset="100%" stopColor="hsl(32 81% 45%)" />
          </linearGradient>
          <linearGradient id={`keyGradientEpic-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(280 100% 70%)" />
            <stop offset="25%" stopColor="hsl(48 100% 80%)" />
            <stop offset="75%" stopColor="hsl(42 87% 55%)" />
            <stop offset="100%" stopColor="hsl(280 100% 50%)" />
          </linearGradient>
        </defs>
        
        {/* Key Shape */}
        <g fill={`url(#keyGradient${variant === 'rare' ? 'Rare' : variant === 'epic' ? 'Epic' : ''}-${index})`} stroke="hsl(27 69% 14%)" strokeWidth="3">
          {/* Key Head (circular) */}
          <circle cx="24" cy="32" r="16" />
          {/* Key Shaft */}
          <rect x="40" y="29" width="52" height="6" rx="3" />
          {/* Key Teeth */}
          <rect x="88" y="25" width="8" height="14" rx="2" />
          <rect x="98" y="27" width="10" height="10" rx="2" />
        </g>
        
        {/* Inner hole */}
        <circle cx="24" cy="32" r="6" fill="hsl(27 69% 14%)" />
        
        {/* Shine effect */}
        {isHovering && (
          <g>
            <path
              d="M16 24 L32 40 M20 20 L36 36"
              stroke="hsl(48 100% 90%)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
        )}
      </svg>

      {/* Rare/Epic indicator */}
      {variant !== 'common' && (
        <div className={cn(
          "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold",
          variant === 'rare' && "bg-gold-500 text-gold-900",
          variant === 'epic' && "bg-gradient-to-r from-purple-500 to-gold-500 text-white"
        )}>
          {variant === 'rare' ? '★' : '◆'}
        </div>
      )}

      {/* Magical particles for epic keys */}
      {variant === 'epic' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Click ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-gold-400/30 rounded-full animate-ping" />
      )}
    </button>
  );
}