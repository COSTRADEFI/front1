import React, { useState, useEffect ,useMemo} from 'react';
import { Aptos, AptosConfig, Network, queryIndexer, throwTypeMismatch } from "@aptos-labs/ts-sdk";
import { getAptosClient } from '../aptosClient.ts';


interface Props {
}

export const APTrandindex = (props: Props) => {

  
  let myclient = getAptosClient();
  
    const [indexPrice,setIndexPrice] = useState(0); 

useEffect(() => {
    const fetchIndex = async () => {
        try {
            const datafetched = await lgetrandomIndex();
            setIndexPrice(datafetched.events[0].data.price);
        } catch (error) {
           console.error('Error fetching index Values: ', error);
           // Handle errors gracefully here
        } finally {
            fetchIndex();
         }
    };

    fetchIndex();
  }, []);

  const lgetrandomIndex = async ( ) => {
  const objects = await myclient.queryIndexer({
      query: {
        query: `query MyQuery {
  events(
    where: {indexed_type: {_eq: "0xd19c3bcd94cdb6576b4a0ed958ed94805b78e1d7f4bdab3e5033bd7fb09d9bbd::just::RandomIndexEvent"}}
    order_by: {transaction_block_height: desc}
    limit: 1
  ) {
    data
  }
}
`,
},
});
return objects;
};

    return(<div> <h1>  {indexPrice /100000}</h1> </div>);
};

export default APTrandindex;




