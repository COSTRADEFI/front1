import React, { useRef, FC,useState } from 'react';
import styles from './BuySellDialog.module.css';
import { Button, Form,Row, Col, Container } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import FormRange from "react-bootstrap/FormRange";
import { useSelector, useDispatch } from "react-redux";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient} from '../../aptosClient.ts';
import { DXBX } from '../../aptosClient.ts';
import { ViewRequest,AptosAccount, Provider, Network} from "aptos";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";

export const BuySellDialog = (props) => {
 // const stakeValueRef = React.useRef();
  const [isDlgBuy, setIsDlgBuy] = useState(props.isDlgBuy);
  const [sliderValue, setSliderValue] = React.useState(50);

  //const [sliderStakeValue, setSliderStakeValue] = React.useState(1);
  
  const userBalance = useSelector((state: any) => state.clientReduxStore.balance);

  const {
    showModalDlg,
    setshowModalDlg,
    setDlgBuy,
  } = props;

  const aptosClient = getAptosClient();
  const dispatch = useDispatch();
  const {
    account,
    connected,
    network,
    disconnect,
    signAndSubmitTransaction,
  } = useWallet();

  let myStylebuy = {};
  let myStylesell = {};
  let buttonText='';
  let myStyleButton = {};

  
  const sliderStakeChanged = (value) => {
   // let myval=Math.max(1,value) *userBalance/100000000 ;

    let myval =(value*1.0 )+50;
    setSliderValue(Math.max(0,myval) );

   // setSliderStakeValue( parseInt(myval));
  }



  if (isDlgBuy === true) {
    myStylebuy = styles.buttonlongselected;
    myStylesell = styles.buttonneutral;
    buttonText = 'BUY ';
    myStyleButton = styles.buttonlongd;
  } else {
    myStylebuy = styles.buttonneutral;
    myStylesell = styles.buttonshortselected;
    buttonText = 'SELL ';
    myStyleButton = styles.buttonshortd;
  };


const submitTrade = async () => {
  if (!account || !network) return;



  try {
    let howmany = (userBalance*sliderValue/100000000).toFixed(0);// stakeValueRef.current.value;
    let lev=150;
    let bs=isDlgBuy;

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: DXBX + "::just::said_it", //`${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
        typeArguments: [],
        functionArguments: [lev,howmany,bs],
      }
    });
    await aptosClient.waitForTransaction({ transactionHash: response.hash });
    if (showModalDlg)
      props.setshowModalDlg(false);

  }catch(error:any){
    console.error(error);
  }
}

  function sendOrder() {
    submitTrade();
    
  }

      const [value1, setValue1] = useState(1);

return (
 
    <div className={styles.BuySellDialog}>
    <div className={styles.group_bsdlg_l1}>
    <Button className={myStylebuy} onClick={() => {
       // console.log('click');
        setIsDlgBuy(true);
      }}>
        BUY
      </Button>
    <Button className={myStylesell} onClick={() => {
       // console.log('click');
          setIsDlgBuy(false);
    }}>
        SELL
      </Button>
    </div>
    
    <div className={styles.group_bsdlg_l4}>
      <div className={styles.multexplain1}> Leverage  </div>
        <div className={styles.multexplain2}>{sliderValue }x</div>
        </div>
    
    <FormRange className={styles.formrange } value={sliderValue-50} onChange={(e => sliderStakeChanged(e.target.value))}></FormRange>
    <Container >
      <Row>
      < div className={styles.group_bsdlg_l4}>
    
 <div className={styles.numberinput}  >{ (userBalance*sliderValue/100000000).toFixed(0) }   <img  className="aptlogo" src="Aptos_mark_WHT.svg"/>    </div>

        <div className={styles.multexplain1}>  </div><div className={styles.multexplain11} >available balance: <div className={styles.multexplain111} >{(userBalance/100000000).toFixed(4)}</div></div>
        </div>
      </Row>
      <Row>
      <div className={styles.group_bsdlg_l4}>
    
        </div>
        </Row>
    </Container>
  
    
    
    <div>
    <Button className={myStyleButton}  onClick={() => {sendOrder();}}>
        {buttonText}
    </Button>
    </div>
    
    <div>
        {showModalDlg &&<Button bsPrefix={'smallbtndismiss'} className={styles.smallbutton} onClick={() => { setshowModalDlg(false) }}>
        dismiss
      </Button>
        }
    </div>
    </div>

  )
};
