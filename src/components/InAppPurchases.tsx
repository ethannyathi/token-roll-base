import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BasePayCheckout } from '@/components/BasePayCheckout';
import { Gift, Sparkles, Star, Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

/**
 * Example component showing how to use Base Pay for various in-app purchases
 * This demonstrates the flexibility of the Base Pay integration
 */

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  price: string;
  xpAmount: number;
  icon: React.ReactNode;
  popular?: boolean;
}

const EXAMPLE_ITEMS: PurchaseItem[] = [
  {
    id: 'daily-boost',
    name: 'Daily Boost',
    description: '2x winnings for 24 hours',
    price: '2.99',
    xpAmount: 0, // No XP, just the boost
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: 'premium-pass',
    name: 'Premium Pass',
    description: 'Unlock exclusive features',
    price: '9.99',
    xpAmount: 1000, // Includes bonus XP
    icon: <Star className="h-5 w-5" />,
    popular: true,
  },
  {
    id: 'gift-bundle',
    name: 'Gift Bundle',
    description: 'Share XP with friends',
    price: '14.99',
    xpAmount: 1500,
    icon: <Gift className="h-5 w-5" />,
  },
  {
    id: 'tournament-entry',
    name: 'Tournament Entry',
    description: 'Enter exclusive tournament',
    price: '4.99',
    xpAmount: 500,
    icon: <Trophy className="h-5 w-5" />,
  },
];

export const InAppPurchases = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Gift className="mr-2 h-4 w-4" />
          Shop
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>In-App Purchases</DialogTitle>
          <DialogDescription>
            Example items you can sell with Base Pay (powered by USDC on Base)
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {EXAMPLE_ITEMS.map((item) => (
            <Card
              key={item.id}
              className={`p-4 relative ${
                item.popular
                  ? 'border-primary bg-gradient-card'
                  : 'border-border/50'
              }`}
            >
              {item.popular && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-primary text-xs">
                  Popular
                </Badge>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.xpAmount > 0 && (
                  <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                    +{item.xpAmount} XP included
                  </Badge>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${item.price}
                  </span>
                  <BasePayCheckout
                    amount={item.price}
                    xpAmount={item.xpAmount}
                    description={item.name}
                    onSuccess={() => {
                      console.log(`Purchased ${item.name}`);
                      // Add your custom logic here:
                      // - Activate the boost
                      // - Grant premium access
                      // - Send gift to friend
                      // - Register tournament entry
                    }}
                    onError={(error) => {
                      console.error('Purchase failed:', error);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Developer Note:</strong> This is an example component showing
            how to use Base Pay for various in-app purchases beyond XP points.
            Customize the items, prices, and post-purchase logic for your use case.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
