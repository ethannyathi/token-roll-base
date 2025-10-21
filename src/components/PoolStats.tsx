import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Repeat, Coins } from "lucide-react";

interface PoolStatsProps {
  totalPool: number;
  totalWinners: number;
  totalBuyback: number;
  platformFee: number;
}

export const PoolStats = ({ totalPool, totalWinners, totalBuyback, platformFee }: PoolStatsProps) => {
  const stats = [
    {
      label: "Total Pool",
      value: `$${totalPool.toFixed(2)}`,
      icon: Coins,
      color: "text-primary",
    },
    {
      label: "Winners (60%)",
      value: `$${totalWinners.toFixed(2)}`,
      icon: Users,
      color: "text-success",
    },
    {
      label: "Buyback (30%)",
      value: `$${totalBuyback.toFixed(2)}`,
      icon: Repeat,
      color: "text-secondary",
    },
    {
      label: "Platform (10%)",
      value: `$${platformFee.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="p-3 bg-gradient-card border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-2">
              <div className={`${stat.color} mt-0.5`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                <p className={`font-bold text-sm ${stat.color} truncate`}>{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
