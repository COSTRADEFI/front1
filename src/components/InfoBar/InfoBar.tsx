import React, { FC } from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { ViewRequest,AptosAccount, Provider} from "aptos";
import { getAptosClient,DXBX,getNetwork} from '../../aptosClient.ts';
import {  updateBalanceVal,updateViewFct2,setDialogWelcomeVisible} from "../../store.ts";
import useWindowDimensions from '../../useWindowDimensions';
interface InfoBarProps { }
const WConnector = () => { 
  //const {height, width} = useWindowDimensions();
  const dispatch = useDispatch();
  //const dialogWelcomeVisible = useSelector((state: any) => state.clientReduxStore.dialogWelcomeVisible);
   const {
    connected,
  } = useWallet();
  
  useEffect(() => {
      connected && <ConnectedFunctionalities /> 
  }, [connected]);

  const depositBlinking = () => {
    if (connected) { 
      return '';
    }
    else {
      return 'connect-button-browser borderBlink';
    }
  }
  
  const showMePlease = ( ) => async () => 
  {
    dispatch(setDialogWelcomeVisible(true));
  }

  return (
      <div>
        <div className={depositBlinking()}>
          {!connected && <WalletConnector/>}
          {!connected && <button className='wallet-button btn btn-primary' onClick={showMePlease()}>?</button> }
        </div>
        {connected && <ConnectedFunctionalities/>}
      </div>
  )
}

