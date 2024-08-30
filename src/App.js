import { createChart, ColorType,LineStyle,CrosshairMode,CandlestickStyleOptions } from 'lightweight-charts';
import React, { useEffect, useRef,useState,useMemo } from 'react';
import { ViewRequest, Provider, AptosClient ,Network} from "aptos";
import { BuySellDialog } from './components/BuySellDialog/BuySellDialog.tsx';
import { Button,Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";

import { DXBX } from './aptosClient.ts';
import InfoBar from './components/InfoBar/InfoBar.tsx';
import  DialogPosition  from './components/DialogPosition/DialogPosition.tsx';
import ChartTitle from './components/ChartTitle/ChartTitle.tsx';
import { WelcomeDialog } from './components/WelcomeDialog/WelcomeDialog.tsx';
import { TradeEvents } from './components/TradeEvents/TradeEvents.jsx';
import { getAptosClient } from "./aptosClient.ts";


import {
    newRandomVal,
    firstRandomVal,
    newResultVal,
    setAnimationVal,
    updateBalanceVal,
    setDialogWelcomeVisible,
} from "./store.ts";

import './App.css';
import { Bool } from '@aptos-labs/ts-sdk';

//const DXBX = '0x7cfadf121d363b27b55636dbe10b172ec58a875baa48c0c08a7e5eaad4e4f981';
//const DXBX = '0x64b5f94e764c3cc23a1f8c09be4e0b2c7d16d2f29e62ef744e8d533c664f0bd6';

const UPCOLOR='#0089e9';
const DOWNCOLOR='#8a282e';

export const ChartComponent = props => {
    const lastrandVal = useSelector((state: any) => state.clientReduxStore.lastRandomVal);
    let mylastindex=0;
    const dispatch = useDispatch();
    const {
      colors: {
        backgroundColor = '#111414',
            //lineColor = '#2962FF',
            textColor = '#A9A9A9',
            areaTopColor = 'red',
                
        } = {},
        } = props;

    const chartContainerRef = useRef();
    let mycalcindextemptes = 100;
    let oldnumber = 0;
    let oldtimestamp = 0;
    let lastCandle;

    useEffect(
        () => {
            

            const handleResize = () => {
                //let myWidth = chartContainerRef.current.clientWidth * 5 / 5;
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
                // (chartContainerRef.current.clientWidth > 767) ? (myWidth = myWidth - 320) : (myWidth =  chartContainerRef.current.clientWidth);
                // (chartContainerRef.current.clientWidth > 767) ? ( myHeight = 550 ) : ( myHeight = Math.max(150,myHeight/1));
                
                chart.applyOptions({ width: myWidth ,height : myHeight,    });
            };

            function gaussianRandom(mean=0, stdev=3) {
                const u = 1 - Math.random(); // Converting [0,1) to (0,1]
                const v = Math.random();
                const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
                // Transform to the desired mean and standard deviation:
              //  console.log("gaussian random",z);
              //  console.log("gaussian random returns",z * stdev + mean);
                return z * stdev + mean;
            }

            function calc(entrynumber:number){
            var count  = 2;     // # of gaussian values to generate
            var values = new Array(count);
            values[0]=entrynumber;
            for(var i = 1; i < count; ++i) {
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
                var count  = 2;     // # of gaussian values to generate
                var values = new Array(count);
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
           //     console.log('init',mytURL);
                const response = await fetch(mytURL);

           
                const body = await response.text();
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
               candlestickSeries.setData( myDataCandleArray.reverse());
            }

            
            async function fetch_random() {
                function updateCandle(newnumber) { 
                    //if (newnumber !== oldnumber) 
                    {
                    oldnumber = newnumber;
                    let res = generateOneData(newnumber);
                    candlestickSeries.update(res);
                }

                }

                let mynetwork=getAptosClient().config.network;
                const mytURL= 'https://api.'+mynetwork+'.aptoslabs.com/v1/accounts/'+DXBX+'/resource/'+DXBX+'::just::RandomIndex';
                const response = await fetch(mytURL);
                const body = await response.text();
                let tbody = JSON.parse(body);

                //let mynumber = tbody?.data.my_message * 0.00001;
                let mynumber = tbody?.data.price * 0.00001;
                  //console.log('fetch_random',mynumber,mylastindex);
                
                let tf=false;
                if (mynumber !== mylastindex){
                    mylastindex=mynumber;
                    tf=true;
                  //  console.log('fetch_random anime',mynumber,mylastindex);
                }
              
                //  let tf=(mynumber!=lastrandVal)? true:false;

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
            } 

            const view_random = async () => {
                const prov = new Provider(getAptosClient().config.network);
                const payload: ViewRequest = {
                    function: `${DXBX}::prob_distribution::get_nd_random_number`,
                    type_arguments: [],
                    arguments: [],
                };
                const viewresponse = await prov.view(payload);
                let mynumber = 0;
                let mysign = 1;
                if (viewresponse[0].positive) {
                    mynumber = viewresponse[0].value;
                } else {
                    mynumber = -viewresponse[0].value;
                    mysign = -1;
                }
                if (mynumber !== oldnumber) {
                    oldnumber = mynumber;
                    let toprint = mynumber;
                    mynumber = mynumber / 1 * 1e-21;
                    mycalcindextemptes = mycalcindextemptes * ((1 + mysign * 1 / 200 * Math.sqrt(Math.exp(mynumber))));
                    let res = generateOneData(mycalcindextemptes);
                    candlestickSeries.update(res);
                }
            } 

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
            const data =[];
            const intervalID = setInterval(() => {
               // view_random(); 
                let r=  fetch_random();
              //   console.log('update v', 0);
            }, 333);
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
                chart.remove();
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
    const [myWidth,setMyWidth]=useState(0);


    const dialogWelcomeVisible = useSelector((state: any) => state.clientReduxStore.dialogWelcomeVisible);
    //const dispatch = useDispatch();

    
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
    return (
    <div className='myApp' >
        {<WelcomeDialog> </WelcomeDialog>}
        <div onClick={() => { setshowModalDlg(false) }}>
        {isDesktop && <InfoBar /> }
            <div className='chartcompo'>
            <ChartTitle mySwidth={myWidth}></ChartTitle>
                <ChartComponent {...props} >
                </ChartComponent>
            </div>
                            {isDesktop && <div className='BSDialog' >
                            <BuySellDialog  setDlgBuy={ setDlgBuy} isDlgBuy={isDlgBuy} /></div>}
            </div>
            <div >
            
            {isDesktop ? 
                (<div onClick={() => { setshowModalDlg(false) }}> <div className='deskViewPosition'><DialogPosition /></div>
                    
                </div>
                
                )
                : (
                    <div className='mobileViewPosition' onClick={() => { setshowModalDlg(false) }} >
                        <DialogPosition/>
                    </div>
            )
            }
            
            {isDesktop &&
                <div className='myeventsctn'>
                    <TradeEvents>
                    </TradeEvents>
                </div>
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
