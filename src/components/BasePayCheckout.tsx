import { BasePayButton } from '@base-org/account-ui/react';
import { processPayment, pollPaymentStatus } from '@/services/basePay';
import { useXPBalance } from '@/hooks/useXPBalance';
import { toast } from 'sonner';
import {
  PAYMENT_RECIPIENT_ADDRESS,
  IS_TESTNET,
  PAYMENT_POLLING_CONFIG,
} from '@/config/basePay';

interface BasePayCheckoutProps {
  amount: string;
  xpAmount: number;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  colorScheme?: 'light' | 'dark';
  disabled?: boolean;
}

/**
 * Base Pay checkout button component
 * Uses the official BasePayButton from @base-org/account-ui
 */
export const BasePayCheckout = ({
  amount,
  xpAmount,
  description = 'XP Points',
  onSuccess,
  onError,
  colorScheme = 'dark',
  disabled = false,
}: BasePayCheckoutProps) => {
  const { addXP } = useXPBalance();

  const handlePayment = async () => {
    try {
      // Initiate Base Pay payment
      const payment = await processPayment({
        amount,
        to: PAYMENT_RECIPIENT_ADDRESS,
        testnet: IS_TESTNET,
      });

      console.log('Payment initiated:', payment);

      // Show loading toast while polling
      toast.loading(`Confirming payment of $${amount}...`, { id: payment.id });

      // Poll for payment completion
      const status = await pollPaymentStatus(
        payment.id,
        IS_TESTNET,
        PAYMENT_POLLING_CONFIG.maxAttempts,
        PAYMENT_POLLING_CONFIG.intervalMs
      );

      if (status === 'completed') {
        // Credit XP to user
        addXP(xpAmount, 'purchase', payment.id);

        toast.success(`Successfully purchased ${xpAmount.toLocaleString()} XP!`, {
          id: payment.id,
          description: `Transaction ID: ${payment.id.slice(0, 10)}...`,
        });

        onSuccess?.();
      } else {
        throw new Error('Payment failed or timed out');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Payment failed. Please try again.';

      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  return (
    <div>
      {!disabled ? (
        <BasePayButton
          colorScheme={colorScheme}
          onClick={handlePayment}
        />
      ) : (
        <BasePayButton
          colorScheme={colorScheme}
          onClick={() => {}}
        />
      )}
    </div>
  );
};
