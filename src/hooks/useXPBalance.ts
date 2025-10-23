import { useState, useCallback, useEffect } from 'react';
import { UserXPState, XPTransaction } from '@/types/xp';
import { useAccount } from 'wagmi';

const STORAGE_KEY = 'user_xp_state';

// This is a simple local storage implementation
// In production, you'd want to use a backend API
export const useXPBalance = () => {
  const { address } = useAccount();
  const [xpState, setXpState] = useState<UserXPState>({
    balance: 0,
    totalPurchased: 0,
    totalWon: 0,
    totalLost: 0,
    transactions: [],
  });

  // Load XP state from localStorage
  useEffect(() => {
    if (address) {
      const storageKey = `${STORAGE_KEY}_${address}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setXpState(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load XP state:', e);
        }
      }
    }
  }, [address]);

  // Add XP (from purchase or win)
  const addXP = useCallback((amount: number, type: 'purchase' | 'win', txHash?: string) => {
    setXpState((prevState) => {
      const transaction: XPTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        userId: address || 'unknown',
        type,
        amount,
        timestamp: Date.now(),
        txHash,
      };

      const newState: UserXPState = {
        ...prevState,
        balance: prevState.balance + amount,
        totalPurchased: type === 'purchase' ? prevState.totalPurchased + amount : prevState.totalPurchased,
        totalWon: type === 'win' ? prevState.totalWon + amount : prevState.totalWon,
        transactions: [transaction, ...prevState.transactions].slice(0, 100), // Keep last 100
      };

      // Save to localStorage
      if (address) {
        const storageKey = `${STORAGE_KEY}_${address}`;
        localStorage.setItem(storageKey, JSON.stringify(newState));
      }

      return newState;
    });
  }, [address]);

  // Deduct XP (from bet)
  const deductXP = useCallback((amount: number, type: 'bet' | 'cashout') => {
    setXpState((prevState) => {
      if (prevState.balance < amount) {
        throw new Error('Insufficient XP balance');
      }

      const transaction: XPTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        userId: address || 'unknown',
        type,
        amount: -amount,
        timestamp: Date.now(),
      };

      const newState: UserXPState = {
        ...prevState,
        balance: prevState.balance - amount,
        totalLost: type === 'bet' ? prevState.totalLost + amount : prevState.totalLost,
        transactions: [transaction, ...prevState.transactions].slice(0, 100),
      };

      // Save to localStorage
      if (address) {
        const storageKey = `${STORAGE_KEY}_${address}`;
        localStorage.setItem(storageKey, JSON.stringify(newState));
      }

      return newState;
    });
  }, [address]);

  // Check if user has enough XP
  const hasEnoughXP = useCallback((amount: number) => {
    return xpState.balance >= amount;
  }, [xpState.balance]);

  // Reset XP (for testing)
  const resetXP = useCallback(() => {
    const newState: UserXPState = {
      balance: 0,
      totalPurchased: 0,
      totalWon: 0,
      totalLost: 0,
      transactions: [],
    };
    
    setXpState(newState);
    
    if (address) {
      const storageKey = `${STORAGE_KEY}_${address}`;
      localStorage.setItem(storageKey, JSON.stringify(newState));
    }
  }, [address]);

  return {
    xpBalance: xpState.balance,
    xpState,
    addXP,
    deductXP,
    hasEnoughXP,
    resetXP,
  };
};
