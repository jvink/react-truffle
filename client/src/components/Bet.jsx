import React from 'react';
import BetForm from './BetForm';
import App from '../App';
import '../css/bet.css';


 const BetComponent = (props) => {
    const { bet, type, changeContent} = props;

    const onClickCallTwoFunctions = () => {
        props.onClickDetail(props.changeContent);
        props.onClickSetBetId(bet.id);
    }
    
    
    const renderStatus = () => {
        switch (type) {
            case 0:
                return <div className="statusWrapper" data-testid="status" style={{ backgroundColor: '#F79F1F' }}>Pending</div>
            case 2:
                return <div className="statusWrapper" data-testid="status" style={{ backgroundColor: '#009432' }}>Won</div>
            case 3:
                return <div className="statusWrapper" data-testid="status" style={{ backgroundColor: '#2980b9' }}>Lost</div>
            default:
                return <div className="statusWrapper" data-testid="status" style={{ backgroundColor: '#e74c3c' }}>Invalid</div>
        }
    }

    return (
    <div className="betWrapper" onClick={onClickCallTwoFunctions}>
            <span><b>{bet.name}</b></span>
            {renderStatus()}
            <span>Inzet: ${bet.inzet}</span>
            <span>Temperatuur: {bet.guess}°</span>
            <div className="detailButton"><b>></b></div>
            {(type === 2 ) ? (
                <div className="wonWrapper">
                    <span role="img" aria-labelledby="emoticon">🎊</span><span> You Won! </span><span role="img" aria-labelledby="emoticon">🎉</span>
                </div>
            ): ( type === 3) ? (<div className="wonWrapper">
            <span role="img" aria-labelledby="emoticon">😭</span><span> You Lost! </span><span role="img" aria-labelledby="emoticon">😢</span>
             </div>): <div></div>
            }
        </div>
    )
}

export default BetComponent;