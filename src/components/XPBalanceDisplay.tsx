import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useXPBalance } from "@/hooks/useXPBalance";
import { xpToUSD } from "@/constants/xp";
import { Coins, TrendingUp, TrendingDown, Award } from "lucide-react";

export const XPBalanceDisplay = () => {
  const { xpBalance, xpState } = useXPBalance();
  const usdValue = xpToUSD(xpBalance);

  return (
    <Card className="p-3 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold">Your XP Balance</h3>
          </div>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0.5">
            Off-Chain
          </Badge>
        </div>

        <div className="space-y-0.5">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {xpBalance.toLocaleString()} XP
          </div>
          <div className="text-xs text-muted-foreground">
            ≈ ${usdValue.toFixed(2)} USD
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/50">
          <div className="text-center">
            <div className="flex flex-col items-center gap-0.5">
              <Award className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Bought</span>
            </div>
            <div className="text-xs font-bold text-foreground mt-0.5">
              {xpState.totalPurchased.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center gap-0.5">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-[10px] text-muted-foreground">Won</span>
            </div>
            <div className="text-xs font-bold text-success mt-0.5">
              {xpState.totalWon.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex flex-col items-center gap-0.5">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span className="text-[10px] text-muted-foreground">Lost</span>
            </div>
            <div className="text-xs font-bold text-destructive mt-0.5">
              {xpState.totalLost.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
