export interface XPPackage {
  id: string;
  name: string;
  xpAmount: number;
  price: string; // in USDC
  currency: 'USDC' | 'ETH';
  bonus: number; // percentage bonus
  popular?: boolean;
}

export interface XPTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'bet' | 'win' | 'cashout';
  amount: number;
  timestamp: number;
  txHash?: string;
}

export interface UserXPState {
  balance: number;
  totalPurchased: number;
  totalWon: number;
  totalLost: number;
  transactions: XPTransaction[];
}
