import React,{useState,useRef,useCallback,useEffect } from 'react';
//import Button from '@mui/material/Button';
import { Button,Col,Modal, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import './testMuiDialogBoxes.css';
import styles from './testMuiDialogBoxes.css';
import Tooltip from '@mui/material/Tooltip';

import ConfettiExplosion from "react-confetti-explosion";
import { Grid, Paper } from "@material-ui/core";
import { newRandomVal } from '../../store.ts';


import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


interface Props {
}

const lootboxes = ['lootBobx1', 'looBobx2', 'lootBobx3', 'lootBobx4'];




function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

 function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 1000);
    return () => {
      clearInterval(timer);
    };


//    setProgress(50);

  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}





















export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  buysell: string;
}

function SimpleDialog(props: SimpleDialogProps) {
  const [isExploding, setIsExploding] = React.useState(false);
  const { onClose, selectedValue, open } = props;
  const [isVisible, setIsVisible] = useState(false);
  const handleClose = () => {
  onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };
  
  const indexValue = useSelector((state: any) => state.clientReduxStore.lastRandomVal) * 1.0;
  //const islong = useSelector((state: any) => state.clientReduxStore.sidelong);

  const dialogStyle = props.buysell === 'buy' ? 'buttonlongselected' : 'buttonshortselected';
//  const dialogStyle = islong === true ? 'buttonlongselected' : 'buttonshortselected';


function WrappeerConfettiExplosion(props : any) {
  return (
    <ConfettiExplosion className="confetti"
      force={.8}
      duration={3300}
      particleCount={150}
      floorHeight={30}
      oncomplete={() => {
        console.log('oncomplete');
       }
      }
      
    />
  );
}
  const clickMe = () => { 
      console.log('Click me',props);
  }
    
  const clickMeJoy = () => {
    console.log('Click me joy', props);
    setIsVisible(true);
     setTimeout(() => {
       setIsVisible(false);
     }, 3500);
  };

  //console.log('indexvalue', indexValue);
  return (
    <div>
      {isVisible && <WrappeerConfettiExplosion />}     
      
      <Dialog className='dialogbox1' BackdropProps={{
    style: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  }} onClose={handleClose} open={open}>
        
        <Tooltip title="This is a dialog box" followCursor> 
          <DialogTitle className='titledlg'>Interaction Dialog</DialogTitle>
          </Tooltip>
        <div className='dialogbox1incontainer'>
          <h1>Entry price is: {indexValue.toFixed(2)} </h1>
          <LinearWithValueLabel />


        </div>
        
        <Tooltip title="Creates an explosion of joy receiving an NFT" followCursor>
          <Button className="buttonlongselected" onClick={clickMeJoy}>Click me</Button>
        </Tooltip>
        
          <Tooltip title="place an order" followCursor>
          <Button className={dialogStyle} onClick={clickMe}>{props.buysell}</Button>
        </Tooltip>

          <Button  className="buttonlongselected" onClick={handleClose}>Close</Button>
  
      </Dialog>
  
     </div>
  );
}


export const  TestMuiDialogBoxes = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(lootboxes[1]);


    const handleClickOpen = () => {
        setOpen(true);
        console.log('Open dialog');
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };
    

    return (<div>
        <Button className='btnopentest' onClick={handleClickOpen} >Open t dialog</Button>
        <SimpleDialog
            selectedValue={selectedValue}
            open={open}
        onClose={handleClose}
        buysell='sell'     />
      
    </div>
    );
}

export default TestMuiDialogBoxes;
