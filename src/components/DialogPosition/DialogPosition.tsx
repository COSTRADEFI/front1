import React, { FC } from 'react';
import styles from './DialogPosition.module.css';
import { useSelector, useDispatch } from "react-redux";
import { Button, Form,Row, Col, Container } from 'react-bootstrap';
//import "bootstrap/dist/css/bootstrap.css";
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient} from '../../aptosClient.ts';
import { DXBX } from '../../aptosClient.ts';
import useWindowDimensions from '../../useWindowDimensions';
import {
  newRandomVal,
  newResultVal,
  setAnimationVal,
  updateBalanceVal,
} from "./store.ts";

const aptosClient = getAptosClient();

interface DialogPositionProps {}

//const userBalance = useSelector((state: any) => state.clientReduxStore.balance);

const DialogPosition: FC<DialogPositionProps> = () => {
  const {height, width} = useWindowDimensions();
  const {
    account,
    connected,
    network,
    disconnect,
    signAndSubmitTransaction,
  } = useWallet();


  //export default  DialogPosition = (props) => {
  const userBalance = useSelector((state: any) => state.clientReduxStore.balance)*0.00000001;
  const userContractBalance = useSelector((state: any) => state.clientReduxStore.ctbalance);
  const userMarginBalance = useSelector((state: any) => state.clientReduxStore.margin)*0.00000001;
  const userSideLong = useSelector((state: any) => state.clientReduxStore.sidelong);
  const userIndexPosition = useSelector((state: any) => state.clientReduxStore.indexPosition);
  const userSmartTableLength = useSelector((state: any) => state.clientReduxStore.smartTableLength);
  const userAvailable = useSelector((state: any) => state.clientReduxStore.available);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    //textAlign: 'center',
    //color: theme.palette.text.secondary,
  }));
  
let sideLS='';
let opsideLS='';
if (userContractBalance>0){
  if (userSideLong){
    sideLS='BUY';
    opsideLS='Short';
  }else{
    sideLS='SELL';
    opsideLS='Long';
  }
}else{
  sideLS='-';
  opsideLS='-';
}



 
  const submitClosePosition = async () => {
    if (!account || !network) return;
  try {
    let howmany = userContractBalance;
    let lev=100;
    let bs=!userSideLong;

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: DXBX + "::just::said_it", //`${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
        typeArguments: [],
        functionArguments: [lev,howmany,bs],
      }
    });
    await aptosClient.waitForTransaction({ transactionHash: response.hash });

  }catch(error:any){
    console.error(error);
  }
}

const closePosition = () => {
  console.log('closePosition',userContractBalance);
  if(userContractBalance>0){
    submitClosePosition();
  }
}

let isSmall=false;

 if (width<767){
    isSmall=true;
  }

 return(
    <div className='dialogposition' >
     {!isSmall && ( <div className='dialogpositionlarge '>
    
    <Box sx={{ flexGrow: 1 }}>
        <Grid container  spacing={2} columns={15}>
        
          <Grid className='textnormal' xs={3}>
            <div>
              Trading Balance</div>
          </Grid>
          <Grid className='textnormal' xs={3}>
            <div>Available</div>
          </Grid>
        <Grid className='textnormal' xs={3}>
            <div >Contract Margin</div>
          </Grid>
          
          <Grid className='textnormal' xs={3}>
            <div>Leverage</div>
          </Grid>
          <Grid className='textnormal' xs={2}>
            <div>Contract <Button className='btnClose' onClick={() => {closePosition(); }} >Close</Button></div>
          </Grid>
          <Grid className='textnormal' xs={1}>
            <div></div>
          </Grid>
    {connected && (<>
          <Grid xs={3}>
            <div className='texthighlighted'>{ ((userBalance+userMarginBalance)).toFixed(4) }</div>
          </Grid>
          <Grid className='textnormaldata' xs={3}>
            <a>{(userBalance).toFixed(4)}</a>
          </Grid>
          <Grid className='textnormaldata' xs={3}>
            <a>{userMarginBalance.toFixed(4)}</a>
          </Grid>
          
          <Grid  xs={3}>
            <div className='texthighlighted'>{ (userContractBalance/(userBalance+userMarginBalance)).toFixed(0) } X</div>       
          </Grid>
          <Grid  xs={2}>
            <div className='texthighlighted'>{sideLS}{' '}{userContractBalance}      </div>   
          </Grid>
          <Grid xs={1}>
           
          </Grid> </>)}
        </Grid>
  </Box>

  </div>)}
  {isSmall && ( <container > <div className='dialogpositionsmall'>
  <table className='dialogpositionsmall'>
  <tbody>
    <tr>
      <th className='textnormal' scope="row">Trading Balance</th>
      <td className='textnormaldata '>        { ((userBalance+userMarginBalance)).toFixed(4) }<img  className="aptlogo" src="Aptos_mark_WHT.svg"/></td>
      <th className='textnormal' scope="row">Contracts<Button className='btnClose' onClick={() => {closePosition(); }} >Close</Button></th>
      <td className='textnormaldata'>{sideLS}{' '}{userContractBalance}  </td>
      
      
    </tr>
    <tr>
    <th className='textnormal' scope="row">Leverage</th>
      <td className='textnormaldata'>{ (userContractBalance/(userBalance+userMarginBalance)).toFixed(0) }  X</td>
      <th className='textnormal' scope="row">Margin</th>
      <td className='textnormaldata'>{userMarginBalance.toFixed(5)}</td>
    </tr>
    
    
    </tbody>
</table>

  </div></container>)}
</div>

 )
  }
  export default DialogPosition;