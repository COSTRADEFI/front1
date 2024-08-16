import React, { FC } from 'react';
import { useEffect, useRef,useState,useMemo } from 'react';
import styles from './InfoBar.module.css';
import { useSelector, useDispatch } from "react-redux";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { ViewRequest,AptosAccount, Provider, Network} from "aptos";
import { getAptosClient,DXBX} from '../../aptosClient.ts';
import {  updateBalanceVal,updateViewFct2,setDialogWelcomeVisible} from "../../store.ts";
import useWindowDimensions from '../../useWindowDimensions';


interface InfoBarProps { }

//const DXBX = '0xd19c3bcd94cdb6576b4a0ed958ed94805b78e1d7f4bdab3e5033bd7fb09d9bbd';
const WConnector = () => { 
  const {height, width} = useWindowDimensions();
  const dispatch = useDispatch();
  const dialogWelcomeVisible = useSelector((state: any) => state.clientReduxStore.dialogWelcomeVisible);
  const {
    connected,
  } = useWallet();
  
  useEffect(() => {
    
    { connected && <ConnectedFunctionalities /> }

  }, [connected]);

  const depositBlinking = () => {
    if (connected) { 
     // console.log('connected', connected);
      return '';
    }
    else {
     // console.log('not connected', connected);
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
    let isOwner: bool =false
    const {
      account,
      connected,
      network,
      disconnect,
      signAndSubmitTransaction,
    } = useWallet();
   
    useEffect(() => {
      const interval = setInterval(() => { view_fct_2(); }, 1000);
      const interval2 = setInterval(() => { fetchWalletBalance(); }, 5000);
      return () => {
        clearInterval(interval);
        clearInterval(interval2);

      };
    }, []);
    

    if (connected) {
        if (account?.address === DXBX) {
          isOwner=true;
      }
     
    }


    const showMePlease = ( ) => async () => 
    {
      dispatch(setDialogWelcomeVisible(true));
      
    }

    const userBalance = useSelector((state: any) => state.clientReduxStore.balance);

    const submitTransactionD = ()=> async () => {
      if (!account || !network) return;
    
      try {
        const response = await signAndSubmitTransaction({
          sender: account.address,
          data: {
            function: DXBX + "::just::depeche_it", //`${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
            typeArguments: [],
            functionArguments: [100000000],
          }
        });

      let myresponse= await aptosClient.waitForTransaction({ transactionHash: response.hash });
      console.log('myresponse',myresponse);

      }catch(error:any){
        console.error(error);
      }
    }

    const callFaucet = ( ) => async () => {
      
        let amount=1000000000000;
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
      if (network?.name !== 'devnet') {
        disconnectWallet();
        alert("Please connect to devNET");
      }
        let payload={};
        console.log('submittoModule', functionName);
        console.log('Account submitdxbx', account);
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
      const response = await disconnect();
    }catch(error){
      console.log('error catch disconnect',error);
      window.location.reload(false);
    }
  }
  

  const fetchWalletBalance = async () => {
    if(!account){
        throw new Error("Account not connected");
    }

    const mytURL= 'https://api.devnet.aptoslabs.com/v1/accounts/'+account.address+'/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';   
   // console.log('init',mytURL);
   try {
    const response = await fetch(mytURL);
    
    const body = await response.text();
    let tbody = JSON.parse(body);
    
    let mynumber = tbody?.data.coin.value ;
    console.log('mynumber',mynumber);
    setMyWalletBalance(mynumber);
   } catch (error) {
    console.error('error',error);
   }
  }


  const view_fct_2 = async () => {
    if(!account){
        throw new Error("Account not connected");
    }
    const prov = new Provider(Network.DEVNET);
    const payload: ViewRequest = {
    function: `${DXBX}::just::view_balance`,
    type_arguments: [],
    arguments: [account.address],
    };
    try {
      const viewresponse = await prov.view(payload);
      //console.log('viewresponse',viewresponse);
      dispatch(updateBalanceVal(viewresponse[0].instrumentBalanceSmart));
      dispatch(updateViewFct2(viewresponse[0]));
      setOpenButtonVisible(false);
      
    } catch (error) {
      setOpenButtonVisible(true);
    } 
  }


  function formatAddress(account: AptosAccount) {
    return account.address.toString().slice(0, 6) + "..." + account.address.toString().slice(-6);
  }

  function formatBalance(balance: number) {
    return balance/10e7;
  }

 const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 const open = Boolean(anchorEl);
 const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
   setAnchorEl(event.currentTarget);
 };
  
  const handleClose = () => {
    setAnchorEl(null);
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
      <button
        className='wallet-button btn btn-primary'
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
        className='wallet-button btn btn-primary borderBlink'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('open_customer_account_entry', 1)}
      >
        {"Open Account"}
      </button>
      <button
        className= {useraccountbalanceBlinkingforFaucet()}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={callFaucet()}
      >
        {"Faucet 1"}
      </button>

      </Tooltip>}
      
      {!openButtonVisible && <button
        className={depositBlinking()}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        //onClick={submitTransactionD()}
        onClick={submitdxbx('deposit_to_market_account_entry', 1)}
        
      >
        {"Deposit 1"}
      </button>}

      {!openButtonVisible && <button
        className=' wallet-button btn btn-primary'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={submitdxbx('withdraw_from_market_account', 1)}
      >
        {"Withdraw 1"}
      </button>}
      {!openButtonVisible && <button
        className={useraccountbalanceBlinkingforFaucet()}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={callFaucet()}
      >
        {"Faucet 1"}
      </button>}
      {connected && <button className='wallet-button btn btn-primary' onClick={showMePlease()}>?</button> }
     
    </div>

  )
}

const InfoBar: FC<InfoBarProps> = () => {
  const {height, width} = useWindowDimensions();
  
  const {
    connected,
    account,
    
  } = useWallet();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (connected) {
     // console.log('WConnectorConnected useEffecti', connected);
    }
    { connected && <ConnectedFunctionalities /> }

  }, [connected]);

  let myStyleName='walletConnector';
  let myFullNameStyle='fullname';
  let myLogoStyle='clogo';
  let mymainStyle='infobar';

  if (width<767) {
    myStyleName='walletConnectorSmall';
    myFullNameStyle='fullnamesmall';
    myLogoStyle='clogosmall';
    mymainStyle='infobarsmall';
    
  }


  
  
  
  return (
    <div className={mymainStyle}>
      
        <Box sx={{ flexGrow: 1 }}>
      <Grid className='alllogo'container  spacing={2} columns={50}>
      

        <Grid className={myLogoStyle} xs={1}>
          <div>
           C 
          </div>
        </Grid>
        <Grid className={myFullNameStyle} xs={8}>
          <div>COS.TRADE</div><div className='infotext'>beta</div>
          
        </Grid>

        
        
        </Grid>
       
        </Box>
        <div className={myStyleName}  >
          <WConnector>
          </WConnector>
       
        </div>




      </div>
  )
  
};

export default InfoBar;


