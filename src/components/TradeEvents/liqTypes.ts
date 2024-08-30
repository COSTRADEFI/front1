

export interface TradeEvent {
    numbercont: number;
    account: string;
    isLong: boolean;
    
}
  

export interface LiqEvent {
    price: number;
    account: string;
    contractBalance: number;
    
}
 
export interface GenericEvent {
    account: string;
    time: number;
    event: string;
}
