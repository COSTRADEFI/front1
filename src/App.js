import { createChart, ColorType,LineStyle,CrosshairMode,CandlestickStyleOptions } from 'lightweight-charts';
import React, { useEffect, useRef,useState,useMemo } from 'react';
import { ViewRequest, Provider, AptosClient ,Network} from "aptos";
import { BuySellDialog } from './components/BuySellDialog/BuySellDialog.tsx';
import { Button,Col,Modal, Row } from 'react-bootstrap';
//import Button from '@mui/material/Button';
import { useSelector, useDispatch } from "react-redux";
import { Aptos, AptosConfig, queryIndexer, throwTypeMismatch } from "@aptos-labs/ts-sdk";
import { DXBX } from './aptosClient.ts';
import InfoBar from './components/InfoBar/InfoBar.tsx';
import  DialogPosition  from './components/DialogPosition/DialogPosition.tsx';
import ChartTitle from './components/ChartTitle/ChartTitle.tsx';
import { WelcomeDialog } from './components/WelcomeDialog/WelcomeDialog.tsx';
import { TradeEvents } from './components/TradeEvents/TradeEvents.jsx';
import { getAptosClient } from "./aptosClient.ts";
import TrollCommunity from './components/TrollCommunity/TrollCommunity.tsx';
import { TestMuiDialogBoxes } from './components/testMuiDialogBoxes/testMuiDialogBoxes.tsx';
import Tooltip from '@mui/material/Tooltip';
import { HelpSequence, MyHelpSequence } from './components/HelpAnime/HelpSequence.js';
import LeaderBoardOrLP from './components/LeaderBoardOrLP/LeaderBoardOrLP.tsx';

import { useWallet } from "@aptos-labs/wallet-adapter-react";

import {
    newRandomVal,
    firstRandomVal,
    newResultVal,
    setAnimationVal,
    updateBalanceVal,
    setDialogWelcomeVisible,
} from "./store.ts";

import './App.css';

const UPCOLOR='#0089e9';
const DOWNCOLOR = '#8a282e';


