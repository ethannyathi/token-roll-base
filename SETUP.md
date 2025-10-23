# Base Slots - Setup Guide

## Quick Start (NO API KEY REQUIRED!)

This project uses **wagmi** + **Coinbase Wallet SDK** directly - no Privy API key needed!

### 1. Install & Run

```bash
npm install
npm run dev
```

That's it! No environment variables or API keys required.

### 2. Connect Wallet

1. Open the app in your browser
2. Click "Connect Base Account"
3. Connect using Coinbase Wallet or any wallet supporting Base Account
4. You're ready to play!

## Features Explained

### Base Sub Accounts

Sub Accounts provide app-specific wallets that enable:
- ✅ No wallet popup confirmations during gameplay
- ✅ Seamless betting experience
- ✅ User maintains full control via main Base Account
- ✅ Can be managed at [account.base.app](https://account.base.app)

### How to Use

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Sign In**: Authenticate with Privy (wallet, email, or SMS)
3. **Create Sub Account**: Click "Create Betting Wallet" 
4. **Start Playing**: Place bets without any popups!

### Network Switching

Toggle between:
- **Base Sepolia** (testnet) - for testing with fake funds
- **Base Mainnet** - for real transactions

Click the network badge in the header to switch.

## Architecture

### Components

- `DirectWalletConnect.tsx` - Wallet connection UI (no Privy needed)
- `NetworkSwitcher.tsx` - Switch between Base networks
- `DirectSubAccountManager.tsx` - Create and manage Sub Accounts
- `BetControls.tsx` - Betting interface
- `Reel.tsx` - Slot machine reel component

### Hooks

- `useDirectSubAccount.ts` - Sub Account management with wagmi
- `useSoundEffects.ts` - Game sound effects

### Configuration

- `config/wagmi.ts` - wagmi configuration with Coinbase Wallet connector
- `constants/networks.ts` - Network configurations
- `types/wallet.ts` - TypeScript types for wallet state

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting
3. No environment variables needed!

## Troubleshooting

### Wallet not connecting
- Make sure you're using a browser with wallet extension installed
- Try Coinbase Wallet for best Base Account support
- Refresh the page and try again

### "Base Account not found" error
- Make sure your wallet supports Base Account (Coinbase Smart Wallet)
- Update your wallet to the latest version

### Sub Account not creating
- Ensure you're on Base Mainnet or Base Sepolia
- Check that your wallet has a small amount of ETH for gas
- The wallet must support the Sub Accounts feature

## Resources

- [Base Docs](https://docs.base.org/)
- [wagmi Docs](https://wagmi.sh/)
- [Coinbase Wallet SDK](https://docs.cloud.coinbase.com/wallet-sdk/docs)
- [Base Sub Accounts Guide](https://docs.base.org/base-account/improve-ux/sub-accounts)
- [Base Account Demo](https://sub-accounts-fc.vercel.app/)

## Why No Privy?

While Privy offers an excellent solution, this implementation uses **direct wallet integration** with wagmi and Coinbase Wallet SDK because:

✅ **No API keys required** - Zero configuration  
✅ **No third-party dependencies** - Direct connection to Base  
✅ **Simpler setup** - Just install and run  
✅ **Open source** - Full control over the wallet integration  
✅ **Same Sub Account features** - All the benefits, none of the complexity

