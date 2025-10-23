import { useState, useCallback, useMemo } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { SubAccount } from '@/types/wallet';
import { NetworkId } from '@/constants/networks';

export const useSubAccount = (chainId: NetworkId) => {
  const { wallets } = useWallets();
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [activeSubAccount, setActiveSubAccount] = useState<SubAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the Base Account wallet
  const baseAccount = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === 'base_account');
  }, [wallets]);

  // Get existing Sub Accounts
  const getSubAccounts = useCallback(async () => {
    if (!baseAccount) {
      setError('Base Account not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Switch to the correct network
      await baseAccount.switchChain(chainId);
      const provider = await baseAccount.getEthereumProvider();

      // Get existing Sub Accounts for this domain
      const response = await provider.request({
        method: 'wallet_getSubAccounts',
        params: [{
          account: baseAccount.address,
          domain: window.location.origin
        }]
      });

      const { subAccounts: existingSubAccounts } = response as { subAccounts: SubAccount[] };
      setSubAccounts(existingSubAccounts || []);
      
      // If we have sub accounts but no active one, set the first as active
      if (existingSubAccounts && existingSubAccounts.length > 0 && !activeSubAccount) {
        setActiveSubAccount(existingSubAccounts[0]);
      }

      return existingSubAccounts || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get Sub Accounts';
      setError(errorMessage);
      console.error('Error getting Sub Accounts:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseAccount, chainId, activeSubAccount]);

  // Create a new Sub Account
  const createSubAccount = useCallback(async () => {
    if (!baseAccount) {
      setError('Base Account not found');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Switch to the correct network
      await baseAccount.switchChain(chainId);
      const provider = await baseAccount.getEthereumProvider();

      // Create new Sub Account
      await provider.request({
        method: 'wallet_addSubAccount',
        params: [{
          version: '1',
          account: {
            type: 'create',
            keys: [{
              type: 'address',
              publicKey: baseAccount.address
            }]
          }
        }]
      });

      // Refresh the Sub Accounts list
      const updatedSubAccounts = await getSubAccounts();
      
      // Set the newly created sub account as active
      if (updatedSubAccounts && updatedSubAccounts.length > 0) {
        const newSubAccount = updatedSubAccounts[updatedSubAccounts.length - 1];
        setActiveSubAccount(newSubAccount);
        return newSubAccount;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create Sub Account';
      setError(errorMessage);
      console.error('Error creating Sub Account:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [baseAccount, chainId, getSubAccounts]);

  // Send transaction using Sub Account (no popup!)
  const sendTransaction = useCallback(async (tx: {
    to: string;
    value?: string;
    data?: string;
  }) => {
    if (!baseAccount || !activeSubAccount) {
      setError('No active Sub Account');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      await baseAccount.switchChain(chainId);
      const provider = await baseAccount.getEthereumProvider();

      // Send transaction from Sub Account - no wallet popup!
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: activeSubAccount.address,
          to: tx.to,
          value: tx.value || '0x0',
          data: tx.data || '0x',
        }]
      });

      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      console.error('Error sending transaction:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [baseAccount, activeSubAccount, chainId]);

  return {
    baseAccount,
    subAccounts,
    activeSubAccount,
    isLoading,
    error,
    getSubAccounts,
    createSubAccount,
    setActiveSubAccount,
    sendTransaction,
  };
};
