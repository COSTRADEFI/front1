import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


export const DXBX = '0x13a9f1a109368730f2e355d831ba8fbf5942fb82321863d55de54cb4ebe5d18f';
export const TROLLCOMMUNITY = '0x13a9f1a109368730f2e355d831ba8fbf5942fb82321863d55de54cb4ebe5d18f';
const API_KEY = '***************';



export function getNetwork(){
  return Network.TESTNET;
}





export function getAptosClient() {
  //const config = new AptosConfig({ network: getNetwork() });

  const config = new AptosConfig({
    network: getNetwork(),
    fullnode: `https://aptos-testnet.nodit.io/${API_KEY}/v1`,
    indexer: `https://aptos-testnet.nodit.io/${API_KEY}/v1/graphql`,
   });
  return new Aptos(config);
}
