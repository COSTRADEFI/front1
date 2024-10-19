import React from 'react';
import { useState } from 'react';
import './LeaderBoardOrLP.css';

interface Props {

}

const LeaderBoard = () => {
    return (
    <div>
    <h1>LeaderBoard</h1>
    </div>
    );
}

const PoolBoard = () => {
    return (
    <div >
    <h1>Add to LP</h1>
    </div>
    );
}

const LeaderBoardOrLP = (props: Props) => {
    const [isActive, setActive] = useState(true);
    const ToggleClass = () => {
        console.log('clicked');
        setActive(!isActive);
    };
    return (
        < div className={isActive ? '' : 'is-flipped'}>
            <div className={isActive ? 'card front' : 'card back'} onClick={ToggleClass}>
                {isActive ? (< LeaderBoard />) : (< PoolBoard />)}
            </div>
            <div className={isActive ? 'card front' : 'card back'} >
             
            </div>
        </div>
    );
}

export default LeaderBoardOrLP;
