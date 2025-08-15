import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TreasureChestProps {
  isShaking: boolean;
  isOpening: boolean;
  onAnimationComplete: () => void;
}

export function TreasureChest({ isShaking, isOpening, onAnimationComplete }: TreasureChestProps) {
  const chestRef = useRef<HTMLDivElement>(null);
  const [showMagicExplosion, setShowMagicExplosion] = useState(false);

  useEffect(() => {
    if (isOpening) {
      setShowMagicExplosion(true);
      const timer = setTimeout(() => {
        setShowMagicExplosion(false);
        onAnimationComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpening, onAnimationComplete]);

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[500px] perspective-theater">
      {/* Театральное освещение */}
      <div className={cn(
        "absolute inset-0 rounded-3xl transition-all duration-1000",
        "bg-gradient-to-r from-transparent via-spotlight/20 to-transparent",
        "animate-magical-glow-pulse",
        isOpening && "glow-spotlight scale-110 opacity-90"
      )} />
      
      {/* Магические искры при открытии */}
      {showMagicExplosion && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-diamond-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-gold-300 to-gold-500 rounded-full glow-gold-theater" />
            </div>
          ))}
        </div>
      )}

      {/* Премиальный сундук */}
      <div 
        ref={chestRef}
        className={cn(
          "absolute inset-0 mx-auto w-full h-full transform-3d",
          "transition-theatrical",
          "drop-shadow-2xl",
          isShaking && "animate-chest-theatrical-shake",
          "glow-gold-theater"
        )}
      >
        {/* Основание сундука */}
        <div className="absolute bottom-0 w-full h-[65%] rounded-3xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 border-6 border-amber-950">
            {/* Текстура благородного дерева */}
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-amber-700/20 via-transparent to-amber-950/40" />
            </div>
            
            {/* Золотые накладки */}
            <div className="absolute top-4 left-6 right-6 h-6 bg-gradient-gold-theater rounded-full border-3 border-amber-950 glow-gold-theater" />
            <div className="absolute top-1/2 left-6 right-6 h-6 bg-gradient-gold-theater rounded-full border-3 border-amber-950 glow-gold-theater transform -translate-y-1/2" />
            <div className="absolute bottom-4 left-6 right-6 h-6 bg-gradient-gold-theater rounded-full border-3 border-amber-950 glow-gold-theater" />
            
            {/* Угловые детали */}
            <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-gold-theater rounded-full border-2 border-amber-950" />
            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-gold-theater rounded-full border-2 border-amber-950" />
            <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-gold-theater rounded-full border-2 border-amber-950" />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-gold-theater rounded-full border-2 border-amber-950" />
          </div>
        </div>

        {/* Крышка сундука */}
        <div className={cn(
          "absolute top-0 w-full h-[55%] rounded-t-3xl overflow-hidden",
          "origin-bottom transition-transform duration-1200 ease-out transform-3d",
          isOpening && "animate-chest-explosion-open"
        )}>
          <div className="w-full h-full bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 border-6 border-amber-950 border-b-0">
            {/* Текстура крышки */}
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-amber-700/20 via-transparent to-amber-950/30" />
            </div>
            
            {/* Золотые полосы */}
            <div className="absolute top-4 left-6 right-6 h-5 bg-gradient-gold-theater rounded-full border-3 border-amber-950 glow-gold-theater" />
            <div className="absolute bottom-4 left-6 right-6 h-5 bg-gradient-gold-theater rounded-full border-3 border-amber-950 glow-gold-theater" />
            
            {/* Угловые украшения */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-gold-theater rounded-full border-2 border-amber-950" />
            <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-gold-theater rounded-full border-2 border-amber-950" />
          </div>
        </div>

        {/* Премиальный замок */}
        <div className="absolute left-1/2 top-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* Тело замка */}
            <div className="w-20 h-28 bg-gradient-gold-theater rounded-3xl border-6 border-amber-950 glow-gold-theater relative overflow-hidden">
              {/* Замочная скважина */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-5 bg-amber-950 rounded-full" />
                <div className="w-2 h-4 bg-amber-950 mx-auto" />
              </div>
              
              {/* Дужка замка */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-12 border-6 border-gold-600 rounded-t-full bg-transparent glow-gold-theater" />
              </div>
              
              {/* Гравировка */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-amber-950 text-xs font-display font-bold">
                СЕКРЕТ
              </div>
            </div>
            
            {/* Магический взрыв при открытии */}
            {isOpening && (
              <>
                <div className="absolute inset-0 bg-gold-400/60 rounded-3xl animate-ping glow-spotlight" />
                <div className="absolute -inset-4 bg-gold-300/40 rounded-full animate-pulse glow-spotlight" />
              </>
            )}
          </div>
        </div>

        {/* Эффект магического взрыва */}
        {showMagicExplosion && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            <div className="w-40 h-40 bg-gradient-gold-theater rounded-full animate-ping opacity-80 glow-spotlight" />
            <div className="absolute inset-0 w-40 h-40 bg-gold-300/50 rounded-full animate-pulse" />
            <div className="absolute -inset-8 w-56 h-56 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent rounded-full animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}