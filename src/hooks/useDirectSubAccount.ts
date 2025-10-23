import { useState, useCallback } from 'react';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';
import { SubAccount } from '@/types/wallet';
import { NetworkId } from '@/constants/networks';

export const useDirectSubAccount = (chainId: NetworkId) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [activeSubAccount, setActiveSubAccount] = useState<SubAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get existing Sub Accounts
  const getSubAccounts = useCallback(async () => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      // Switch to the correct network
      if (walletClient.chain.id !== chainId) {
        await switchChain({ chainId });
      }

      // Get the provider from wallet client
      const provider = walletClient.transport;

      // Get existing Sub Accounts for this domain
      const response = await walletClient.request({
        method: 'wallet_getSubAccounts',
        params: [{
          account: address,
          domain: window.location.origin
        }]
      } as any);

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
  }, [address, walletClient, chainId, switchChain, activeSubAccount]);

  // Create a new Sub Account
  const createSubAccount = useCallback(async () => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Switch to the correct network
      if (walletClient.chain.id !== chainId) {
        await switchChain({ chainId });
      }

      // Create new Sub Account
      // For direct Coinbase Wallet, the sub account is controlled by the main wallet itself
      await walletClient.request({
        method: 'wallet_addSubAccount',
        params: [{
          version: '1',
          account: {
            type: 'create',
            keys: [{
              type: 'address',
              publicKey: address // Main wallet controls the sub account
            }]
          }
        }]
      } as any);

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
  }, [address, walletClient, chainId, switchChain, getSubAccounts]);

  // Send transaction using Sub Account (no popup!)
  const sendTransaction = useCallback(async (tx: {
    to: string;
    value?: string;
    data?: string;
  }) => {
    if (!walletClient || !activeSubAccount) {
      setError('No active Sub Account');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (walletClient.chain.id !== chainId) {
        await switchChain({ chainId });
      }

      // Send transaction from Sub Account - no wallet popup!
      const txHash = await walletClient.request({
        method: 'eth_sendTransaction',
        params: [{
          from: activeSubAccount.address,
          to: tx.to,
          value: tx.value || '0x0',
          data: tx.data || '0x',
        }]
      } as any);

      return txHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      console.error('Error sending transaction:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, activeSubAccount, chainId, switchChain]);

  return {
    address,
    isConnected,
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
