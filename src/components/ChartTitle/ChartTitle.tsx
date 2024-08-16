import React, { FC, useRef,createRef } from 'react';
import styles from './ChartTitle.module.css';
import { useSelector  } from "react-redux";
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Container } from 'react-bootstrap';
import useWindowDimensions from '../../useWindowDimensions';

interface ChartTitleProps {}

const ChartTitle: FC<ChartTitleProps> = (props) => {
  const { height, width } = useWindowDimensions();
  const titleContainerRef = createRef();
  const lastIndex = useSelector((state: any) => state.clientReduxStore.lastRandomVal);
  const lastChange = useSelector((state: any) => state.clientReduxStore.lastRandomChange);
  const firstIndex = useSelector((state: any) => state.clientReduxStore.firstRandomVal);
  let myChange=(lastIndex-firstIndex)/firstIndex*100;  

  const {
    mySwidth,
    
  } = props;

  let indexvalueTh='indexvalue';
  let indexChange =0;
  if(lastChange>0){
    indexvalueTh = 'indexup';
  }else{
    indexvalueTh = 'indexdown';
  } 


    let mystyle='indextitle';

  if (width < 767){
      mystyle =  'indextitlesmall';   
  }
    
 //console.log('mystyle',width);

  return (
  <div className={styles.charttitle} ref={titleContainerRef}>
<Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={18}>
      
        <Grid xs={3}>
          <div ><div className={indexvalueTh} xs={1}>
         {lastIndex.toFixed(4) }
        </div>

        <div className='indexchange'>
         {myChange.toFixed(4)+'%'}
        </div></div>
        </Grid>
        <Grid xs={15}>
                 <div className={mystyle}>
                 <img  className="aptlogo" src="Aptos_mark_WHT.svg"/>              
            APTOS random Index
          </div>

        </Grid>
        
        
       
      </Grid>
    </Box>






</div>

  );
  }

export default ChartTitle;
