import { useState, useCallback, useEffect, useRef } from 'react';
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
  const userKeyRef = useRef(userKey);
  
  // Update ref when userKey changes
  useEffect(() => {
    userKeyRef.current = userKey;
  }, [userKey]);
  
  const [xpState, setXpState] = useState<UserXPState>({
    balance: 0,
    totalPurchased: 0,
    totalWon: 0,
    totalLost: 0,
    transactions: [],
  });
  
  // Force re-render counter
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Load XP state from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY}_${userKey}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const loadedState = JSON.parse(saved);
        console.log('✅ Loaded XP state:', loadedState, 'for key:', storageKey);
        setXpState(loadedState);
      } catch (e) {
        console.error('Failed to load XP state:', e);
      }
    } else {
      console.log('📦 No saved XP state found for:', userKey);
      // Reset to default state if no saved data
      setXpState({
        balance: 0,
        totalPurchased: 0,
        totalWon: 0,
        totalLost: 0,
        transactions: [],
      });
    }
  }, [userKey, updateTrigger]);

  // Add XP (from purchase or win)
  const addXP = useCallback((amount: number, type: 'purchase' | 'win', txHash?: string) => {
    const currentUserKey = userKeyRef.current;
    console.log(`💰 Adding ${amount} XP (${type}) for user:`, currentUserKey);
    
    setXpState((prevState) => {
      const transaction: XPTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        userId: currentUserKey,
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
      const storageKey = `${STORAGE_KEY}_${currentUserKey}`;
      localStorage.setItem(storageKey, JSON.stringify(newState));
      console.log('✅ Saved XP state:', newState, 'to', storageKey);
      console.log('✅ New balance:', newState.balance);

      return newState;
    });
    
    // Force re-render to ensure UI updates
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Deduct XP (from bet)
  const deductXP = useCallback((amount: number, type: 'bet' | 'cashout') => {
    const currentUserKey = userKeyRef.current;
    
    setXpState((prevState) => {
      if (prevState.balance < amount) {
        throw new Error('Insufficient XP balance');
      }

      const transaction: XPTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        userId: currentUserKey,
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
      const storageKey = `${STORAGE_KEY}_${currentUserKey}`;
      localStorage.setItem(storageKey, JSON.stringify(newState));

      return newState;
    });
    
    // Force re-render
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Check if user has enough XP
  const hasEnoughXP = useCallback((amount: number) => {
    return xpState.balance >= amount;
  }, [xpState.balance]);

  // Reset XP (for testing)
  const resetXP = useCallback(() => {
    const currentUserKey = userKeyRef.current;
    const newState: UserXPState = {
      balance: 0,
      totalPurchased: 0,
      totalWon: 0,
      totalLost: 0,
      transactions: [],
    };
    
    setXpState(newState);
    
    const storageKey = `${STORAGE_KEY}_${currentUserKey}`;
    localStorage.setItem(storageKey, JSON.stringify(newState));
    
    // Force re-render
    setUpdateTrigger(prev => prev + 1);
  }, []);

  return {
    xpBalance: xpState.balance,
    xpState,
    addXP,
    deductXP,
    hasEnoughXP,
    resetXP,
  };
};
