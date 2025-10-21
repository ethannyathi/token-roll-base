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
      className={`p-3 bg-gradient-card border-border/50 backdrop-blur-sm transition-all duration-300 ${
        isJackpot
          ? "shadow-jackpot border-jackpot/50 animate-pulse-glow"
          : isWinning
          ? "shadow-glow border-success/50"
          : "hover:border-primary/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary p-0.5 flex-shrink-0">
          <div className="w-full h-full rounded-xl bg-card flex items-center justify-center text-2xl">
            {token.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground truncate">{token.symbol}</h3>
            <Badge variant="outline" className={`${typeColors[token.type]} text-xs`}>
              {token.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate mb-1">{token.name}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-success font-semibold">${token.price.toFixed(4)}</span>
            <span className="text-muted-foreground">
              ${(token.marketCap / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-muted-foreground">TLVL</span>
            <span className="text-xs font-bold text-primary">{token.tlvl}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
