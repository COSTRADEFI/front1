import React , { useState, useEffect }from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosConfig, Aptos, Network } from '@aptos-labs/ts-sdk';
import { TradeEvent,liqEvent ,GenericEvent} from './liqTypes.ts';
import { getAptosClient} from '../../aptosClient.ts';

export const TradeEvents = (props) => {
  const { account } = useWallet();
  
  let myclient = getAptosClient();

  const [tradeEvents, settradeEvents] = useState([]);
  
  useEffect(() => {
    const fetchNFTs = async () => {
      if (account?.address)
      {
        try {
          const data = await lgettradeEvents();
          settradeEvents(data);

          
        } catch (error) {
          console.error('Error fetching TradeEvents:', error);
          // Handle errors gracefully (e.g., show error message to user)
        } finally {
          //setLoading(false);
        }
      }
      
    };

    const interval2 = setInterval(() => {
      //fetchWalletBalance();
      fetchNFTs();
    }, 1000);
      return () => {
        
        clearInterval(interval2);

      };

    
    
  }, );

  
  const lgettradeEvents = async () => {
    const objects = await myclient.queryIndexer({
      query: {
        query: `query MyQuery {
  events(
    where: { indexed_type: {_eq: "0xd19c3bcd94cdb6576b4a0ed958ed94805b78e1d7f4bdab3e5033bd7fb09d9bbd::just::TradeEvent"}}
    order_by: {transaction_version: desc}
    limit: 7
  ) {
    data
  }
}`
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