import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Zap } from "lucide-react";
import { useXPBalance } from "@/hooks/useXPBalance";

interface BetControlsProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  onPlay: () => void;
  isPlaying: boolean;
  isCelebrating?: boolean;
}

export const BetControls = ({ betAmount, onBetChange, onPlay, isPlaying, isCelebrating = false }: BetControlsProps) => {
  const { xpBalance, hasEnoughXP } = useXPBalance();
  const betOptions = [10, 25, 50, 100, 250, 500]; // XP amounts

  const canAffordBet = hasEnoughXP(betAmount);

  return (
    <Card className="p-2 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="space-y-1.5">
        {/* Bet Amount Selector */}
        <div className="space-y-0.5">
          <label className="text-[10px] text-muted-foreground">Bet Amount (XP)</label>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onBetChange(Math.max(10, betAmount - 10))}
              disabled={isPlaying || betAmount <= 10}
              className="h-7 w-7 border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Minus className="h-2.5 w-2.5" />
            </Button>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                {betAmount} XP
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onBetChange(Math.min(xpBalance, betAmount + 10))}
              disabled={isPlaying || betAmount >= xpBalance}
              className="h-7 w-7 border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Plus className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>

        {/* Quick Bet Options */}
        <div className="grid grid-cols-3 gap-1">
          {betOptions.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => onBetChange(amount)}
              disabled={isPlaying || !hasEnoughXP(amount)}
              className={`h-7 text-[11px] border-primary/30 hover:border-primary hover:bg-primary/10 ${
                betAmount === amount ? "bg-primary/20 border-primary" : ""
              }`}
            >
              {amount} XP
            </Button>
          ))}
        </div>

        {/* Play Button */}
        <Button
          size="lg"
          className={`w-full h-10 transition-all duration-300 font-bold text-sm ${
            isCelebrating
              ? 'bg-success hover:bg-success/90 animate-pulse'
              : 'bg-gradient-primary hover:shadow-glow'
          }`}
          onClick={onPlay}
          disabled={isPlaying && !isCelebrating || !canAffordBet && !isCelebrating}
        >
          <Zap className="mr-1.5 h-3.5 w-3.5" />
          {isCelebrating 
            ? "🎉 Stop & Play Again" 
            : isPlaying 
            ? "Spinning..." 
            : !canAffordBet 
            ? "Insufficient XP" 
            : "Play & Match"}
        </Button>
      </div>
    </Card>
  );
};
