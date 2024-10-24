import React, { FC, useState} from 'react';
import { useSelector } from "react-redux";
import { Button} from 'react-bootstrap';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient} from '../../aptosClient.ts';
import { DXBX } from '../../aptosClient.ts';
import useWindowDimensions from '../../useWindowDimensions';
import CountUp from "react-countup";
import { TypeTagParser } from 'aptos';

const aptosClient = getAptosClient();
interface DialogPositionProps { }
const DialogPosition: FC<DialogPositionProps> = () => {
  const { width } = useWindowDimensions();
  const {
    account,
    connected,
    network,
    signAndSubmitTransaction,
  } = useWallet();
  const userBalance = useSelector((state: any) => state.clientReduxStore.balance) * 0.00000001;
  const userContractBalance = useSelector((state: any) => state.clientReduxStore.ctbalance);
  const userMarginBalance = useSelector((state: any) => state.clientReduxStore.margin) * 0.00000001;
  const userSideLong = useSelector((state: any) => state.clientReduxStore.sidelong);
  const indexValue = useSelector((state: any) => state.clientReduxStore.lastRandomVal);
  let mycolor = '#0000';
  const [lastUserBalance,setLastUserBalance]=useState(0);
  const [myhStyle,setMyhStyle]=useState('hgreen');

let sideLS='';
let opsideLS='';
let sideNumber=0;
if (userContractBalance>0){
  if (userSideLong){
    sideLS='BUY';
    opsideLS='Short';
    sideNumber=1;
  }else{
    sideLS='SELL';
    opsideLS='Long';
    sideNumber=-1;
  }
}else{
  sideLS='-';
 
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
 
  
  let switchs:boolean = false;

  let myHealthStyle = {}; 
  let toPrint=0;
  let toPrint10x=0;
  let mytempVal=0;
//  const [toprint,setToPrint] = React.useState(0);
  
  
  function onChange() {
  
    
    toPrint=((1-(sideNumber*userBalance)/userContractBalance)*indexValue);

    toPrint10x=((1+(10*sideNumber*userBalance)/userContractBalance)*indexValue);

    if (!isFinite(toPrint)){
      toPrint=0;
    }

    let myvalue=userContractBalance/(userBalance+userMarginBalance);
    let myhStyle;
    let myVal=0;
    

    if(myvalue<25){
      myhStyle='hgreen';
      myVal=0;
    }else if(myvalue<35){
      myhStyle='hg1';
      myVal=1;

    } else
    if(myvalue<45){
      myhStyle='hg2';
      myVal=2;
    } else
    if(myvalue<55){
      myhStyle='hg3';
      myVal=3;
    } else
    if(myvalue<65){
      myhStyle='hg4';
      myVal=4;
    }else if(myvalue<75){
      myhStyle='hg5';
      myVal=5;
    }else if(myvalue<85){
      myhStyle='hg6';
      myVal=6;
    }else   if(myvalue<200){
      myhStyle='hg7';
      myVal=7;
    }
    else{
      myhStyle='hgreen';
      myVal=0;
    }

    if(isSmall){
      myhStyle=myhStyle+' texthighlightedmobile';
    } else{
      myhStyle=myhStyle+' texthighlighted';
    }
    if (mytempVal!=myVal){
      mytempVal=myVal;
      if ("vibrate" in navigator) {
        navigator.vibrate(100);
      }
    }
    myHealthStyle=myhStyle;
    if (switchs) {
      switchs= false;
    //  document.querySelector('.dialogpositionlarge').className = 'fadeInSell';
    } else {
      switchs = true;
      //    document.querySelector('.fadeInSell').className = 'dialogpositionlarge fadeInBuy';
  }
    
  }

 return(
    <div >
     {!isSmall && ( <div className='dialogpositionlarge'>
    
    <Box sx={{ flexGrow: 1 }}>
        <Grid container  spacing={2} columns={15} >
        
          
          <Grid className='textnormal' xs={2}>
            <div>Available</div>
          </Grid>
        <Grid className='textnormal' xs={2}>
            <div >Contract Margin</div>
           </Grid>
           <Grid className='textnormal' xs={2}>
          
            <div>Leverage</div>
          </Grid>
          <Grid className='textnormal' xs={2}>
          <div>
              Trading Balance</div>
          </Grid>
          <Grid className='textnormal' xs={2}>
            <div>Contract <Button className='btnClose' onClick={() => {closePosition(); }} >Close</Button></div>
          </Grid>
          <Grid className='textnormal' xs={2}>
            <div>Liq EST.</div>
          </Grid>
          <Grid className='textnormal' xs={2}>
            <div>10X EST.</div>
          </Grid>
          <Grid className='textnormal' xs={1}>
            <div></div>
          </Grid>
    {connected && (<>
          
          <Grid className='textnormaldata' xs={2}   onChange={onChange()}>
            {(userBalance).toFixed(4)}
          </Grid>
          <Grid className='textnormaldata' xs={2}>
            {userMarginBalance.toFixed(4)}
             </Grid>
             
          
          <Grid  xs={2}>
            <div className={myHealthStyle}>{ (userContractBalance/(userBalance+userMarginBalance)).toFixed(0) } X</div>       
          </Grid>
          <Grid xs={2} className="texthighlightedXX">
               
                <CountUp 
              start={0}
              end={userBalance+userMarginBalance}
              redraw={false}
              duration={1}
              separator=" "
              decimals={4}
              decimal="."
              prefix=""
              suffix=""
            ></CountUp>
          </Grid>
          <Grid  xs={2}>
            <div className= {myHealthStyle}> {sideLS}{' '}{userContractBalance}      </div>   
          </Grid>
          <Grid  xs={2}>
            <div className={myHealthStyle} >{toPrint.toFixed(2)}      </div>   
          </Grid>
          <Grid  xs={2}>
            <div className={myHealthStyle} >{toPrint10x.toFixed(2)}      </div>   
          </Grid>
           </>)}
        </Grid>
  </Box>

  </div>)}
  {isSmall && ( <div className='dialogpositionsmall'>
  
        <Grid container  spacing={1} >
                  
        
           <Grid className='textnormal' xs={4}>
            <div>
              Trading Balance</div>
          </Grid>
          
          <Grid className='textnormal' xs={3}>
            <div>Leverage</div>
          </Grid>
          <Grid className='textnormal' xs={3}>
            <div>Contract <Button className='btnClose' onClick={() => {closePosition(); }} >Close</Button></div>
           </Grid>
           <Grid className='textnormal' xs={2}>
            <div>Liq EST.</div>
          </Grid>
          
    {connected && (<>
          
        
             <Grid xs={4} className="texthighlightedXX" style={{ marginLeft: '15px' } } onChange={onChange()}>
               
                <CountUp 
              start={0}
              end={userBalance+userMarginBalance}
              redraw={false}
              duration={1}
              separator=" "
              decimals={4}
              decimal="."
              prefix=""
              suffix=""
                 ></CountUp>
               
          </Grid>
          
          <Grid  xs={3}  >
            <div className={myHealthStyle} >{ (userContractBalance/(userBalance+userMarginBalance)).toFixed(0) } X</div>       
          </Grid>

          <Grid  xs={3}>
            <div className={myHealthStyle}>{sideLS}{' '}{userContractBalance}      </div>   
         
          </Grid>
             <Grid xs={1}>
                           <div className={myHealthStyle}  >            
          {toPrint.toFixed(0)} 
          </div>
          
          </Grid>
          
          
          
           </>)}
        </Grid>
  


  </div>)}
</div>

 )
  }
  export default DialogPosition;