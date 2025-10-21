import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reel } from "@/components/Reel";
import { BetControls } from "@/components/BetControls";
import { PoolStats } from "@/components/PoolStats";
import { mockTokens } from "@/data/mockTokens";
import { Wallet, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [betAmount, setBetAmount] = useState(0.1);
  const [balance, setBalance] = useState(10.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalPool, setTotalPool] = useState(1234.56);
  const [reelStates, setReelStates] = useState([false, false, false]);
  const [winningIndices, setWinningIndices] = useState<number[]>([]);
  const [isWinning, setIsWinning] = useState(false);
  const [isJackpot, setIsJackpot] = useState(false);

  const handlePlay = async () => {
    if (betAmount > balance) {
      toast.error("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setBalance((prev) => prev - betAmount);
    setTotalPool((prev) => prev + betAmount);
    setIsWinning(false);
    setIsJackpot(false);

    // Start all reels spinning
    setReelStates([true, true, true]);

    // Stop reels sequentially
    const delays = [1500, 2000, 2500];
    const results: number[] = [];

    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, delays[i]));
      const randomIndex = Math.floor(Math.random() * mockTokens.length);
      results.push(randomIndex);
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

      // Check for jackpot (all top 3 market cap tokens)
      if (token1.rank && token2.rank && token3.rank && 
          token1.rank <= 3 && token2.rank <= 3 && token3.rank <= 3) {
        setIsJackpot(true);
        const jackpotWin = betAmount * 100;
        setBalance((prev) => prev + jackpotWin);
        toast.success(`🎰 JACKPOT! You won $${jackpotWin.toFixed(2)}!`, {
          duration: 5000,
        });
      }
      // Check for type match
      else if (token1.type === token2.type && token2.type === token3.type) {
        setIsWinning(true);
        const winAmount = betAmount * 10;
        setBalance((prev) => prev + winAmount);
        toast.success(`🎉 Winner! You won $${winAmount.toFixed(2)}!`, {
          duration: 4000,
        });
      } else {
        toast.error("No match. Try again!");
      }

      setIsPlaying(false);
    }, 3000);
  };

  const totalWinners = totalPool * 0.6;
  const totalBuyback = totalPool * 0.3;
  const platformFee = totalPool * 0.1;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl">
                🎰
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Base Slots
                </h1>
                <p className="text-xs text-muted-foreground">Win Real Crypto</p>
              </div>
            </div>
            <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Match & Win Crypto
            </h2>
            <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground mb-4">
            Spin the reels and match Base tokens to win real payouts
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-success/20 text-success border-success/30">
              Match 3 same type → 10x
            </Badge>
            <Badge variant="outline" className="bg-jackpot/20 text-jackpot border-jackpot/30">
              Top 3 market cap → 100x
            </Badge>
          </div>
        </Card>
      </section>

      {/* Reels Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
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
      <section className="container mx-auto px-4 mb-6">
        <PoolStats
          totalPool={totalPool}
          totalWinners={totalWinners}
          totalBuyback={totalBuyback}
          platformFee={platformFee}
        />
      </section>

      {/* Leaderboard Preview */}
      <section className="container mx-auto px-4 mb-6">
        <Card className="p-4 bg-gradient-card border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-jackpot" />
            <h3 className="font-bold text-foreground">Top Winners Today</h3>
          </div>
          <div className="space-y-2">
            {[
              { address: "0x7a3f...b2c1", amount: 128.45, token: "🐱" },
              { address: "0x9e4d...a8f3", amount: 95.12, token: "🌙" },
              { address: "0x2c1b...d5e7", amount: 73.89, token: "🐶" },
            ].map((winner, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{winner.token}</span>
                  <span className="text-sm text-muted-foreground">{winner.address}</span>
                </div>
                <span className="text-sm font-bold text-success">${winner.amount}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 z-50">
        <div className="container mx-auto px-4 py-4">
          <BetControls
            betAmount={betAmount}
            onBetChange={setBetAmount}
            onPlay={handlePlay}
            isPlaying={isPlaying}
            balance={balance}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
