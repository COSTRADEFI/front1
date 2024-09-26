import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { API_URL } from '../../../GenArtory/genartory/frontend/src/utils/constants';




export function getAptosClient() {
  //const config = new AptosConfig({ network: getNetwork() });

  const config = new AptosConfig({
    network: getNetwork(),
    fullnode: `https://aptos-testnet.nodit.io/${API_KEY}/v1`,
    indexer: `https://aptos-testnet.nodit.io/${API_KEY}/v1/graphql`,
   });
  return new Aptos(config);
}
