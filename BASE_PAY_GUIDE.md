# Base Pay Integration Guide

This app uses **Base Pay** to accept USDC payments for XP points and in-app purchases.

## 🚀 Quick Start

### 1. Configure Your Recipient Address

Edit `src/config/basePay.ts` and update the recipient address:

```typescript
export const PAYMENT_RECIPIENT_ADDRESS = '0xYourWalletAddress'; // Replace with your address
```

### 2. Choose Network Mode

For testing:
```typescript
export const IS_TESTNET = true; // Use Base Sepolia testnet
```

For production:
```typescript
export const IS_TESTNET = false; // Use Base Mainnet
```

## 💰 How It Works

### User Flow
1. User clicks "Buy XP" button
2. Base Pay popup appears (handled by Base Account SDK)
3. User pays with USDC from their Base Account or Coinbase Account
4. Payment is confirmed on-chain
5. XP is credited to user's account

### Payment Flow
```
XPStore Component
    ↓
processPayment() - Initiates payment with Base Pay SDK
    ↓
pollPaymentStatus() - Polls until transaction is confirmed
    ↓
addXP() - Credits XP to user's balance
```

## 🛠️ Components

### XPStore Component
- Main XP purchase interface
- 4 packages: Starter ($5), Popular ($10), Pro ($25), Whale ($50)
- Real Base Pay integration with payment confirmation
- Located: `src/components/XPStore.tsx`

### BasePayCheckout Component
- Reusable checkout component with official Base Pay button
- Can be used for any in-app purchase
- Located: `src/components/BasePayCheckout.tsx`

Usage example:
```tsx
import { BasePayCheckout } from '@/components/BasePayCheckout';

<BasePayCheckout
  amount="10.00"
  xpAmount={1100}
  description="1100 XP Points"
  onSuccess={() => console.log('Payment successful!')}
/>
```

## 🔧 Services

### basePay.ts
Core payment service with three main functions:

```typescript
// Initiate a payment
const payment = await processPayment({
  amount: '10.00',
  to: '0xRecipientAddress',
  testnet: true,
});

// Check payment status
const status = await checkPaymentStatus(payment.id, true);

// Poll until completed
const finalStatus = await pollPaymentStatus(payment.id, true);
```

## 🧪 Testing

### Get Test USDC
1. Go to [Circle Faucet](https://faucet.circle.com/)
2. Select "Base Sepolia" network
3. Enter your wallet address
4. Receive test USDC

### Test a Payment
1. Set `IS_TESTNET = true` in config
2. Connect your Base Account
3. Click "Buy XP" and select a package
4. Complete the payment in the Base Pay popup
5. Wait for confirmation (usually < 2 seconds)
6. XP balance should update automatically

## 📝 Configuration Options

### Payment Recipient
```typescript
// src/config/basePay.ts
export const PAYMENT_RECIPIENT_ADDRESS = '0x...';
```

### Polling Settings
```typescript
export const PAYMENT_POLLING_CONFIG = {
  maxAttempts: 30,  // Max status checks (30 x 2s = 60s timeout)
  intervalMs: 2000, // Check every 2 seconds
};
```

### Collect User Info (Optional)
```typescript
export const COLLECT_PAYER_INFO = true;
export const PAYER_INFO_REQUESTS = [
  { type: 'email', optional: false },
  { type: 'phoneNumber', optional: true },
];
```

## 🌐 Network Support

### Base Sepolia (Testnet)
- Chain ID: 84532
- Use for testing
- Free test USDC from faucet

### Base Mainnet (Production)
- Chain ID: 8453
- Real USDC payments
- No extra fees - you receive full amount

## 💡 Benefits of Base Pay

✅ **No wallet connection needed** - Base Pay handles everything
✅ **USDC payments** - Stable, no volatility
✅ **Fast** - Transactions confirm in ~2 seconds
✅ **Cheap** - Pennies in gas fees, sponsored automatically
✅ **No chargebacks** - Crypto payments are final
✅ **Works everywhere** - Any Base Account or Coinbase Account

## 🔐 Security Notes

1. **Never commit private keys** to version control
2. **Validate payments server-side** in production (use webhooks)
3. **Store XP in database** instead of localStorage
4. **Rate limit** payment endpoints
5. **Monitor** for suspicious transactions

## 📚 Resources

- [Base Pay Documentation](https://docs.base.org/base-account/guides/accept-payments)
- [Base Pay SDK Playground](https://base.github.io/account-sdk/pay-playground)
- [Circle USDC Faucet](https://faucet.circle.com/)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Base Mainnet Explorer](https://basescan.org/)

## 🐛 Troubleshooting

### Payment popup doesn't appear
- Check browser console for errors
- Ensure user has Base Account or Coinbase Account
- Try refreshing the page

### Payment stuck on "Processing"
- Check network connection
- Verify testnet/mainnet setting matches
- Check transaction on BaseScan

### XP not credited after payment
- Check browser console for payment ID
- Manually check payment status with ID
- Verify `addXP()` is called after payment confirmation

## 🚀 Production Checklist

Before deploying to production:

- [ ] Update `PAYMENT_RECIPIENT_ADDRESS` to your production wallet
- [ ] Set `IS_TESTNET = false`
- [ ] Replace localStorage with backend database
- [ ] Add server-side payment validation
- [ ] Set up webhook for payment confirmations
- [ ] Add rate limiting
- [ ] Test with real USDC on testnet first
- [ ] Monitor transactions in production

## 📞 Support

For Base Pay support:
- [Base Discord](https://discord.gg/buildonbase)
- [Base Docs](https://docs.base.org/)
- [GitHub Issues](https://github.com/base/account-sdk/issues)
