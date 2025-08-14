import { useState, useEffect, useRef, useCallback } from 'react';
import { TreasureChest } from './TreasureChest';
import { MagicalKey } from './MagicalKey';
import { MagicalTicket } from './MagicalTicket';
import { ConfettiEffect } from './ConfettiEffect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Prize {
  id: string;
  label: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount?: number;
  weight: number;
}

const PRIZES: Prize[] = [
  {
    id: 'discount10',
    label: '10% скидка',
    description: 'Персональная скидка на билет',
    rarity: 'common',
    discount: 10,
    weight: 40
  },
  {
    id: 'discount15',
    label: '15% скидка',
    description: 'Персональная скидка на билет',
    rarity: 'rare',
    discount: 15,
    weight: 25
  },
  {
    id: 'discount25',
    label: '25% скидка',
    description: 'Персональная скидка на билет',
    rarity: 'epic',
    discount: 25,
    weight: 15
  },
  {
    id: 'discount50',
    label: '50% скидка',
    description: 'Персональная скидка на билет',
    rarity: 'epic',
    discount: 50,
    weight: 15
  },
  {
    id: 'free',
    label: 'Бесплатный билет',
    description: 'PLATINUM доступ к шоу',
    rarity: 'legendary',
    weight: 5
  }
];

const getKeyCount = () => {
  const width = window.innerWidth;
  if (width < 640) return 24; // mobile
  if (width < 1024) return 36; // tablet
  return 48; // desktop
};

const DAILY_ATTEMPTS = 3;

const getGameData = () => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('treasureGame');
  if (!stored) return { date: today, attempts: 0 };
  
  try {
    const data = JSON.parse(stored);
    if (data.date !== today) {
      return { date: today, attempts: 0 };
    }
    return data;
  } catch {
    return { date: today, attempts: 0 };
  }
};

const saveGameData = (attempts: number) => {
  const today = new Date().toDateString();
  localStorage.setItem('treasureGame', JSON.stringify({ date: today, attempts }));
};

