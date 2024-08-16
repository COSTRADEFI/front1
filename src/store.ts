import { createSlice } from "@reduxjs/toolkit";

export interface CustomerEvent {
  userName: string;
  winnings: number;
  randresult: number;
}

export interface CustomerState {
  userName: string;
  balance: number;
  available: 0;
  margin: 0;
  ctbalance: 0;
  sidelong :true;
  indexPosition:number;
  lastRandomVal: number;
  lastRandomChange: number;
  firstRandomVal: number;
  animationVisible: boolean;
  animationDuration: number;
  isconnected: boolean;
  isMobile: boolean;
  lastEventVal: CustomerEvent | null;
  arrayLastEventVal: CustomerEvent[];
  dialogWelcomeVisible: boolean;
};

const initialState: CustomerState = {
  userName: "",
  balance: 0,
  available: 0,
  margin: 0,
  ctbalance: 0,
  sidelong :true,
  indexPosition:0,
  lastRandomVal: 0,
  lastRandomChange: 0,
  firstRandomVal: 0,
  dialogWelcomeVisible: true,
  isconnected: false,
  isMobile: false,
  lastEventVal: null,
  arrayLastEventVal: [],
};

export const clientReduxStore = createSlice({
  name: "clientReduxStore",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },

    newRandomVal: (state, action) => {
      state.lastRandomChange = action.payload - state.lastRandomVal;
      state.lastRandomVal = action.payload;
      
      //console.log("lastRandomVal", state.lastRandomVal);  
    },
    firstRandomVal: (state, action) => {
      state.firstRandomVal = action.payload;
    },

    newEventVal: (state, action) => {
      state.lastEventVal = action.payload;
    
    },
    
    newHistoEventVal: (state, action) => { 
      state.arrayLastEventVal = [action.payload, ...state.arrayLastEventVal];
    },

    setAnimationVal: (state, action) => {
      state.animationVisible = action.payload;
    },

    updateBalanceVal: (state, action) => {
      state.balance = action.payload;
    },


    updateViewFct2: (state,action)=>{
      //console.log('updateViewFct2', action.payload);
      state.sidelong = action.payload.sideLongSmart;
      state.ctbalance = action.payload.contractBalanceSmart;
      state.margin = action.payload.marginBalanceSmart;
      
      state.indexPosition= action.payload.indexPosition;

      //state.available = action.payload.coinDecimals;
    /*
    ()
        .indexPosition
        coinDecimals
        contractBalanceSmart
        marginBalanceSmart
        sideLongSmart
        smartTableLength


        */

    },


    setConnectedVal: (state, action) => {
      state.isconnected = action.payload;
    },

    setMobileVal: (state, action) => {
      state.isMobile = action.payload;
    },

    setDialogWelcomeVisible: (state, action) => {
      state.dialogWelcomeVisible = action.payload;
    }

  },
});

export const {
  setUserName,
  newRandomVal,
  firstRandomVal,
  newEventVal,
  newHistoEventVal,
  setAnimationVal,
  updateBalanceVal,
  updateViewFct2,
  setConnectedVal,
  setMobileVal,
  setDialogWelcomeVisible,
} = clientReduxStore.actions;

export default clientReduxStore.reducer;
