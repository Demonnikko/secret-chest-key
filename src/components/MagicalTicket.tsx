import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Prize {
  id: string;
  label: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount?: number;
}

interface MagicalTicketProps {
  prize: Prize;
  className?: string;
}

export function MagicalTicket({ prize, className }: MagicalTicketProps) {
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealing(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getTicketTheme = () => {
    switch (prize.rarity) {
      case 'legendary':
        return {
          background: 'from-purple-900 via-gold-600 to-purple-900',
          border: 'border-purple-500',
          glow: 'glow-purple',
          foil: 'bg-gradient-to-r from-purple-300 via-gold-300 to-purple-300',
          sparkles: 'from-purple-400 to-gold-400'
        };
      case 'epic':
        return {
          background: 'from-blue-900 via-gold-700 to-blue-900',
          border: 'border-blue-500',
          glow: 'glow-gold',
          foil: 'bg-gradient-to-r from-blue-300 via-gold-300 to-blue-300',
          sparkles: 'from-blue-400 to-gold-400'
        };
      case 'rare':
        return {
          background: 'from-amber-800 via-gold-600 to-amber-800',
          border: 'border-gold-500',
          glow: 'glow-gold',
          foil: 'bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200',
          sparkles: 'from-gold-300 to-gold-500'
        };
      default:
        return {
          background: 'from-amber-900 via-amber-700 to-amber-900',
          border: 'border-amber-600',
          glow: '',
          foil: 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200',
          sparkles: 'from-amber-400 to-amber-600'
        };
    }
  };

  const theme = getTicketTheme();

  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto aspect-[16/7] rounded-3xl overflow-hidden",
      "border-4 transform-gpu transition-all duration-1000",
      theme.border,
      theme.glow,
      isRevealing && "scale-100 opacity-100",
      !isRevealing && "scale-95 opacity-80",
      className
    )}>
      {/* Ticket Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        theme.background
      )} />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 175" className="w-full h-full">
          <defs>
            <pattern id="ticketPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.3" />
              <path d="M10,20 Q20,10 30,20 Q20,30 10,20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ticketPattern)" />
        </svg>
      </div>

      {/* Perforated edges */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <div className="w-8 h-8 rounded-full bg-background border-2 border-current opacity-80" />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
        <div className="w-8 h-8 rounded-full bg-background border-2 border-current opacity-80" />
      </div>

      {/* Decorative corners */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-16 h-16 opacity-60",
            i === 0 && "top-4 left-4",
            i === 1 && "top-4 right-4 rotate-90",
            i === 2 && "bottom-4 right-4 rotate-180",
            i === 3 && "bottom-4 left-4 -rotate-90"
          )}
        >
          <svg viewBox="0 0 64 64" className="w-full h-full text-gold-400">
            <path
              d="M8,8 L24,8 Q32,8 32,16 L32,24 M32,32 L32,40 Q32,48 24,48 L8,48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      {/* Main Content Area */}
      <div className="absolute inset-8 bg-black/30 rounded-2xl border border-white/20 backdrop-blur-sm">
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
          {/* Prize Title */}
          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-display font-bold",
            "bg-clip-text text-transparent",
            theme.foil,
            "text-glow drop-shadow-lg"
          )}>
            {prize.label}
          </h2>

          {/* Prize Description */}
          <p className="text-gold-200 text-lg md:text-xl font-semibold opacity-90">
            {prize.description}
          </p>

          {/* Rarity Badge */}
          <div className={cn(
            "px-4 py-2 rounded-full border-2 backdrop-blur-sm",
            "bg-gradient-to-r font-bold text-sm uppercase tracking-wider",
            theme.sparkles,
            "text-black border-white/30"
          )}>
            {prize.rarity} Prize
          </div>

          {/* Magical shine effect */}
          {isRevealing && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          )}
        </div>
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full animate-float",
              "bg-gradient-to-r",
              theme.sparkles
            )}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-mode-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}