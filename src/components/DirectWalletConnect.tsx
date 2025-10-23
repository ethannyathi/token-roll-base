import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut, Loader2 } from "lucide-react";

interface DirectWalletConnectProps {
  onConnected?: () => void;
}

export const DirectWalletConnect = ({ onConnected }: DirectWalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const coinbaseConnector = connectors[0]; // Coinbase Wallet connector
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
      onConnected?.();
    }
  };

  if (isPending) {
    return (
      <Button variant="outline" disabled className="h-8 px-2">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        <span className="text-xs">Connecting...</span>
      </Button>
    );
  }

  if (isConnected && address) {
    const displayAddress = `${address.slice(0, 4)}...${address.slice(-3)}`;

    return (
      <div className="flex items-center gap-1.5">
        <Card className="px-2 py-1 bg-gradient-card border-primary/30">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-[9px] px-1 py-0">
              <div className="w-1.5 h-1.5 rounded-full bg-success mr-1 animate-pulse" />
              On
            </Badge>
            <span className="text-xs font-medium">{displayAddress}</span>
          </div>
        </Card>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => disconnect()}
          className="border-primary/30 hover:border-primary hover:bg-primary/10 h-8 w-8"
          title="Disconnect"
        >
          <LogOut className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleConnect}
      className="border-primary/30 hover:border-primary hover:bg-primary/10 h-8 px-2"
    >
      <Wallet className="mr-1 h-3 w-3" />
      <span className="text-xs">Connect</span>
    </Button>
  );
};
