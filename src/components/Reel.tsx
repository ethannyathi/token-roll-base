import { Token, TokenCard } from "./TokenCard";
import { useEffect, useState } from "react";

interface ReelProps {
  tokens: Token[];
  isSpinning: boolean;
  highlightedIndex?: number;
  isWinning?: boolean;
  isJackpot?: boolean;
}

export const Reel = ({ tokens, isSpinning, highlightedIndex, isWinning, isJackpot }: ReelProps) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setOffset((prev) => (prev + 1) % tokens.length);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpinning, tokens.length]);

  // Create infinite loop of tokens
  const displayTokens = [...tokens, ...tokens, ...tokens];

  return (
    <div className="relative h-[400px] overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
      {/* Highlight overlay for center token */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 border-y-2 border-primary/30 bg-primary/5"></div>
      </div>

      <div
        className={`flex flex-col gap-3 p-3 transition-transform ${
          isSpinning ? "duration-100" : "duration-500"
        }`}
        style={{
          transform: `translateY(-${offset * 96}px)`,
        }}
      >
        {displayTokens.map((token, index) => {
          const isHighlighted = highlightedIndex !== undefined && 
            Math.floor(offset + 2) % tokens.length === highlightedIndex;
          
          return (
            <div key={`${token.id}-${index}`} className="h-20 flex-shrink-0">
              <TokenCard 
                token={token} 
                isWinning={isHighlighted && isWinning}
                isJackpot={isHighlighted && isJackpot}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
