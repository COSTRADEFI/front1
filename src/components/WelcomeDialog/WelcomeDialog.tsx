import React, { FC,useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styles from './WelcomeDialog.css';
import {
    setDialogWelcomeVisible
  } from "../../store.ts";
  import useWindowDimensions from '../../useWindowDimensions';

import { getNetwork } from "../../aptosClient.ts";
interface Props {
}

export const WelcomeDialog: FC<Props> = () => {
    const { height, width } = useWindowDimensions();
    const dispatch = useDispatch();
   
    const dialogWelcomeVisible = useSelector((state) => state.clientReduxStore.dialogWelcomeVisible);
   // console.log("WelcomeDialog",dialogWelcomeVisible);

    if (dialogWelcomeVisible===false) {
        return null;
    }

    const closeMePlease = ( ) => async () => 
    {
       dispatch(setDialogWelcomeVisible(false));
    //   console.log("closeMePlease");
    }
    let mystyle='maincont';
    if (width < 767){
        mystyle =  'maincontsmall';   
    }

    let myNetwork = getNetwork();
    return (
        <div  className={mystyle}>
            <div className={styles.welcomeDialogContainer}>
                <div className={styles.welcomeDialogTitle}>
                    <h1>TRUE Random Index Trading</h1>
                </div>
                <div className={styles.welcomeDialogBody}>
                    <p>1-Connect your wallet using {myNetwork }</p>
                    <p>2-Get some coins from Faucet (if needed)</p>
                    <p>3-Create a Deposit account</p>
                    <p>4-Deposit 1 APT ({myNetwork })</p>
                    <p>5-BUY or SELL the index </p>
                    <p>6-Select your Leverage</p>
                    <p>7-Submit your Order</p>
                    <p></p>
                    <p>You will never loose more than your DEPOSIT</p>
                    <a href="https://x.com/costrade_fi">
                    <div className='contactdiv' >
                    <img className="xlogo" src="X_logo_2023_(white).png"/>@costrade_fi
                    </div>
                    </a>
                    
                </div>
                <div className='welcomeDialogFooter' >
                    
                    <button className='getStartedButton' onClick={closeMePlease()}>Got it!</button>
                </div>
            </div>
        </div>
        );
};

export default WelcomeDialog;