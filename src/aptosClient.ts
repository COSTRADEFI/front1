import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


//export const DXBX = '0x7cfadf121d363b27b55636dbe10b172ec58a875baa48c0c08a7e5eaad4e4f981';
export const DXBX = '0xd19c3bcd94cdb6576b4a0ed958ed94805b78e1d7f4bdab3e5033bd7fb09d9bbd';

export function getAptosClient() {
  const config = new AptosConfig({ network: Network.DEVNET });
  return new Aptos(config);
}
