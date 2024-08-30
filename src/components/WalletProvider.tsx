import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { useToast } from "./ui/use-toast.ts";
// Internal constants
//import { NETWORK } from "@/constants";
/// import config from aptosclient
import { getAptosClient } from "../aptosClient.ts";

export function WalletProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();

 // console.log(getAptosClient().config.network);
const mynetwork = getAptosClient().config.network;

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{ network: mynetwork  }}
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
