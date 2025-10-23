import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePrivy } from "@privy-io/react-auth";
import { Wallet, LogOut, Loader2 } from "lucide-react";

interface WalletConnectProps {
  onConnected?: () => void;
}

export const WalletConnect = ({ onConnected }: WalletConnectProps) => {
  const { ready, authenticated, login, logout, user } = usePrivy();

  const handleLogin = async () => {
    try {
      await login();
      onConnected?.();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (!ready) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (authenticated && user) {
    // Get the user's wallet address
    const walletAddress = user.wallet?.address || user.email?.address || 'Connected';
    const displayAddress = walletAddress.startsWith('0x') 
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : walletAddress;

    return (
      <div className="flex items-center gap-2">
        <Card className="px-3 py-2 bg-gradient-card border-primary/30">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-success/20 text-success border-success/30">
              <div className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse" />
              Connected
            </Badge>
            <span className="text-sm font-medium">{displayAddress}</span>
          </div>
        </Card>
        <Button 
          variant="outline" 
          size="icon"
          onClick={logout}
          className="border-primary/30 hover:border-primary hover:bg-primary/10"
          title="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogin}
      className="border-primary/30 hover:border-primary hover:bg-primary/10"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
};
