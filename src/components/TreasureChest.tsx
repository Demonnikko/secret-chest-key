import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TreasureChestProps {
  isShaking: boolean;
  isOpening: boolean;
  onAnimationComplete: () => void;
}

export function TreasureChest({ isShaking, isOpening, onAnimationComplete }: TreasureChestProps) {
  const chestRef = useRef<HTMLDivElement>(null);
  const [showMagicEffect, setShowMagicEffect] = useState(false);

  useEffect(() => {
    if (isOpening) {
      setShowMagicEffect(true);
      const timer = setTimeout(() => {
        setShowMagicEffect(false);
        onAnimationComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpening, onAnimationComplete]);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px] perspective-[1200px] floating-particles">
      {/* Magical Aura */}
      <div className={cn(
        "absolute inset-0 rounded-3xl transition-all duration-1000",
        "bg-gradient-to-r from-transparent via-gold-500/20 to-transparent",
        "animate-pulse-glow",
        isOpening && "animate-pulse scale-110 opacity-80"
      )} />
      
      {/* Sparkle Effects */}
      {showMagicEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className="w-3 h-3 bg-gold-400 rounded-full glow-gold animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Chest Container */}
      <div 
        ref={chestRef}
        className={cn(
          "absolute inset-0 mx-auto w-full h-full transform-gpu preserve-3d",
          "transition-all duration-600",
          "drop-shadow-2xl",
          isShaking && "animate-chest-shake",
          "glow-gold"
        )}
      >
        {/* Chest Base */}
        <div className="absolute bottom-0 w-full h-[60%] rounded-2xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 border-4 border-amber-950">
            {/* Wood Texture */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-600/20 to-transparent animate-shimmer" />
            </div>
            
            {/* Metal Bands */}
            <div className="absolute top-3 left-4 right-4 h-4 bg-gradient-gold rounded-full border-2 border-amber-950 shimmer" />
            <div className="absolute top-1/2 left-4 right-4 h-4 bg-gradient-gold rounded-full border-2 border-amber-950 shimmer transform -translate-y-1/2" />
            <div className="absolute bottom-3 left-4 right-4 h-4 bg-gradient-gold rounded-full border-2 border-amber-950 shimmer" />
          </div>
        </div>

        {/* Chest Lid */}
        <div className={cn(
          "absolute top-0 w-full h-[50%] rounded-t-2xl overflow-hidden",
          "origin-bottom transition-transform duration-800 ease-out",
          isOpening && "animate-lid-open"
        )}>
          <div className="w-full h-full bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 border-4 border-amber-950 border-b-0">
            {/* Wood Texture */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />
            </div>
            
            {/* Metal Bands */}
            <div className="absolute top-3 left-4 right-4 h-3 bg-gradient-gold rounded-full border-2 border-amber-950 shimmer" />
            <div className="absolute bottom-3 left-4 right-4 h-3 bg-gradient-gold rounded-full border-2 border-amber-950 shimmer" />
          </div>
        </div>

        {/* Lock */}
        <div className="absolute left-1/2 top-[45%] transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* Lock Body */}
            <div className="w-16 h-20 bg-gradient-gold rounded-2xl border-4 border-amber-950 shimmer glow-gold">
              {/* Keyhole */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-4 bg-amber-950 rounded-full" />
                <div className="w-1 h-3 bg-amber-950 mx-auto" />
              </div>
              
              {/* Lock Shackle */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-8 border-4 border-gold-600 rounded-t-full bg-transparent" />
              </div>
            </div>
            
            {/* Magical Glow on Lock */}
            {isOpening && (
              <div className="absolute inset-0 bg-gold-400/50 rounded-2xl animate-pulse glow-intense" />
            )}
          </div>
        </div>

        {/* Magic Burst Effect */}
        {showMagicEffect && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-32 h-32 bg-gradient-magic rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 w-32 h-32 bg-gold-400/30 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}