import { useState, useCallback, useEffect } from 'react';
import { UserXPState, XPTransaction } from '@/types/xp';
import { useAccount } from 'wagmi';

const STORAGE_KEY = 'user_xp_state';
const DEFAULT_USER_KEY = 'default_user'; // Fallback key when no wallet connected

// This is a simple local storage implementation
// In production, you'd want to use a backend API
export const useXPBalance = () => {
  const { address } = useAccount();
  // Use address if available, otherwise use default key
  const userKey = address || DEFAULT_USER_KEY;
  
  const [xpState, setXpState] = useState<UserXPState>({
    balance: 0,
    totalPurchased: 0,
    totalWon: 0,
    totalLost: 0,
    transactions: [],
  });

  // Load XP state from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY}_${userKey}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const loadedState = JSON.parse(saved);
        console.log('✅ Loaded XP state:', loadedState);
        setXpState(loadedState);
      } catch (e) {
        console.error('Failed to load XP state:', e);
      }
    } else {
      console.log('📦 No saved XP state found for:', userKey);
    }
  }, [userKey]);

  // Add XP (from purchase or win)
  const addXP = useCallback((amount: number, type: 'purchase' | 'win', txHash?: string) => {
    console.log(`💰 Adding ${amount} XP (${type}) for user:`, userKey);
    setXpState((prevState) => {
      const transaction: XPTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        userId: userKey,
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
      const storageKey = `${STORAGE_KEY}_${userKey}`;
      localStorage.setItem(storageKey, JSON.stringify(newState));
      console.log('✅ Saved XP state:', newState, 'to', storageKey);

      return newState;
    });
  }, [userKey]);

  // Deduct XP (from bet)
  const deductXP = useCallback((amount: number, type: 'bet' | 'cashout') => {
    setXpState((prevState) => {
      if (prevState.balance < amount) {
        throw new Error('Insufficient XP balance');
      }

      const transaction: XPTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        userId: userKey,
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
      const storageKey = `${STORAGE_KEY}_${userKey}`;
      localStorage.setItem(storageKey, JSON.stringify(newState));

      return newState;
    });
  }, [userKey]);

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
    
    const storageKey = `${STORAGE_KEY}_${userKey}`;
    localStorage.setItem(storageKey, JSON.stringify(newState));
  }, [userKey]);

  return {
    xpBalance: xpState.balance,
    xpState,
    addXP,
    deductXP,
    hasEnoughXP,
    resetXP,
  };
};
