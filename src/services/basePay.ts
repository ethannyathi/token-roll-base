import { pay, getPaymentStatus } from '@base-org/account';

export interface PaymentOptions {
  amount: string;
  to: string;
  testnet?: boolean;
  payerInfo?: {
    requests: Array<{
      type: 'email' | 'phoneNumber' | 'physicalAddress' | 'onchainAddress' | 'name';
      optional?: boolean;
    }>;
    callbackURL?: string;
  };
}

export interface PaymentResult {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  payerInfoResponses?: any; // Using any to match SDK's PayerInfoResponses type
}

/**
 * Process a payment using Base Pay
 * @param options Payment options including amount, recipient address, and optional payer info
 * @returns Payment result with transaction ID and status
 */
export async function processPayment(options: PaymentOptions): Promise<PaymentResult> {
  try {
    const payment = await pay({
      amount: options.amount,
      to: options.to,
      testnet: options.testnet ?? true, // Default to testnet
      payerInfo: options.payerInfo,
    });

    console.log(`✅ Payment initiated! Transaction ID: ${payment.id}`);

    // Return the payment result
    return {
      id: payment.id,
      status: 'pending',
      payerInfoResponses: payment.payerInfoResponses,
    };
  } catch (error) {
    console.error('❌ Payment failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Payment failed');
  }
}

/**
 * Check the status of a payment
 * @param id Transaction ID from the payment
 * @param testnet Whether this is a testnet transaction (must match the original pay() call)
 * @returns Payment status
 */
export async function checkPaymentStatus(
  id: string,
  testnet: boolean = true
): Promise<'pending' | 'completed' | 'failed'> {
  try {
    const result = await getPaymentStatus({
      id,
      testnet,
    });

    return result.status as 'pending' | 'completed' | 'failed';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return 'failed';
  }
}

/**
 * Poll payment status until it's completed or fails
 * @param id Transaction ID
 * @param testnet Whether this is a testnet transaction
 * @param maxAttempts Maximum number of polling attempts (default: 30)
 * @param intervalMs Interval between polls in milliseconds (default: 2000)
 * @returns Final payment status
 */
export async function pollPaymentStatus(
  id: string,
  testnet: boolean = true,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<'completed' | 'failed'> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkPaymentStatus(id, testnet);

    if (status === 'completed') {
      console.log('🎉 Payment completed!');
      return 'completed';
    }

    if (status === 'failed') {
      console.log('❌ Payment failed');
      return 'failed';
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  console.log('⏱️ Payment polling timeout');
  return 'failed';
}