export function TreasureGame() {
  const [keys, setKeys] = useState<Array<{ variant: 'common' | 'rare' | 'epic'; rotation: number }>>([]);
  const [isChestShaking, setIsChestShaking] = useState(false);
  const [isChestOpening, setIsChestOpening] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIntensity, setConfettiIntensity] = useState<'normal' | 'epic' | 'legendary'>('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(DAILY_ATTEMPTS);
  const [gameBlocked, setGameBlocked] = useState(false);
  
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);

  // Check attempts on mount
  useEffect(() => {
    const gameData = getGameData();
    const remaining = DAILY_ATTEMPTS - gameData.attempts;
    setAttemptsLeft(remaining);
    setGameBlocked(remaining <= 0);
  }, []);

  // Initialize keys
  useEffect(() => {
    const generateKeys = () => {
      const keyCount = getKeyCount();
      const newKeys = Array.from({ length: keyCount }, (_, index) => {
        let variant: 'common' | 'rare' | 'epic' = 'common';
        
        // 10% rare keys
        if (Math.random() < 0.1) variant = 'rare';
        // 5% epic keys  
        if (Math.random() < 0.05) variant = 'epic';
        
        return {
          variant,
          rotation: Math.random() * 20 - 10 // -10 to 10 degrees
        };
      });
      setKeys(newKeys);
    };

    generateKeys();
    
    const handleResize = () => generateKeys();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Audio setup
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.log('Audio not supported');
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || !audioContext.current) return;

    try {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + duration / 1000);
    } catch (e) {
      console.log('Audio playback failed');
    }
  }, [soundEnabled]);

  const choosePrize = useCallback((keyVariant: 'common' | 'rare' | 'epic') => {
    let weightedPrizes = [...PRIZES];
    
    // Boost chances for rare/epic keys
    if (keyVariant === 'rare') {
      weightedPrizes = weightedPrizes.map(prize => 
        prize.rarity !== 'common' ? { ...prize, weight: prize.weight * 1.5 } : prize
      );
    } else if (keyVariant === 'epic') {
      weightedPrizes = weightedPrizes.map(prize => 
        prize.rarity === 'epic' || prize.rarity === 'legendary' ? { ...prize, weight: prize.weight * 2 } : prize
      );
    }

    const totalWeight = weightedPrizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const prize of weightedPrizes) {
      random -= prize.weight;
      if (random <= 0) {
        return prize;
      }
    }
    
    return weightedPrizes[0];
  }, []);

  const handleKeyClick = useCallback((keyIndex: number) => {
    if (isChestShaking || isChestOpening || gameBlocked) return;

    // Use attempt
    const gameData = getGameData();
    const newAttempts = gameData.attempts + 1;
    saveGameData(newAttempts);
    
    const remaining = DAILY_ATTEMPTS - newAttempts;
    setAttemptsLeft(remaining);
    if (remaining <= 0) {
      setGameBlocked(true);
    }

    const keyVariant = keys[keyIndex]?.variant || 'common';
    
    // Play click sound
    playSound(800, 100, 'square');
    
    // Start chest animation
    setIsChestShaking(true);
    
    setTimeout(() => {
      setIsChestShaking(false);
      setIsChestOpening(true);
      
      // Play opening sound
      playSound(1200, 300, 'triangle');
      
      // Choose prize
      const prize = choosePrize(keyVariant);
      setCurrentPrize(prize);
      
      // Set confetti intensity
      let intensity: 'normal' | 'epic' | 'legendary' = 'normal';
      if (prize.rarity === 'legendary') intensity = 'legendary';
      else if (prize.rarity === 'epic') intensity = 'epic';
      
      setConfettiIntensity(intensity);
      
      setTimeout(() => {
        setShowModal(true);
        setShowConfetti(true);
        
        // Play prize sound
        if (prize.rarity === 'legendary') {
          playSound(1500, 500, 'sine');
        } else if (prize.rarity === 'epic') {
          playSound(1200, 400, 'sine');
        } else {
          playSound(800, 200, 'sine');
        }
      }, 600);
    }, 600);
  }, [keys, isChestShaking, isChestOpening, choosePrize, playSound]);

  const handleChestAnimationComplete = useCallback(() => {
    setIsChestOpening(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setShowConfetti(false);
    setCurrentPrize(null);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gold-400 tracking-wider mb-2">
              ШОУ • СЕКРЕТ
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-magical mb-4">
              Сундук удачи
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите магический ключ и откройте сундук, чтобы получить скидку или бесплатный билет на самое загадочное шоу года
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Chest Section */}
          <div className="panel-magical p-6">
            <TreasureChest 
              isShaking={isChestShaking}
              isOpening={isChestOpening}
              onAnimationComplete={handleChestAnimationComplete}
            />
          </div>

          {/* Rules and Controls */}
          <div className="space-y-6">
            <div className="panel-magical p-6">
              <h2 className="text-2xl font-display font-bold text-gold-400 mb-4">
                Правила игры
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>• Выберите любой ключ из магической коллекции</p>
                <p>• Каждый ключ открывает сундук с уникальным призом</p>
                <p>• Редкие ключи ★ дают больше шансов на крупные призы</p>
                <p>• Эпические ключи ◆ практически гарантируют отличный приз</p>
                <p>• У вас есть 3 попытки в день</p>
                <p>• Сделайте скриншот купона и пришлите в группу "Шоу Секрет"</p>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <div className={cn(
                  "px-3 py-2 border rounded-lg text-sm",
                  attemptsLeft > 0 
                    ? "bg-gold-500/10 border-gold-500/30" 
                    : "bg-red-500/10 border-red-500/30"
                )}>
                  Попыток осталось: {attemptsLeft}
                </div>
                <div className="px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm">
                  Редких ключей: {keys.filter(k => k.variant !== 'common').length}
                </div>
              </div>
              
              {gameBlocked && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-center text-red-400 font-semibold">
                    🔒 Попытки на сегодня исчерпаны
                  </p>
                  <p className="text-center text-sm text-muted-foreground mt-1">
                    Возвращайтесь завтра за новыми призами!
                  </p>
                </div>
              )}

              {/* Sound Toggle */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Звук:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "transition-colors",
                    soundEnabled ? "bg-gold-500/20 border-gold-500/50" : "bg-muted/20"
                  )}
                >
                  {soundEnabled ? "🔊 Вкл" : "🔇 Выкл"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Keys Grid */}
        <div className="mt-12">
          <div className="panel-magical p-6">
            <h3 className="text-xl font-display font-bold text-gold-400 mb-6 text-center">
              Выберите магический ключ
            </h3>
            <div className={cn(
              "grid gap-4 justify-items-center",
              "grid-cols-6 sm:grid-cols-8 lg:grid-cols-12",
              "max-w-5xl mx-auto",
              gameBlocked && "opacity-50 pointer-events-none"
            )}>
              {keys.map((key, index) => (
                <MagicalKey
                  key={index}
                  variant={key.variant}
                  rotation={key.rotation}
                  index={index}
                  onClick={() => handleKeyClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prize Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-4xl bg-gradient-to-b from-card to-panel border-gold-500/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display font-bold text-center text-magical mb-4">
              🎉 Поздравляем! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {currentPrize && (
              <MagicalTicket prize={currentPrize} />
            )}
            
            <div className="text-center text-muted-foreground text-sm mt-4">
              Сделайте скриншот этого купона и пришлите нам в группу <span className="text-gold-400 font-semibold">"Шоу Секрет"</span>
            </div>
            
            {attemptsLeft > 0 && (
              <div className="text-center">
                <Button 
                  onClick={handleCloseModal}
                  className="bg-gold-500 hover:bg-gold-600 text-black font-bold"
                >
                  Попробовать еще ({attemptsLeft} попыток)
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confetti Effect */}
      <ConfettiEffect 
        active={showConfetti} 
        intensity={confettiIntensity}
        duration={3000}
      />
    </div>
  );
}