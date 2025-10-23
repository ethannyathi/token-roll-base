import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reel } from "@/components/Reel";
import { BetControls } from "@/components/BetControls";
import { PoolStats } from "@/components/PoolStats";
import { DirectWalletConnect } from "@/components/DirectWalletConnect";
import { NetworkSwitcher } from "@/components/NetworkSwitcher";
import { XPStore } from "@/components/XPStore";
import { mockTokens } from "@/data/mockTokens";
import { NETWORKS, NetworkId } from "@/constants/networks";
import { Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useAccount } from "wagmi";
import { useXPBalance } from "@/hooks/useXPBalance";

const Index = () => {
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalPool, setTotalPool] = useState(1234.56);
  const [reelStates, setReelStates] = useState([false, false, false]);
  const [winningIndices, setWinningIndices] = useState<number[]>([]);
  const [isWinning, setIsWinning] = useState(false);
  const [isJackpot, setIsJackpot] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationTimer, setCelebrationTimer] = useState<NodeJS.Timeout | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<NetworkId>(NETWORKS.BASE_SEPOLIA.id);
  
  const { playSpinSound, playReelStopSound, playWinSound, playJackpotSound } = useSoundEffects();
  const { isConnected } = useAccount();
  const { xpBalance, deductXP, addXP, hasEnoughXP } = useXPBalance();

  const handlePlay = async () => {
    // If celebrating, stop celebration and allow immediate replay
    if (isCelebrating) {
      if (celebrationTimer) {
        clearTimeout(celebrationTimer);
        setCelebrationTimer(null);
      }
      setIsCelebrating(false);
      setIsWinning(false);
      setIsJackpot(false);
      return;
    }

    if (!hasEnoughXP(betAmount)) {
      toast.error("Insufficient XP! Buy more to continue playing.");
      return;
    }

    setIsPlaying(true);
    
    // Deduct XP for the bet
    try {
      deductXP(betAmount, 'bet');
    } catch (error) {
      toast.error("Failed to place bet");
      setIsPlaying(false);
      return;
    }
    
    setTotalPool((prev) => prev + betAmount);
    setIsWinning(false);
    setIsJackpot(false);
    setIsCelebrating(false);

    // Play spin sound
    playSpinSound();

    // Start all reels spinning
    setReelStates([true, true, true]);

    // Stop reels sequentially
    const delays = [1500, 2000, 2500];
    const results: number[] = [];

    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, delays[i]));
      const randomIndex = Math.floor(Math.random() * mockTokens.length);
      results.push(randomIndex);
      playReelStopSound(); // Play stop sound for each reel
      setReelStates((prev) => {
        const newState = [...prev];
        newState[i] = false;
        return newState;
      });
    }

    setWinningIndices(results);

    // Check for win condition
    setTimeout(() => {
      const token1 = mockTokens[results[0]];
      const token2 = mockTokens[results[1]];
      const token3 = mockTokens[results[2]];

      let didWin = false;

      // Check for jackpot (all top 3 market cap tokens)
      if (token1.rank && token2.rank && token3.rank && 
          token1.rank <= 3 && token2.rank <= 3 && token3.rank <= 3) {
        setIsJackpot(true);
        didWin = true;
        playJackpotSound(); // Play jackpot sound
        const jackpotWin = betAmount * 100;
        addXP(jackpotWin, 'win');
        toast.success(`🎰 JACKPOT! You won ${jackpotWin.toLocaleString()} XP!`, {
          duration: 5000,
        });
      }
      // Check for type match
      else if (token1.type === token2.type && token2.type === token3.type) {
        setIsWinning(true);
        didWin = true;
        playWinSound(); // Play win sound
        const winAmount = betAmount * 10;
        addXP(winAmount, 'win');
        toast.success(`🎉 Winner! You won ${winAmount.toLocaleString()} XP!`, {
          duration: 4000,
        });
      } else {
        toast.error("No match. Try again!");
      }

      // Start celebration if won
      if (didWin) {
        setIsCelebrating(true);
        // Auto-stop celebration after 3 seconds
        const timer = setTimeout(() => {
          setIsCelebrating(false);
          setIsWinning(false);
          setIsJackpot(false);
        }, 3000);
        setCelebrationTimer(timer);
      }

      setIsPlaying(false);
    }, 3000);
  };

  const totalWinners = totalPool * 0.6;
  const totalBuyback = totalPool * 0.3;
  const platformFee = totalPool * 0.1;

  return (
    <div className="min-h-screen bg-background pb-40 max-w-md mx-auto relative">
      {/* Celebration Overlay */}
      {isCelebrating && (
        <div className="fixed inset-0 z-[60] pointer-events-none max-w-md mx-auto">
          {/* Confetti particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              <div
                className={`w-2 h-2 ${
                  isJackpot
                    ? 'bg-gradient-jackpot'
                    : i % 4 === 0
                    ? 'bg-primary'
                    : i % 4 === 1
                    ? 'bg-success'
                    : i % 4 === 2
                    ? 'bg-accent'
                    : 'bg-secondary'
                } rounded-full`}
                style={{
                  boxShadow: isJackpot ? 'var(--shadow-jackpot)' : 'var(--shadow-glow)',
                }}
              />
            </div>
          ))}
          
          {/* Celebration message */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`text-6xl animate-celebrate ${isJackpot ? 'animate-rainbow' : ''}`}>
              {isJackpot ? '🎰💰🎉' : '🎉✨🎊'}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50 bg-background/80">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-lg">
                🎰
              </div>
              <div>
                <h1 className="text-sm font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                  Base Slots
                </h1>
                <p className="text-[9px] text-muted-foreground">Win Real Crypto</p>
              </div>
            </div>
            
            {/* XP Balance - Center */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-card border border-primary/30 flex-shrink-0">
              <Sparkles className="h-3 w-3 text-primary animate-pulse-glow" />
              <span className="text-sm font-bold bg-gradient-primary bg-clip-text text-transparent whitespace-nowrap">
                {xpBalance.toLocaleString()}
              </span>
            </div>
            
            <div className="flex-shrink-0">
              <DirectWalletConnect />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-between">
            <NetworkSwitcher 
              currentNetwork={currentNetwork}
              onNetworkChange={setCurrentNetwork}
              disabled={isPlaying}
            />
            <XPStore />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-3 py-4">
        <Card className="p-4 bg-gradient-card border-border/50 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
            <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              Buy XP & Play Instantly
            </h2>
            <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Purchase XP with crypto, bet instantly with no gas fees!
          </p>
          <div className="flex flex-col gap-1.5">
            <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-xs">
              Match 3 same type → 10x XP
            </Badge>
            <Badge variant="outline" className="bg-jackpot/20 text-jackpot border-jackpot/30 text-xs">
              Top 3 market cap → 100x XP
            </Badge>
          </div>
        </Card>
      </section>

      {/* Reels Section */}
      <section className="px-3">
        <div className="grid grid-cols-3 gap-2 mb-4 items-center">
          {[0, 1, 2].map((reelIndex) => (
            <Reel
              key={reelIndex}
              tokens={mockTokens}
              isSpinning={reelStates[reelIndex]}
              highlightedIndex={winningIndices[reelIndex]}
              isWinning={isWinning}
              isJackpot={isJackpot}
            />
          ))}
        </div>
      </section>

      {/* Pool Stats */}
      <section className="px-3 mb-4">
        <PoolStats
          totalPool={totalPool}
          totalWinners={totalWinners}
          totalBuyback={totalBuyback}
          platformFee={platformFee}
        />
      </section>

      {/* Leaderboard Preview */}
      <section className="px-3 mb-4">
        <Card className="p-3 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-jackpot" />
            <h3 className="text-sm font-bold text-foreground">Top Winners</h3>
          </div>
          <div className="space-y-1.5">
            {[
              { address: "0x7a3f...b2c1", amount: 12845, token: "🐱" },
              { address: "0x9e4d...a8f3", amount: 9512, token: "🌙" },
              { address: "0x2c1b...d5e7", amount: 7389, token: "🐶" },
            ].map((winner, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{winner.token}</span>
                  <span className="text-xs text-muted-foreground">{winner.address}</span>
                </div>
                <span className="text-xs font-bold text-success">{winner.amount} XP</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 z-50 max-w-md mx-auto">
        <div className="px-3 py-2">
          <BetControls
            betAmount={betAmount}
            onBetChange={setBetAmount}
            onPlay={handlePlay}
            isPlaying={isPlaying}
            isCelebrating={isCelebrating}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
