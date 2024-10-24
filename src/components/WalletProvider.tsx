import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "../aptosClient.ts";

export function WalletProvider({ children }: PropsWithChildren) {
  const mynetwork = getAptosClient().config.network;
  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{ network: mynetwork  }}
      onError={(error) => {
        console.error(error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
