import React , { useState, useEffect }from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosConfig, Aptos, Network } from '@aptos-labs/ts-sdk';
import { TradeEvent,liqEvent ,GenericEvent} from './liqTypes.ts';
import { getAptosClient} from '../../aptosClient.ts';

export const TradeEvents = (props) => {
  const { account } = useWallet();
  const [tradeEvents, settradeEvents] = useState([]);

  let myclient = getAptosClient();
  
  useEffect(() => {
    const fetchNFTs = async () => {
    
      
        try {
          const data = await lgettradeEvents();
          settradeEvents(data);

          
        } catch (error) {
          console.error('Error fetching TradeEvents:', error);
          // Handle errors gracefully (e.g., show error message to user)
        } finally {
          //setLoading(false);
        }
      
      
    };

    const interval2 = setInterval(() => {
      //fetchWalletBalance();
      fetchNFTs();
    }, 1000);
      return () => {
        clearInterval(interval2);
      };
  },[] );

  const lgettradeEvents = async () => {
   // console.log("lgettradeEvents");
    const objects = await myclient.queryIndexer({
      query: {
        query: `query MyQuery {
  events(
    limit: 8
    order_by: {transaction_block_height: desc}
    where: {indexed_type: {_eq: "0x13a9f1a109368730f2e355d831ba8fbf5942fb82321863d55de54cb4ebe5d18f::just::TradeEvent"}}
  ) {
    data
    transaction_block_height
  }
}
`
},
    });
    let tempArray: TradeEvent[] = [];
     objects.events.forEach(element => {
       tempArray.push(element.data);
     });
   return tempArray;
  }

  
  return (
     
      <div className="TradeEventsWrapper">
        {tradeEvents.map((tradEvent,index) => (
          <div key={tradEvent.account+index}>
            {"0x.." + tradEvent.account.slice(-6) + " trade "}
            {   (tradEvent.isLong?"long":"short") +" for "} 
            {tradEvent.numbercont}
            {(tradEvent.price == 0) ? "" : " @ " + (tradEvent.price * 0.00001).toFixed(0)+" liq"}
          </div>
        ))}

      </div>
     
     
    )
  };

export default TradeEvents;
