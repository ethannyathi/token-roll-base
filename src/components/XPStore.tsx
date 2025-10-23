import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XPPackage } from "@/types/xp";
import { XP_PACKAGES } from "@/constants/xp";
import { ShoppingCart, Sparkles, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useXPBalance } from "@/hooks/useXPBalance";
import { toast } from "sonner";
import { processPayment, pollPaymentStatus } from "@/services/basePay";
import { 
  PAYMENT_RECIPIENT_ADDRESS, 
  IS_TESTNET,
  PAYMENT_POLLING_CONFIG,
  COLLECT_PAYER_INFO,
  PAYER_INFO_REQUESTS,
} from "@/config/basePay";

export const XPStore = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<XPPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addXP } = useXPBalance();

  // Handle Base Pay purchase
  const handlePurchase = async (pkg: XPPackage) => {
    if (isProcessing) return;
    
    setSelectedPackage(pkg);
    setIsProcessing(true);

    try {
      // Initiate Base Pay payment
      const payment = await processPayment({
        amount: pkg.price.toString(),
        to: PAYMENT_RECIPIENT_ADDRESS,
        testnet: IS_TESTNET,
        payerInfo: COLLECT_PAYER_INFO ? {
          requests: PAYER_INFO_REQUESTS as any,
        } : undefined,
      });

      console.log('Payment initiated:', payment);

      // Show loading toast while polling
      toast.loading(`Confirming payment of $${pkg.price}...`, { id: payment.id });

      // Poll for payment completion
      const status = await pollPaymentStatus(
        payment.id,
        IS_TESTNET,
        PAYMENT_POLLING_CONFIG.maxAttempts,
        PAYMENT_POLLING_CONFIG.intervalMs
      );

      if (status === 'completed') {
        // Credit XP to user
        addXP(pkg.xpAmount, 'purchase', payment.id);
        console.log('✅ XP credited successfully:', pkg.xpAmount, 'New balance should update');
        
        toast.success(`Successfully purchased ${pkg.xpAmount.toLocaleString()} XP!`, {
          id: payment.id,
          description: `Transaction ID: ${payment.id.slice(0, 10)}...`,
        });

        // Log payer info if collected
        if (payment.payerInfoResponses) {
          console.log('Payer info:', payment.payerInfoResponses);
        }

        // Close dialog after a short delay to let user see the success
        setTimeout(() => {
          setIsOpen(false);
        }, 1000);
      } else {
        toast.error('Payment failed or timed out', { id: payment.id });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Payment failed. Please try again.'
      );
    } finally {
      setSelectedPackage(null);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-primary/30 hover:border-primary hover:bg-primary/10 px-2 h-8"
        >
          <ShoppingCart className="mr-1 h-3 w-3" />
          <span className="text-xs">Buy XP</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-primary animate-pulse-glow" />
            Buy XP Points
          </DialogTitle>
          <DialogDescription className="text-xs">
            Purchase XP to play slots. More XP = More chances to win!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-3">
          {/* First row - 2 items */}
          <div className="grid grid-cols-2 gap-2">
            {XP_PACKAGES.slice(0, 2).map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-2 cursor-pointer transition-all hover:shadow-glow ${
                  pkg.popular
                    ? 'border-primary bg-gradient-card relative'
                    : 'border-border/50 hover:border-primary/50'
                }`}
                onClick={() => handlePurchase(pkg)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-1.5 -right-1.5 bg-gradient-primary text-[9px] px-1 py-0">
                    <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                    Popular
                  </Badge>
                )}
                
                <div className="space-y-1.5">
                  <div>
                    <h3 className="font-bold text-xs">{pkg.name}</h3>
                    <p className="text-base font-bold text-primary">
                      {pkg.xpAmount.toLocaleString()} XP
                    </p>
                  </div>

                  {pkg.bonus > 0 && (
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-[9px] px-1 py-0">
                      +{pkg.bonus}% Bonus!
                    </Badge>
                  )}

                  <div className="pt-1.5 border-t border-border/50">
                    <div className="text-[10px] text-muted-foreground mb-1">
                      Base: {(pkg.xpAmount / (1 + pkg.bonus / 100)).toFixed(0)} XP
                    </div>
                    <Button
                      className="w-full bg-gradient-primary hover:shadow-glow h-7 text-xs"
                      disabled={isProcessing}
                    >
                      {selectedPackage?.id === pkg.id && isProcessing ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ${pkg.price}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Second row - 3 items */}
          <div className="grid grid-cols-3 gap-2">
            {XP_PACKAGES.slice(2).map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-2 cursor-pointer transition-all hover:shadow-glow ${
                  pkg.popular
                    ? 'border-primary bg-gradient-card relative'
                    : 'border-border/50 hover:border-primary/50'
                }`}
                onClick={() => handlePurchase(pkg)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-1.5 -right-1.5 bg-gradient-primary text-[9px] px-1 py-0">
                    <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                    Popular
                  </Badge>
                )}
                
                <div className="space-y-1.5">
                  <div>
                    <h3 className="font-bold text-[11px]">{pkg.name}</h3>
                    <p className="text-sm font-bold text-primary">
                      {pkg.xpAmount.toLocaleString()} XP
                    </p>
                  </div>

                  {pkg.bonus > 0 && (
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-[8px] px-1 py-0">
                      +{pkg.bonus}%
                    </Badge>
                  )}

                  <div className="pt-1.5 border-t border-border/50">
                    <div className="text-[9px] text-muted-foreground mb-1">
                      {(pkg.xpAmount / (1 + pkg.bonus / 100)).toFixed(0)} XP
                    </div>
                    <Button
                      className="w-full bg-gradient-primary hover:shadow-glow h-6 text-[10px]"
                      disabled={isProcessing}
                    >
                      {selectedPackage?.id === pkg.id && isProcessing ? (
                        <>
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        </>
                      ) : (
                        <>
                          ${pkg.price}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
          <h4 className="font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-primary" />
            Powered by Base Pay
          </h4>
          <ul className="text-[10px] text-muted-foreground space-y-0.5">
            <li>• Pay with USDC on Base (fast & cheap)</li>
            <li>• One-tap checkout with your Base Account</li>
            <li>• XP credited instantly after payment</li>
            <li>• No gas fees, no chargebacks</li>
            <li>• 100 XP = $1 USD value</li>
          </ul>
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-[9px] text-muted-foreground">
              💡 <strong>{IS_TESTNET ? 'Testnet Mode:' : 'Mainnet Mode:'}</strong> {IS_TESTNET ? 'Get free USDC from Circle Faucet to test.' : 'Real USDC payments on Base.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
