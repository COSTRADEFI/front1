import React, { FC, createRef } from 'react';
import styles from './ChartTitle.module.css';
import { useSelector  } from "react-redux";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import useWindowDimensions from '../../useWindowDimensions';
import Tooltip from '@mui/material/Tooltip';

interface ChartTitleProps {}

const ChartTitle: FC<ChartTitleProps> = (props) => {
  const {  width } = useWindowDimensions();
  const titleContainerRef = createRef();
  const lastIndex = useSelector((state: any) => state.clientReduxStore.lastRandomVal);
  const lastChange = useSelector((state: any) => state.clientReduxStore.lastRandomChange);
  const firstIndex = useSelector((state: any) => state.clientReduxStore.firstRandomVal);
  let myChange=(lastIndex-firstIndex)/firstIndex*100;  
  // const {
  // } = props;
  let indexvalueTh='indexvalue';
  if(lastChange>0){
    indexvalueTh = 'indexup';
  }else{
    indexvalueTh = 'indexdown';
  } 
  let mystyle='indextitle';
  if (width < 767){
      mystyle =  'indextitlesmall';   
  }
  return (
  <div className={styles.charttitle} ref={titleContainerRef}>
  <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={18}>
      
        <Grid xs={3}>
          <div ><div className={indexvalueTh} xs={1}>
         {lastIndex.toFixed(2) }
        </div>
        <div className='indexchange'>
         {myChange.toFixed(2)+'%'}
        </div></div>
          </Grid>
          <Tooltip title="The index value is randomly generated and changes every 1 seconds" followCursor>
        <Grid xs={15}>
                 <div className={mystyle}>
                 <img  className="aptlogo" src="Aptos_mark_WHT.svg" alt="logo aptos"/>              
            APTOS randomly generated Index
          </div>
            </Grid>
            </Tooltip>
      </Grid>
    </Box>
</div>
  );
}

export default ChartTitle;
