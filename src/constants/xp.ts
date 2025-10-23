import { XPPackage } from '@/types/xp';

export const XP_PACKAGES: XPPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    xpAmount: 500,
    price: '5',
    currency: 'USDC',
    bonus: 0,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    xpAmount: 1100,
    price: '10',
    currency: 'USDC',
    bonus: 10,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    xpAmount: 3000,
    price: '25',
    currency: 'USDC',
    bonus: 20,
  },
  {
    id: 'whale',
    name: 'Whale Pack',
    xpAmount: 7500,
    price: '50',
    currency: 'USDC',
    bonus: 50,
  },
];

// XP to USD conversion rate (100 XP = $1)
export const XP_TO_USD_RATE = 100;

// Minimum cashout amount
export const MIN_CASHOUT_XP = 1000; // $10 minimum

// Cashout fee (house edge)
export const CASHOUT_FEE_PERCENT = 10;

// Helper functions
export const xpToUSD = (xp: number): number => {
  return xp / XP_TO_USD_RATE;
};

export const usdToXP = (usd: number): number => {
  return usd * XP_TO_USD_RATE;
};

export const calculateCashoutAmount = (xp: number): number => {
  const usdValue = xpToUSD(xp);
  const fee = usdValue * (CASHOUT_FEE_PERCENT / 100);
  return usdValue - fee;
};
