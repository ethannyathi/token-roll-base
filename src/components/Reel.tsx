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
  
  // Precise measurements for perfect alignment
  const CARD_HEIGHT = 70; // px
  const GAP = 8; // px (gap-2 = 0.5rem = 8px)
  const ITEM_HEIGHT = CARD_HEIGHT + GAP; // Total height per item
  const PADDING = 8; // px (p-2 = 0.5rem = 8px)
  const VISIBLE_ITEMS = 5;
  const CONTAINER_HEIGHT = (VISIBLE_ITEMS * ITEM_HEIGHT) - GAP + (PADDING * 2); // Precise container height

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setOffset((prev) => (prev + 1) % tokens.length);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpinning, tokens.length]);

  // Create infinite loop of tokens
  const displayTokens = [...tokens, ...tokens, ...tokens, ...tokens];

  return (
    <div 
      className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
      style={{ height: `${CONTAINER_HEIGHT}px` }}
    >
      {/* Highlight overlay for center token - Winner Line */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div 
          className="w-full border-y-2 border-primary bg-primary/10 animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          style={{ height: `${CARD_HEIGHT}px` }}
        >
          {/* Scanning line animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan"></div>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 p-2 w-full transition-transform"
        style={{
          transform: `translateY(${(CONTAINER_HEIGHT / 2) - (CARD_HEIGHT / 2) - PADDING - (ITEM_HEIGHT * 2) - (offset * ITEM_HEIGHT)}px)`,
          transitionDuration: isSpinning ? '100ms' : '500ms',
        }}
      >
        {displayTokens.map((token, index) => {
          const isHighlighted = highlightedIndex !== undefined && 
            Math.floor(offset + 2) % tokens.length === highlightedIndex;
          
          return (
            <div 
              key={`${token.id}-${index}`} 
              className="flex-shrink-0"
              style={{ height: `${CARD_HEIGHT}px` }}
            >
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