export const ChartComponent = props => {
    const lastrandVal = useSelector((state: any) => state.clientReduxStore.lastRandomVal);
    let mylastindex=0;
    const dispatch = useDispatch();
    const {
        colors: {
            backgroundColor = '#111414',
            textColor = '#A9A9A9',
            areaTopColor = 'red',
            } = {},
        } = props;

    const chartContainerRef = useRef();
    let mycalcindextemptes = 100;
    let oldnumber = 0;
    let oldtimestamp = 0;
    let lastCandle;

  
    let myclient = getAptosClient();
  
    const {loadingIndex,setLoadingIndex} = useState(false);
    const [indexPrice,setIndexPrice] = useState(0); 



    useEffect(
        () => {
            

            const handleResize = () => {
                let myWidth = chartContainerRef.current.clientWidth;
                let myHeight = chartContainerRef.current.clientHeight;
                if (chartContainerRef.current.clientWidth > 767){
                    myWidth = myWidth - 260;
                    myHeight = 550;
                }else{
                    myWidth =  myWidth
                    if (chartContainerRef.current.clientWidth < 375){
                        myHeight = 220;
                    }else{
                        myHeight = Math.max(350,myHeight/1)
                    }
                }
                chart.applyOptions({ width: myWidth ,height : myHeight,    });
            };

            function gaussianRandom(mean=0, stdev=3) {
                const u = 1 - Math.random(); // Converting [0,1) to (0,1]
                const v = Math.random();
                const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
                return z * stdev + mean;
            }

            function calc(entrynumber:number){
            let count  = 2;     // # of gaussian values to generate
            let values = new Array(count);
            values[0]=entrynumber;
            for(let i = 1; i < count; ++i) {
                let myval=gaussianRandom(0,0.5)/400;
                let mysign=0;
                if (myval>0){
                mysign=1;
                }else{
                mysign=-1;
                }
                values[i] = values[i-1]*(1+mysign*Math.sqrt(Math.exp(myval))*1/100);
            }

            let rmylastVal=values[count-1];
            return rmylastVal;
            }
            
            function calc_init(entrynumber:number){
                let count  = 2;     // # of gaussian values to generate
                let values = new Array(count);
                values[0]=entrynumber;
                for(var i = 1; i < count; ++i) {
                    let myval=gaussianRandom(0,2)/100;
                    let mysign=0;
                    if (myval>0){
                    mysign=1;
                    }else{
                    mysign=-1;
                    }
                    values[i] = values[i-1]*(1+mysign*Math.sqrt(Math.exp(myval))*1/100);
                }

            let rmylastVal=values[count-1];
            return rmylastVal;
            }
            
                
            function calc_signed(entrynumber:number,isUp:boolean){
                var count  = 2;     // # of gaussian values to generate
                var values = new Array(count);
                values[0]=entrynumber;
                for(var i = 1; i < count; ++i) {
                    let myval=gaussianRandom(0,2)/2;
                    let mysign=0;
                    if (isUp>0){
                    mysign=1;
                    }else{
                    mysign=-1;
                    }
                    values[i] = values[i-1]*(1+mysign*Math.sqrt(Math.exp(myval))*1/100);
                }

            let rmylastVal=values[count-1];
            return rmylastVal;
            }
            
                
            function calc_signed(entrynumber:number,isUp:boolean){
                var count  = 2;     // # of gaussian values to generate
                var values = new Array(count);
                values[0]=entrynumber;
                for(var i = 1; i < count; ++i) {
                    let myval=gaussianRandom(0,2)/2;
                    let mysign=0;
                    if (isUp>0){
                    mysign=1;
                    }else{
                    mysign=-1;
                    }
                    values[i] = values[i-1]*(1+mysign*Math.sqrt(Math.exp(myval))*1/100);
                }

            let rmylastVal=values[count-1];
            return rmylastVal;
            }


            async function init_random() {
                let myDataCandleArray=[];
                
                const date = new Date();
                const mytime = parseInt(date.getTime() / 1000);
                
                let mynetwork=getAptosClient().config.network;

                const mytURL= 'https://api.'+mynetwork+'.aptoslabs.com/v1/accounts/'+DXBX+'/resource/'+DXBX+'::just::RandomIndex';   
             //   console.log('init',mytURL);
                const response = await fetch(mytURL);

           
                const body = await response.text();
               // console.log('init_random',body);
                let tbody = JSON.parse(body);
                //let mynumber = tbody?.data.my_message * 0.00001;
                let mynumber = tbody?.data.price * 0.00001;
               // console.log('init_random',mynumber);

                dispatch(firstRandomVal( mynumber ));
                mylastindex=mynumber;
                /// from mynumber create an array of 3 rand 
                const createCandle = (val, time) => ({
                    time,
                    open: val,
                    high: calc_signed(val,true),
                    low: calc_signed(val,false),
                    close: calc(val),
                });
               for (let i=0;i<220;i++){
                    const candle = createCandle(mynumber, mytime-i);
                    myDataCandleArray.push(candle);
                    mynumber=calc_init(mynumber);
               } 
                candlestickSeries.setData(myDataCandleArray.reverse());
                fetchIndex();
                
            }

            function updateCandle(newnumber) { 
                    oldnumber = newnumber;
                    let res = generateOneData(newnumber);
                    candlestickSeries.update(res);
            }
            
            async function fetch_random() {
                // function updateCandle(newnumber) { 
                //     oldnumber = newnumber;
                //     let res = generateOneData(newnumber);
                //     candlestickSeries.update(res);
                // }

                

                let mynetwork=getAptosClient().config.network;
                const mytURL= 'https://api.'+mynetwork+'.aptoslabs.com/v1/accounts/'+DXBX+'/resource/'+DXBX+'::just::RandomIndex';
                const response = await fetch(mytURL);
                const body = await response.text();
                let tbody = JSON.parse(body);
console.log('fetch_random',tbody);
                //let mynumber = tbody?.data.my_message * 0.00001;
                let mynumber = tbody?.data?.price * 0.00001;
                  //console.log('fetch_random',mynumber,mylastindex);
                
                let tf=false;
                if (mynumber !== mylastindex){
                    mylastindex=mynumber;
                    tf=true;
                }
                dispatch(newRandomVal( mynumber ));
                updateCandle(mynumber);

                if (tf)
                {
                    setTimeout(() => {
                        updateCandle(calc(mynumber));
                    }, Math.random()*1000);
                    setTimeout(() => {
                        updateCandle(calc(mynumber));
                    }, Math.random()*1000);
                    setTimeout(() => {
                        updateCandle(calc(mynumber));
                    }, Math.random()*1000);
                }
                //await fetchIndex();
            }

            const fetchIndex = async () => {
  
                try {
  
            const datafetched = await lgetrandomIndex();
            setIndexPrice(datafetched.events[0].data.price);
            dispatch(newRandomVal( indexPrice ));
            let mynumber = datafetched.events[0].data.price*0.00001;
                let tf=false;
                if (mynumber !== mylastindex){
                    mylastindex=mynumber;
                    tf=true;
                }
                dispatch(newRandomVal( mynumber ));
                updateCandle(mynumber);
                if (tf)
                {
                    setTimeout(() => {
                        updateCandle(calc(mynumber));
                    }, Math.random()*1000);
                    setTimeout(() => {
                        updateCandle(calc(mynumber));
                    }, Math.random()*1000);
                    setTimeout(() => {
                        updateCandle(calc(mynumber));
                    }, Math.random()*1000);
                }
                } catch (error) {
                    //setLoadingIndex(false);
            console.error('Error fetching index Values: ', error);
           // Handle errors gracefully here
                } finally {
                    //setLoadingIndex(false);
                    setTimeout(() => {
                        fetchIndex();
                    }, 333);
            
            
        }
    };
           // fetchIndex();

  const lgetrandomIndex = async ( ) => {
  const objects = await myclient.queryIndexer({
      query: {
        query: `query MyQuery {
  events(
    where: {indexed_type: {_eq: "0x13a9f1a109368730f2e355d831ba8fbf5942fb82321863d55de54cb4ebe5d18f::just::RandomIndexEvent"}}
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

            function generateOneData(newindexVal: number) { 
                const createCandle = (val, time) => ({
                    time,
                    open: val,
                    high: val,
                    low: val,
                    close: val,
                });

                const updateCandle = (candle, val) => ({
                    time: candle.time,
                    close: val,
                    open: candle.open,
                    low: Math.min(candle.low, val),
                    high: Math.max(candle.high, val),
                });

                const date = new Date();
                const time = parseInt(date.getTime() / 1000);
                const diffTime= time - oldtimestamp;
                if ( diffTime > 1  ) {
                    const candle = createCandle(newindexVal, time);
                    oldtimestamp = time;
                    lastCandle = candle;
                } else { 
                    lastCandle= updateCandle(lastCandle, newindexVal);
                }
            return lastCandle;
            }
            
            const chart = createChart(chartContainerRef.current);
           
            let myWidth = chartContainerRef.current.clientWidth;
            let myHeight = chartContainerRef.current.clientHeight;
            if (chartContainerRef.current.clientWidth > 767){
                myWidth = myWidth - 260;
                myHeight = 550;
            }else{
                myWidth =  myWidth
                if (chartContainerRef.current.clientWidth < 375){
                    myHeight = 220;
                }else{
                    myHeight = Math.max(350,myHeight/1)
                }

            }

            // (chartContainerRef.current.clientWidth > 767) ? (myWidth = myWidth - 320) : (myWidth =  myWidth);
            // (chartContainerRef.current.clientWidth > 767) ? ( myHeight = 550 ) : ( myHeight = Math.max(150,myHeight/1));

            chart.applyOptions({
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: myWidth,
                height: myHeight,
            
                grid: {
                    vertLines: { color: '#222' },
                    horzLines: { color: '#222' },
                },
                crosshair: {
                    // Change mode from default 'magnet' to 'normal'.
                    // Allows the crosshair to move freely without snapping to datapoints
                    mode: CrosshairMode.Normal,
               
                    // Vertical crosshair line (showing Date in Label)
                    vertLine: {
                        width:1,
                        color: '#C3BCDB44',
                        style: LineStyle.Dashed,
                        labelBackgroundColor: '#C3BCDB44',
                        crosshairMarkerVisible: true,
                    },
                    // Horizontal crosshair line (showing Price in Label)
                    horzLine: {
                        width: 1,
                        color: '#C3BCDB44',
                        style: LineStyle.Dashed,
                        labelBackgroundColor: '#C3BCDB44',
                        crosshairMarkerVisible: true,
                    },
                    // draw a cross at intersection
                    crosshairMarkerVisible: true,
                    crosshairMarkerRadius: 12,
                    
                    // draw a circle at intersection

                    // pointBackgroundColor: 'white',
                    // pointBorderColor: 'white',
                    // pointRadius: 30,

                },
                timeScale: {
                    width:1,
                    borderColor: '#C3BCDB44',
                    timeVisible: true,
                    secondsVisible: false,
                                    
                    
                },
                rightPriceScale: {
                    borderColor: '#C3BCDB44',
                    borderVisible:false,
                },
           
                
            });
         
            //chart.timeScale().fitContent();
            let mySpacingtemp=8;
            let myOffsettemp=18;
            if (myWidth < 375){
                mySpacingtemp=4;
                myOffsettemp=8;
            }

            chart.timeScale().applyOptions({
                //borderColor: 'red',
                rightOffset: myOffsettemp,
                barSpacing: mySpacingtemp,
                fixLeftEdge: false,
                lockVisibleTimeRangeOnResize: true,
                timeVisible: true,
                secondsVisible: false,
            });

            const candlestickSeries = chart.addCandlestickSeries();
            init_random();

            let myUpColor= getComputedStyle(document.documentElement).getPropertyValue('--positive-buy-color');
            let myDownColor= getComputedStyle(document.documentElement).getPropertyValue('--negative-sell-color');


            candlestickSeries.applyOptions({
                upColor: myUpColor, 
                downColor: myDownColor, 
                borderVisible: false,
                wickUpColor: myUpColor,
                wickDownColor: myDownColor,
                borderUpColor: myUpColor,
                borderDownColor: myDownColor,
                wickVisible: true,
            });
            const data = [];
            
           // const intervalID = setInterval(() => {
            //const intervalID = setTimeout(() => {
                
            
               // view_random(); 
                //    let r=  fetch_random();
                // if (loadingIndex === false) {
                //     fetchIndex();
                // }
              //   console.log('update v', 0);
         //   }, 933);
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.remove();
                //  clearTimeout(intervalID);
                //clearInterval(intervalID);
            };
        },    
    
    []
    );
    return (
        <div
            ref={chartContainerRef}
        />
    );
};

export const ChoiceComponent = props => { 
    const {
        setshowModalDlg,
        setDlgBuy,
    } = props;
    return (<div className='choicebs'>
        <div className='choicebuttons'>
        <Button className='choicebutton buybutton' onClick={() => { setshowModalDlg(true);setDlgBuy(true) }} >BUY</Button>
        <Button className='choicebutton sellbutton' onClick={() => { setshowModalDlg(true); setDlgBuy(false) }}>SELL</Button>
        </div>
    </div>);
};





export function App(props) {
    const [isDesktop, setDesktop] = useState(false);
    const [showModalDlg, setshowModalDlg] = useState(false);
    let isb= (Math.random() < 0.5)?true:false;
    const [isDlgBuy, setDlgBuy] = useState(isb);
    const [myWidth, setMyWidth] = useState(0);
    const [light, setLight] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    
    const dialogWelcomeVisible = useSelector((state: any) => state.clientReduxStore.dialogWelcomeVisible);
    //const dispatch = useDispatch();

    const dispatch=useDispatch();
    
    //dispatch(setDialogWelcomeVisible(true));
    //const dialogWelcomeVisible = useSelector((state) => state.dialogWelcomeVisible);

    useEffect(() => {
        let mywidth=window.innerWidth;
        setMyWidth(mywidth);
    if (window.innerWidth > 767) {
        setDesktop(true);
    } else {
        setDesktop(false);
    }

        const updateMedia = () => {
        
      if (window.innerWidth > 767) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
    }, []);
    
const showMePlease = ( ) => async () => 
  {
    dispatch(setDialogWelcomeVisible(true));
    
  }


    return (
            
      
    <div className='myApp' >
        {<WelcomeDialog props> </WelcomeDialog>}
        <div onClick={() => { setshowModalDlg(false) }}>
        {isDesktop && <InfoBar /> }
        {isDesktop &&  <Button className='buttonfooter'onClick={()=>setShowHelp(true)}> quickStart </Button>}
            <div className='chartcompo'>
            <ChartTitle mySwidth={myWidth}></ChartTitle>
                <ChartComponent {...props} >
                </ChartComponent>
                </div>
                
                            {isDesktop && <div className='BSDialog' >
                    <BuySellDialog setDlgBuy={setDlgBuy} isDlgBuy={isDlgBuy} />
                    <img  className="logoapp" src="logo192.png"/>
                 
                </div>                
                }
                
                
            </div>
            <div >
            
            {isDesktop ? 
                (<div onClick={() => { setshowModalDlg(false) }}> <div className='deskViewPosition'><DialogPosition /></div>
                    
                </div>
                
                )
                : (
                    <div className='mobileViewPosition' onClick={() => { setshowModalDlg(false) }} >
                        <DialogPosition/>
                        <img  className="logoapp" src="logo192.png"/>
                    </div>
            )
            }
            
                {isDesktop &&
                    <div>
                    <div>
                        
                <div className='myeventsctn'>
                    <TradeEvents>
                    </TradeEvents>
                    </div>
                    <div className='mytrolleventsctn'>
                    <TrollCommunity>
                    </TrollCommunity>
                            </div>
                            <div className='myleaderboardctn'>
                                <LeaderBoardOrLP />
                            </div>
                    </div>
                                    <HelpSequence
        sequence={MyHelpSequence}
        opentest={true}
        open={showHelp}
        onClose={() => setShowHelp(false)
        }
        
        
      /></div>
                        
                    }
                        
                    
            }
            
            </div>
            {showModalDlg && (<div className='clickablearea'> </div>)}
            {showModalDlg && (<div className='mobileBSDialog'> <BuySellDialog showModalDlg={showModalDlg} setshowModalDlg={setshowModalDlg} setDlgBuy={setDlgBuy} isDlgBuy={isDlgBuy} /></div>)}
            
            {!showModalDlg && (!isDesktop) && (<div > <ChoiceComponent showModalDlg={showModalDlg} setshowModalDlg={setshowModalDlg} setDlgBuy={setDlgBuy} isDlgBuy={isDlgBuy} /></div>  )}
            <div onClick={() => { setshowModalDlg(false) }}>
                
                {     (!isDesktop) &&  (<div className='notifsmall'> <InfoBar /> </div>)}
            </div>
     </div>
       
    );
}

export default App;
