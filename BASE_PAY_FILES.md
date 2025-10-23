# Base Pay Integration - File Structure

## 📁 New Files Created

```
src/
├── services/
│   └── basePay.ts                    # Core payment service
├── config/
│   └── basePay.ts                    # Payment configuration
└── components/
    ├── BasePayCheckout.tsx           # Reusable checkout component
    └── InAppPurchases.tsx            # Example usage component

docs/
├── BASE_PAY_GUIDE.md                 # Developer guide
└── BASE_PAY_IMPLEMENTATION.md        # Implementation summary
```

## 📝 Modified Files

```
src/
└── components/
    └── XPStore.tsx                   # Updated with real Base Pay

README.md                             # Updated with Base Pay info
```

## 🔧 Core Components

### 1. basePay.ts (Service Layer)
**Purpose:** Core payment processing logic  
**Location:** `src/services/basePay.ts`  
**Key Functions:**
- `processPayment()` - Start a payment
- `checkPaymentStatus()` - Check payment status
- `pollPaymentStatus()` - Wait for confirmation

**Usage:**
```typescript
import { processPayment, pollPaymentStatus } from '@/services/basePay';

const payment = await processPayment({
  amount: '10.00',
  to: '0xRecipientAddress',
  testnet: true,
});

const status = await pollPaymentStatus(payment.id, true);
```

### 2. basePay.ts (Configuration)
**Purpose:** Centralized settings  
**Location:** `src/config/basePay.ts`  
**Key Settings:**
- `PAYMENT_RECIPIENT_ADDRESS` - Your wallet
- `IS_TESTNET` - Network mode
- `PAYMENT_POLLING_CONFIG` - Polling behavior

**Usage:**
```typescript
import { PAYMENT_RECIPIENT_ADDRESS, IS_TESTNET } from '@/config/basePay';
```

### 3. XPStore.tsx (Updated)
**Purpose:** XP purchase interface with real payments  
**Location:** `src/components/XPStore.tsx`  
**Changes:**
- Replaced simulated payments with Base Pay
- Added payment polling
- Shows Base Pay popup
- Auto-credits XP on confirmation

### 4. BasePayCheckout.tsx (Component)
**Purpose:** Reusable checkout button  
**Location:** `src/components/BasePayCheckout.tsx`  
**Usage:**
```tsx
<BasePayCheckout
  amount="10.00"
  xpAmount={1100}
  description="XP Points"
  onSuccess={() => console.log('Success!')}
/>
```

### 5. InAppPurchases.tsx (Example)
**Purpose:** Example of Base Pay for other items  
**Location:** `src/components/InAppPurchases.tsx`  
**Examples:**
- Daily boosts
- Premium passes
- Gift bundles
- Tournament entries

## 🎯 Integration Points

### Where Base Pay is Used

1. **XP Store** (`src/components/XPStore.tsx`)
   - Primary use case
   - 4 packages: $5, $10, $25, $50
   - Includes bonus XP
   - Real USDC payments

2. **Custom Purchases** (`src/components/BasePayCheckout.tsx`)
   - Reusable for any item
   - Flexible pricing
   - Optional XP credit
   - Custom callbacks

3. **Example Shop** (`src/components/InAppPurchases.tsx`)
   - Shows versatility
   - Multiple item types
   - Different price points

## 🔄 Payment Flow

```
User Action
    ↓
XPStore Component
    ↓
handlePurchase()
    ↓
processPayment()
    ↓
Base Pay SDK (popup)
    ↓
pollPaymentStatus()
    ↓
addXP() (credit user)
    ↓
Success Toast
```

## 🛠️ How to Customize

### Change Recipient Address
```typescript
// src/config/basePay.ts
export const PAYMENT_RECIPIENT_ADDRESS = '0xYourAddress';
```

### Toggle Testnet/Mainnet
```typescript
// src/config/basePay.ts
export const IS_TESTNET = false; // mainnet
```

### Adjust Polling Behavior
```typescript
// src/config/basePay.ts
export const PAYMENT_POLLING_CONFIG = {
  maxAttempts: 60,  // Check 60 times
  intervalMs: 1000, // Every 1 second
};
```

### Add New Purchase Types
```typescript
// Create new component or use BasePayCheckout
<BasePayCheckout
  amount="19.99"
  xpAmount={2500}
  description="Premium Bundle"
  onSuccess={handlePremiumActivation}
/>
```

## 📚 Documentation Files

### BASE_PAY_GUIDE.md
- Complete developer guide
- Testing instructions
- Configuration options
- Production checklist
- Troubleshooting

### BASE_PAY_IMPLEMENTATION.md
- What was implemented
- Feature overview
- Testing guide
- Next steps

### README.md (Updated)
- Feature highlights
- Base Pay benefits
- Quick start guide

## 🔍 Finding Code Examples

### Search for Base Pay usage:
```bash
# Find all Base Pay imports
grep -r "@base-org/account" src/

# Find payment processing
grep -r "processPayment" src/

# Find Base Pay buttons
grep -r "BasePayButton" src/
```

### Key search terms:
- `processPayment`
- `pollPaymentStatus`
- `BasePayCheckout`
- `PAYMENT_RECIPIENT_ADDRESS`
- `IS_TESTNET`

## 🎨 UI Components

### Base Pay Button (Official)
```tsx
import { BasePayButton } from '@base-org/account-ui/react';

<BasePayButton
  colorScheme="dark"
  onClick={handlePayment}
/>
```

### Custom Button
```tsx
<Button onClick={handlePayment}>
  Pay ${amount}
</Button>
```

## 🧪 Test Files

No test files included yet. To add tests:

```typescript
// src/services/basePay.test.ts
import { processPayment } from './basePay';

describe('Base Pay Service', () => {
  it('should process payment', async () => {
    // Test implementation
  });
});
```

## 📦 Dependencies Added

```json
{
  "@base-org/account": "^latest",
  "@base-org/account-ui": "^latest"
}
```

Installed with:
```bash
npm install @base-org/account @base-org/account-ui --legacy-peer-deps
```

## 🎯 Summary

**Total Files Created:** 5  
**Total Files Modified:** 2  
**New Dependencies:** 2  
**Documentation Files:** 3  

**Status:** ✅ Ready to test on Base Sepolia  
**Production Ready:** ⚠️ Need to update config and add backend validation

---

**Quick Start Testing:**
1. Get test USDC from [Circle Faucet](https://faucet.circle.com/)
2. Run `npm run dev`
3. Click "Buy XP"
4. Complete payment
5. XP credited automatically!