const ConnectedFunctionalities = (props) => {
    const aptosClient = getAptosClient();
    const [myWalletBalance, setMyWalletBalance] = useState(0);
    const dispatch = useDispatch();
    const [openButtonVisible, setOpenButtonVisible] = useState(false);
   // let isOwner:boolean = false;
    const {
      account,
      connected,
      network,
      disconnect,
      signAndSubmitTransaction,
    } = useWallet();
    let myclient = getAptosClient();
  
    useEffect(() => {
      const interval = setInterval(() => { view_fct_2(); }, 1000);
      const interval2 = setInterval(() => { fetchWalletBalance(); }, 1500);
      return () => {
        clearInterval(interval);
        clearInterval(interval2);
       };
    }, [ connected]);
    // if (connected) {
    //   if (account?.address === DXBX) {
    //     isOwner = true;
    //   }
     
    // }
  
 // const {tradingBalance,setTradingBalance} = useState(0);


    const showMePlease = ( ) => async () => 
    {
      dispatch(setDialogWelcomeVisible(true));
      
    }

    const userBalance = useSelector((state: any) => state.clientReduxStore.balance)*1.0;
  const userMarginBalance = useSelector((state: any) => state.clientReduxStore.margin)*1.0;
  
    // const submitTransactionD = ()=> async () => {
    //   if (!account || !network) return;
    
    //   try {
    //     const response = await signAndSubmitTransaction({
    //       sender: account.address,
    //       data: {
    //         function: DXBX + "::just::depeche_it", //`${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
    //         typeArguments: [],
    //         functionArguments: [10000000],
    //       }
    //     });

    //   let myresponse= await aptosClient.waitForTransaction({ transactionHash: response.hash });
    //   console.log('myresponse',myresponse);

    //   }catch(error:any){
    //     console.error(error);
    //   }
    // }

    const callFaucet = ( ) => async () => {
      
        let amount=100000000000;
        let address=account?.address;

        try {
          let myresponse= await aptosClient.fundAccount({
            accountAddress: address,
            amount: amount,
          });
          console.log('myresponse',myresponse);
        }catch(error:any){
          console.error(error);
        }
        
    }

    const submitdxbx = (functionName: string, myparam:number =0,myleverage:number=50 ) => async () => {
      if (!account || !network) return;
      if (network?.name !== getNetwork()) {
        disconnectWallet();
        alert("Please connect to",getNetwork());
      }
        let payload={};
        console.log('submittoModule', functionName);
        console.log('Account submit', account);
        switch (functionName) {
          case 'open_customer_account_entry': {
            payload = {
            sender: account.address,
            data:{
            type: "entry_function_payload",
            function: DXBX + "::just::hope_it",
            typeArguments: [],
            functionArguments: [],
            }
            };
            };
            break;
          case 'deposit_to_market_account_entry': {
            payload = {
              sender: account.address,
              data:{
              type: "entry_function_payload",
              //function: DXBX + "::just::deposit_to_market_account_entry",
              function: DXBX + "::just::depeche_it",
              typeArguments: [],
              functionArguments: [100000000],
              }
            };
          };
            break;
          case 'withdraw_from_market_account': {
            payload = {
              sender: account.address,
              data: {
              type: "entry_function_payload",
              function: DXBX + "::just::without_it",
              typeArguments: [],
              functionArguments: [100000000],
              }
                }; 
                };
            break;
            case 'send_buy_order_entry': {
              payload = {
                sender: account.address,
                data:{
                  type: "entry_function_payload",
                  //function: DXBX + "::just::send_order_entry",
                  function: DXBX + "::just::said_it",
                  type_arguments: [],
                  arguments: [myleverage, myparam, true],
                }
              };
            };
              break;
            case 'send_sell_order_entry': {
              payload = {
                sender: account.address,
                data:{
                  type: "entry_function_payload",
                  //function: DXBX + "::just::send_order_entry",
                  function: DXBX + "::just::said_it",
                  type_arguments: [],
                  arguments: [myleverage, myparam, false],
                }
              };
            };
              break;
            case 'send_reset_account_entry': {
              payload = {
                sender: account.address,
                data:{
                  type: "entry_function_payload",
                  //function: DXBX + "::just::send_reset_account_entry",
                  function: DXBX + "::just::research_it",
                  type_arguments: [],
                  arguments: [],
                }
              };
            };
              break;
              default: {}
          };
          console.log('payload', payload);    
          try {
            const response = await signAndSubmitTransaction(payload);
            console.log("Transaction Submitted", response);
           // await aptosClient.waitForTransaction({ transactionHash: response.hash });
           // await view_fct_2();
          } catch (error) {
            console.error('signAndSubmitTransactio error',error);
          //  await disconnectWallet();
          }
      }

  const disconnectWallet = async () => {  
      console.log('disconnectWallet',connected, account?.address);
      dispatch(updateBalanceVal(0));
    try{
      await disconnect();
    }catch(error){
      console.log('error catch disconnect',error);
      window.location.reload(false);
    }
  }
 


//  type AccountAPTBalanceArguments = {
//   accountAddress: string;
// };

//  const accountAPTBalance = async (args: AccountAPTBalanceArguments): Promise<number> => {
//   const { accountAddress } = args;
//   const balance = await myclient().view<[number]>({
//     payload: {
//       function: "0x1::coin::balance",
//       typeArguments: ["0x1::aptos_coin::AptosCoin"],
//       functionArguments: [accountAddress],
//     },
//   });
//   return balance[0];
// };


//  const lgetFABalance = async () => {
// let myquery="query GetFungibleAssetBalances($address: String, $offset: Int) {  current_fungible_asset_balances( \
//     where: {owner_address: {_eq: \"0xc4d40ddeab3a45bdd2621d980da2b56f9ac41ddf6f68058e2b800641e945c637\"}, asset_type: {_eq: \"0x000000000000000000000000000000000000000000000000000000000000000a\"}} \
//     offset: 0 \
//     limit: 100 \
//     order_by: {amount: desc, asset_type_v1: asc, asset_type_v2: asc, amount_v2: asc, amount_v1: asc} \
//   ) { \
//     asset_type \
//     amount \
//     __typename \
//   } 
// ";

  
//     const objects = await myclient.queryIndexer({
//       query: {
//         query: myquery
// }
//     });
//     console.log('lgetFABalance', objects);
    
    // let tempArray: [] = [];
    //  objects.s.forEach(element => {
    //    tempArray.push(element.data);
    //  });
   //return objects;
   //console.log(account.address);
  //  const tokens = await myclient.getAccountOwnedTokens({ accountAddress: account?.address });
   //console.log('tokens',tokens); 


// const query: string = `query getAccountTokensCount($owner_address: String) {
//   current_token_ownerships_aggregate(where: { owner_address: { _eq: $owner_address }, amount: { _gt: "0" } }) {
//     aggregate {
//       count
//     }
//   }
// }`;
// const variables = { owner_address: "0xc4d40ddeab3a45bdd2621d980da2b56f9ac41ddf6f68058e2b800641e945c637" };
// const graphqlQuery = { query, variables };
// const accountTokensCount = await myclient.queryIndexer(graphqlQuery);
// return tokens;

//   }

  const fetchWalletBalance = async () => {
    // const data = await lgetFABalance();
    // console.log('fetchWalletBalance FA',data);
    


    if(!account){
        throw new Error("Account not connected");
    }
    const mytURL= 'https://api.'+getNetwork()+'.aptoslabs.com/v1/accounts/'+account.address+'/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';   
   // console.log('init',mytURL);
   try {
    const response = await fetch(mytURL);
    
    const body = await response.text();
    let tbody = JSON.parse(body);
    
    let mynumber = tbody?.data.coin.value ;
   //console.log('mynumber',mynumber);
    setMyWalletBalance(mynumber/100000000);
   } catch (error) {
    console.error('error',error);
   }
  }

  const view_fct_2 = async () => {
    if(!account){
        throw new Error("Account not connected");
    }
    const prov =  new Provider(getNetwork());

    const payload: ViewRequest = {
    function: `${DXBX}::just::view_balance`,
    type_arguments: [],
    arguments: [account.address],
    };
    try {
      const viewresponse = await prov.view(payload);
      //console.log('viewresponse', viewresponse[0].instrumentBalanceSmart, viewresponse[0]);
      dispatch(updateBalanceVal(viewresponse[0].instrumentBalanceSmart));
      dispatch(updateViewFct2(viewresponse[0]));
      setOpenButtonVisible(false);
     // setTradingBalance(viewresponse[0].instrumentBalanceSmart));
    //  console.log('viewresponse2',tradingBalance);
    } catch (error) {
      setOpenButtonVisible(true);
    } 
  }

  // function formatAddress(account: AptosAccount) {
  //   return account.address.toString().slice(0, 6) + "..." + account.address.toString().slice(-6);
  // }

  // function formatBalance(balance: number) {
  //   return balance/10e7;
  // }

 const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 const open = Boolean(anchorEl);
 const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
   setAnchorEl(event.currentTarget);
 };
  
  const handleClose = () => {
    setAnchorEl(null);
  };


  const getTotalBalance = () => {
    return userBalance + userMarginBalance;
  };

  const depositBlinking = () => {
    if (userBalance > 10000000) { 
      return 'wallet-button btn btn-primary';
    }
    else {
      return 'wallet-button btn btn-primary borderBlink';
    }
  }

  const useraccountbalanceBlinkingforFaucet = () => {

    if ( myWalletBalance  > 10000000) { 
      return 'wallet-button btn btn-primary';
    }
    else {
      return 'wallet-button btn btn-primary borderBlink';
    }

  }

  return (

    <div >
      <div className='txtBalance'>
        wallet balance {myWalletBalance.toFixed(2)} APT- trading balance  {(getTotalBalance()/100000000).toFixed(4)}
      </div>
      <button
        className='wallet-button btn btn-primary iamconnected'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {"User-" + account?.address.slice(-6)}
        </button>
        <Menu
        id="basic-menu"
        className='basicmenu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={disconnectWallet} className='menuitem'>Logout</MenuItem>
      </Menu>
      
  { openButtonVisible &&  <Tooltip className="tooltipmain"  title="CREATE DEPOSIT ACCOUNT"  placement="top-start"> 
  <button
        className='wallet-button btn btn-primary borderBlink ineedtoopenaccount'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('open_customer_account_entry', 1)}
      >
        {"Open Account"}
      </button>
      

      </Tooltip>}
      
      {!openButtonVisible && <button
        className={depositBlinking()+" ineedtodepositone"}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        //onClick={submitTransactionD()}
        onClick={submitdxbx('deposit_to_market_account_entry', 1)}
        
      >
        {"Deposit 1"}
      </button>}

      {!openButtonVisible && <button
        className=' wallet-button btn btn-primary ineedtowithdrawone'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('withdraw_from_market_account', 1)}
      >
        {"Withdraw 1"}

      </button>}
      {connected && <button className='wallet-button btn btn-primary' onClick={showMePlease()}>?</button>}
      <button
        className={useraccountbalanceBlinkingforFaucet() + " faucetbtn ineedgetfromfaucet"}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={callFaucet()}
      >
        {"Faucet 1"}
      </button>
      
    </div>

  )
}

const InfoBar: FC<InfoBarProps> = () => {
  const {width} = useWindowDimensions();
  const {   connected } = useWallet();
    useEffect(() => {
      { connected && <ConnectedFunctionalities /> }
  }, [connected]);

  let myStyleName='walletConnector';
  let myFullNameStyle='fullname';
  let myLogoStyle='clogo';
  let mymainStyle = 'infobar';
  let isSmall=false;

  if (width<767) {
    myStyleName='walletConnectorSmall';
    myFullNameStyle='fullnamesmall';
    myLogoStyle='clogosmall';
    mymainStyle='infobarsmall';
    isSmall=true;
  }
  return (
    <div className={mymainStyle}>
      
      {!isSmall &&
      
        <Box sx={{ flexGrow: 1 }}>
          <Grid className='alllogo' container spacing={2} columns={50}>
            <Grid className={myLogoStyle} xs={1}>
              <div>
                C
              </div>
            </Grid>
            <Grid className={myFullNameStyle} xs={8}>
              <div>OS.TRADE</div><div className='infotext'>beta</div>
            </Grid>
          </Grid>
        </Box>

      }
        <div className={myStyleName}  >
          <WConnector>
          </WConnector>
        </div>
      </div>
  )
  
};

export default InfoBar;


