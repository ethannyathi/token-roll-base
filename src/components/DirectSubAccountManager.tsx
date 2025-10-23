import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDirectSubAccount } from "@/hooks/useDirectSubAccount";
import { NetworkId } from "@/constants/networks";
import { Wallet, Plus, Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface DirectSubAccountManagerProps {
  chainId: NetworkId;
  onSubAccountReady?: (address: string) => void;
}

export const DirectSubAccountManager = ({ chainId, onSubAccountReady }: DirectSubAccountManagerProps) => {
  const {
    isConnected,
    subAccounts,
    activeSubAccount,
    isLoading,
    error,
    getSubAccounts,
    createSubAccount,
  } = useDirectSubAccount(chainId);

  // Auto-fetch sub accounts when wallet is connected
  useEffect(() => {
    if (isConnected) {
      getSubAccounts();
    }
  }, [isConnected, chainId]);

  // Notify parent when sub account is ready
  useEffect(() => {
    if (activeSubAccount) {
      onSubAccountReady?.(activeSubAccount.address);
    }
  }, [activeSubAccount, onSubAccountReady]);

  if (!isConnected) {
    return null; // Don't show if wallet not connected
  }

  const handleCreateSubAccount = async () => {
    await createSubAccount();
  };

  return (
    <Card className="p-4 bg-gradient-card border-border/50 backdrop-blur-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold">Betting Wallet (No Privy Required!)</h3>
          </div>
          {activeSubAccount && (
            <Badge variant="outline" className="bg-success/20 text-success border-success/30">
              <div className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse" />
              Active
            </Badge>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}

        {activeSubAccount ? (
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Sub Account Address</p>
              <p className="text-xs font-mono break-all">{activeSubAccount.address}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              ✨ This wallet allows seamless betting with no popup confirmations!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subAccounts.length === 0 ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Create a Sub Account for seamless betting without wallet popups. No Privy API key needed!
                </p>
                <Button
                  size="sm"
                  onClick={handleCreateSubAccount}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Betting Wallet
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-xs text-muted-foreground">
                Loading sub account...
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
