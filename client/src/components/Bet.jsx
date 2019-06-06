import React from 'react';
import BetForm from './BetDetails';
import App from '../App'
import '../css/bet.css';
import BetDetailsComponent from './BetDetails';

 const BetComponent = (props) => {
    const { bet, type, changeContent} = props;

    const onClickCallTwoFunctions = () => {
        props.onClickDetail(props.changeContent);
        props.onClickSetBetId(bet.id);
    }
    
    const renderStatus = () => {
        switch (type) {
            case 0:
                return <div className="statusWrapper" style={{ backgroundColor: '#F79F1F' }}>Pending</div>
            case 1:
                return <div className="statusWrapper" style={{ backgroundColor: '#009432' }}>Closed</div>
            case 2:
                return <div className="statusWrapper" style={{ backgroundColor: '#2980b9' }}>Payed</div>
            default:
                return <div className="statusWrapper" style={{ backgroundColor: '#e74c3c' }}>Invalid</div>
        }
    }

    return (
    <div className="betWrapper" onClick={onClickCallTwoFunctions}>
            <span><b>{bet.name}</b></span>
            {renderStatus()}
            <span>Inzet: ${bet.inzet}</span>
            <span>Temperatuur: {bet.guess}°</span>
            <div className="detailButton"><b>></b></div>
            {((type === 1 || type === 2) && bet.guess === bet.winning_degree) &&
                <div className="wonWrapper">
                    <span role="img" aria-labelledby="emoticon">🎊</span><span> You Won! </span><span role="img" aria-labelledby="emoticon">🎉</span>
                </div>
            }
        </div>
    )
}

export default BetComponent;