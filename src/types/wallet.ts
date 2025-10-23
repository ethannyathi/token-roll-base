export interface SubAccount {
  address: string;
  factory: string;
  factoryData: string;
}

export interface WalletState {
  address: string | null;
  subAccount: SubAccount | null;
  isConnected: boolean;
  isLoading: boolean;
}
