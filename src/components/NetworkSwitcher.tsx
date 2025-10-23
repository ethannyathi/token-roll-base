import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NETWORKS, NetworkId } from "@/constants/networks";
import { Network } from "lucide-react";

interface NetworkSwitcherProps {
  currentNetwork: NetworkId;
  onNetworkChange: (networkId: NetworkId) => void;
  disabled?: boolean;
}

export const NetworkSwitcher = ({ 
  currentNetwork, 
  onNetworkChange,
  disabled = false 
}: NetworkSwitcherProps) => {
  const network = currentNetwork === NETWORKS.BASE_MAINNET.id 
    ? NETWORKS.BASE_MAINNET 
    : NETWORKS.BASE_SEPOLIA;

  const toggleNetwork = () => {
    const newNetwork = currentNetwork === NETWORKS.BASE_MAINNET.id 
      ? NETWORKS.BASE_SEPOLIA.id 
      : NETWORKS.BASE_MAINNET.id;
    onNetworkChange(newNetwork);
  };

  const isMainnet = currentNetwork === NETWORKS.BASE_MAINNET.id;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleNetwork}
      disabled={disabled}
      className="border-primary/30 hover:border-primary hover:bg-primary/10 px-2 h-8"
      title={`Switch to ${isMainnet ? 'Base Sepolia' : 'Base Mainnet'}`}
    >
      <Network className="mr-1 h-3 w-3" />
      <Badge 
        variant="outline" 
        className={`text-[10px] px-1.5 py-0 ${
          isMainnet 
            ? 'bg-success/20 text-success border-success/30' 
            : 'bg-warning/20 text-warning border-warning/30'
        }`}
      >
        {network.name}
      </Badge>
    </Button>
  );
};
