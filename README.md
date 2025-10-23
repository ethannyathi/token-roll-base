# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d76cafc6-2b13-4b94-8db2-b890388fc34d

## Base Slots - Crypto Slot Machine

A decentralized slot machine game built on Base blockchain with seamless wallet integration using Base Sub Accounts.

### Features

- 🎰 Slot machine gameplay with Base token themes
- 💎 **XP Points System** - Buy credits with crypto, bet instantly (no gas fees!)
- � **Base Pay Integration** - One-tap USDC payments powered by Base
- �🔊 Immersive sound effects for spins, wins, and jackpots
- 🌐 Network switching between Base Mainnet and Base Sepolia
- 🔐 Direct Coinbase Wallet integration (NO API KEY REQUIRED!)
- ⚡ Lightning-fast gameplay (XP stored off-chain)
- 📱 Mobile-optimized interface

### Setup Instructions

**No API keys required!** This implementation uses wagmi + Coinbase Wallet SDK directly.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Connect Your Wallet**
   - Click "Connect Base Account" 
   - Use Coinbase Wallet or any wallet that supports Base Account
   - That's it! No configuration needed.

### How It Works

#### XP Points System (Simple & Fast)

This app uses an **off-chain XP system** for instant, gas-free gameplay:

1. **Connect Wallet**: Use your main wallet (Coinbase Wallet / any Base-compatible wallet)
2. **Buy XP**: Purchase XP points with crypto (simulated payment in demo)
3. **XP Storage**: Credits stored in browser localStorage (would be database in production)
4. **Bet Instantly**: Place bets with XP - no blockchain transactions, no gas fees!
5. **Win/Lose XP**: Instant updates to your XP balance

#### Network Support

- **Base Mainnet** (Chain ID: 8453) - For real transactions
- **Base Sepolia** (Chain ID: 84532) - For testing (default)

You can switch networks using the network switcher in the header.

#### Game Mechanics

- **Buy XP**: Purchase gaming credits via **Base Pay** ($5-$50 packages with bonuses)
  - Pay with USDC on Base (fast & cheap)
  - One-tap checkout with Base Account
  - No gas fees, no chargebacks
- **Bet XP**: Use 10-500 XP per spin (instant, no gas fees!)
- **Match 3 same type** → 10x XP payout (e.g., 100 XP bet = 1,000 XP win)
- **Match 3 top-ranked tokens** → 100x JACKPOT! (e.g., 100 XP bet = 10,000 XP win)
- **Convert back**: Optional cashout feature (XP → USDC with 10% fee)

### Base Pay Integration

This app uses **Base Pay** for all USDC payments:

- ✅ One-tap checkout experience
- ✅ No wallet connection popups during payment
- ✅ Fast settlements (< 2 seconds)
- ✅ Accepts USDC from Base Account or Coinbase Account
- ✅ Full amount received (no platform fees)

**For developers:** See [BASE_PAY_GUIDE.md](./BASE_PAY_GUIDE.md) for implementation details and testing instructions.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d76cafc6-2b13-4b94-8db2-b890388fc34d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- wagmi (Ethereum wallet integration)
- Coinbase Wallet SDK (Base Account support)
- **@base-org/account** (Base Pay SDK)
- **@base-org/account-ui** (Base Pay UI components)
- Base Blockchain (Mainnet & Sepolia)
- Web Audio API (Sound Effects)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d76cafc6-2b13-4b94-8db2-b890388fc34d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
