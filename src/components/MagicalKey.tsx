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
    setTimeout(() => setIsClicked(false), 800);
  };

  const getKeyStyles = () => {
    switch (variant) {
      case 'rare':
        return {
          glow: 'glow-gold-theater',
          gradient: 'keyGradientRare',
          indicator: '★',
          indicatorClass: 'bg-gradient-gold-theater text-amber-950'
        };
      case 'epic':
        return {
          glow: 'glow-diamond',
          gradient: 'keyGradientEpic',
          indicator: '◆',
          indicatorClass: 'bg-gradient-diamond-theater text-white'
        };
      default:
        return {
          glow: '',
          gradient: 'keyGradient',
          indicator: '',
          indicatorClass: ''
        };
    }
  };

  const keyStyles = getKeyStyles();

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative w-16 h-16 transition-theatrical focus:outline-none focus:ring-3 focus:ring-gold-500 focus:ring-offset-3 focus:ring-offset-background rounded-xl",
        "transform-gpu transition-premium",
        isHovering && "animate-premium-key-hover",
        isClicked && "scale-90 translate-y-2",
        keyStyles.glow
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${index * 80}ms`
      }}
      aria-label={`Премиальный ключ ${index + 1} - ${variant}`}
    >
      {/* Театральный ключ SVG */}
      <svg
        viewBox="0 0 140 80"
        className="w-full h-full drop-shadow-xl"
        style={{
          filter: isHovering 
            ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(251,191,36,0.8))' 
            : 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))'
        }}
      >
        <defs>
          {/* Обычный ключ - бронза/сталь */}
          <linearGradient id={`keyGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(30 60% 70%)" />
            <stop offset="50%" stopColor="hsl(25 55% 50%)" />
            <stop offset="100%" stopColor="hsl(20 50% 30%)" />
          </linearGradient>
          
          {/* Редкий ключ - золото с драгоценными вставками */}
          <linearGradient id={`keyGradientRare-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(48 100% 85%)" />
            <stop offset="30%" stopColor="hsl(42 87% 65%)" />
            <stop offset="70%" stopColor="hsl(38 85% 55%)" />
            <stop offset="100%" stopColor="hsl(32 81% 45%)" />
          </linearGradient>
          
          {/* Эпический ключ - магическое свечение */}
          <linearGradient id={`keyGradientEpic-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(280 100% 75%)" />
            <stop offset="20%" stopColor="hsl(260 100% 80%)" />
            <stop offset="40%" stopColor="hsl(48 100% 85%)" />
            <stop offset="60%" stopColor="hsl(42 87% 60%)" />
            <stop offset="80%" stopColor="hsl(220 70% 70%)" />
            <stop offset="100%" stopColor="hsl(280 100% 60%)" />
          </linearGradient>
          
          {/* Алмазные блики для эпических ключей */}
          <radialGradient id={`sparkle-${index}`} cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="hsl(180 100% 95%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(200 80% 80%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Тело ключа */}
        <g fill={`url(#${keyStyles.gradient}-${index})`} stroke="hsl(20 40% 15%)" strokeWidth="4">
          {/* Голова ключа - более детализированная */}
          {variant === 'epic' ? (
            /* Эпическая голова с орнаментом */
            <g>
              <circle cx="28" cy="40" r="20" />
              <circle cx="28" cy="40" r="12" fill={`url(#sparkle-${index})`} />
              <path d="M 28 25 Q 35 30 40 40 Q 35 50 28 55 Q 21 50 16 40 Q 21 30 28 25 Z" fill="hsl(280 100% 85%)" opacity="0.6" />
            </g>
          ) : variant === 'rare' ? (
            /* Редкая голова с гравировкой */
            <g>
              <circle cx="28" cy="40" r="18" />
              <circle cx="28" cy="40" r="10" fill="none" stroke="hsl(32 81% 39%)" strokeWidth="2" />
              <circle cx="28" cy="40" r="5" fill="hsl(42 87% 65%)" />
            </g>
          ) : (
            /* Обычная голова */
            <circle cx="28" cy="40" r="16" />
          )}
          
          {/* Стержень ключа */}
          <rect x="48" y="36" width={variant === 'epic' ? "60" : "55"} height="8" rx="4" />
          
          {/* Зубцы ключа - более сложные для редких ключей */}
          {variant === 'epic' ? (
            <g>
              <rect x="105" y="30" width="10" height="20" rx="3" />
              <rect x="117" y="32" width="12" height="16" rx="3" />
              <rect x="131" y="34" width="8" height="12" rx="2" />
            </g>
          ) : variant === 'rare' ? (
            <g>
              <rect x="100" y="32" width="9" height="16" rx="2" />
              <rect x="111" y="34" width="11" height="12" rx="2" />
              <rect x="124" y="36" width="8" height="8" rx="2" />
            </g>
          ) : (
            <g>
              <rect x="98" y="33" width="8" height="14" rx="2" />
              <rect x="108" y="36" width="10" height="8" rx="2" />
            </g>
          )}
        </g>
        
        {/* Центральное отверстие */}
        <circle cx="28" cy="40" r={variant === 'epic' ? "8" : "6"} fill="hsl(20 40% 15%)" />
        
        {/* Эффекты свечения при наведении */}
        {isHovering && (
          <g>
            <path
              d="M18 30 L38 50 M22 26 L42 46 M24 28 L40 44"
              stroke="hsl(48 100% 95%)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {variant === 'epic' && (
              <circle cx="28" cy="40" r="25" fill="none" stroke="hsl(280 100% 85%)" strokeWidth="1" opacity="0.6" />
            )}
          </g>
        )}
      </svg>

      {/* Индикатор редкости */}
      {variant !== 'common' && (
        <div className={cn(
          "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-lg",
          keyStyles.indicatorClass,
          variant === 'epic' && "animate-diamond-sparkle"
        )}>
          {keyStyles.indicator}
        </div>
      )}

      {/* Магические частицы для эпических ключей */}
      {variant === 'epic' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-diamond-sparkle opacity-70"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Эффект клика */}
      {isClicked && (
        <div className="absolute inset-0 bg-gradient-gold-theater/40 rounded-xl animate-ping" />
      )}
    </button>
  );
}