import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { useToast } from "./ui/use-toast.ts";
// Internal constants
//import { NETWORK } from "@/constants";

export function WalletProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{ network: "devnet" }}
      onError={(error) => {
        
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
        });
      }}
     
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
