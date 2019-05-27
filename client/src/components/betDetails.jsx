import React from 'react';
import BetForm from './BetForm';
import "../css/betDetails.css";
import moment from 'moment';

const BetDetailsComponent = (props) => {
    const { changeContent } = props;
    let inzet = null;
    let temperatuur = null;
    let locatie = null;
    let timestamp = null;

    {props.bets.map((bet, i) => { 
        inzet = bet.inzet;
        temperatuur = bet.name;
        locatie = bet.guess;
        timestamp = bet.made_on;
    })}

    let datum = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");



        return(
            
            <div className="card col-7">
                <div className="flex">
                    <h2>Weddenschap details</h2>
                    <h2 className="XCursor" onClick={(() => props.onClickDetail(changeContent))}><i className="material-icons">clear</i></h2>
                </div>
                <div className="col-md-5 mb-3">
                    <label>Inzet (in Dollar) </label>
                    <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">@</span>
                    </div>
                    
                    <input type="number" className="form-control" placeholder={inzet} disabled="true" required />
                    
                    </div>
                    <label>Welke temperatuur wed je?</label>
                    <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">@</span>
                    </div>
                    <input type="number" className="form-control" placeholder={temperatuur} disabled="true" required />
                    </div>
                    <div className="form-group">
                    <label>Locatie</label>
                    <select className="form-control" disabled="true">
                        <option>{locatie}</option>
                    </select>
                    </div>
                    <div className="form-group">
                    <label>Datum</label>
                    <select className="form-control" disabled="true">
                        <option>{datum}</option>
                    </select>
                    </div>
                </div>
            </div>
          
        )

}

export default BetDetailsComponent