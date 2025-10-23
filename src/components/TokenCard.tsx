import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  marketCap: number;
  type: "cat" | "dog" | "meme" | "defi" | "nft";
  tlvl: number;
  rank?: number;
}

interface TokenCardProps {
  token: Token;
  isWinning?: boolean;
  isJackpot?: boolean;
}

export const TokenCard = ({ token, isWinning, isJackpot }: TokenCardProps) => {
  const typeColors = {
    cat: "bg-accent/20 text-accent",
    dog: "bg-secondary/20 text-secondary",
    meme: "bg-primary/20 text-primary",
    defi: "bg-success/20 text-success",
    nft: "bg-warning/20 text-warning",
  };

  return (
    <Card
      className={`p-2 bg-gradient-card border-border/50 backdrop-blur-sm transition-all duration-300 h-full ${
        isJackpot
          ? "shadow-jackpot border-jackpot/50 animate-pulse-glow"
          : isWinning
          ? "shadow-glow border-success/50"
          : "hover:border-primary/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary p-0.5 flex-shrink-0">
          <div className="w-full h-full rounded-lg bg-card flex items-center justify-center text-xl">
            {token.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <h3 className="font-bold text-sm text-foreground truncate">{token.symbol}</h3>
            <Badge variant="outline" className={`${typeColors[token.type]} text-[9px] px-1 py-0`}>
              {token.type}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground truncate mb-0.5">{token.name}</p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-success font-semibold">${token.price.toFixed(4)}</span>
            <span className="text-muted-foreground">
              ${(token.marketCap / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
