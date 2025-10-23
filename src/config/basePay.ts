/**
 * Base Pay Configuration
 * Configure your payment settings here
 */

// Your wallet address to receive payments
export const PAYMENT_RECIPIENT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'; // Replace with your actual address

// Network settings
export const IS_TESTNET = true; // Set to false for mainnet

// XP Package pricing (maps to constants/xp.ts)
export const XP_PACKAGE_PRICES = {
  STARTER: '5.00',
  POPULAR: '10.00',
  PRO: '25.00',
  WHALE: '50.00',
} as const;

// Other payment settings
export const PAYMENT_POLLING_CONFIG = {
  maxAttempts: 30, // Maximum number of status checks
  intervalMs: 2000, // Time between checks (2 seconds)
} as const;

// Optional: Collect user information at checkout
export const COLLECT_PAYER_INFO = false; // Set to true to collect email, etc.

export const PAYER_INFO_REQUESTS = [
  { type: 'email' as const, optional: false },
  // Add more if needed:
  // { type: 'phoneNumber' as const, optional: true },
  // { type: 'name' as const, optional: true },
] as const;
