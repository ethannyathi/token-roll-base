import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Zap } from "lucide-react";

interface BetControlsProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  onPlay: () => void;
  isPlaying: boolean;
  balance: number;
}

export const BetControls = ({ betAmount, onBetChange, onPlay, isPlaying, balance }: BetControlsProps) => {
  const betOptions = [0.01, 0.05, 0.1, 0.5, 1, 5];

  return (
    <Card className="p-4 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Balance Display */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="text-lg font-bold text-foreground">${balance.toFixed(2)}</span>
        </div>

        {/* Bet Amount Selector */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Bet Amount</label>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onBetChange(Math.max(0.01, betAmount - 0.01))}
              disabled={isPlaying || betAmount <= 0.01}
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ${betAmount.toFixed(2)}
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => onBetChange(Math.min(balance, betAmount + 0.01))}
              disabled={isPlaying || betAmount >= balance}
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Bet Options */}
        <div className="grid grid-cols-3 gap-2">
          {betOptions.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => onBetChange(amount)}
              disabled={isPlaying || amount > balance}
              className={`border-primary/30 hover:border-primary hover:bg-primary/10 ${
                betAmount === amount ? "bg-primary/20 border-primary" : ""
              }`}
            >
              ${amount}
            </Button>
          ))}
        </div>

        {/* Play Button */}
        <Button
          size="lg"
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-bold text-lg"
          onClick={onPlay}
          disabled={isPlaying || betAmount > balance}
        >
          <Zap className="mr-2 h-5 w-5" />
          {isPlaying ? "Spinning..." : "Play & Match"}
        </Button>
      </div>
    </Card>
  );
};
