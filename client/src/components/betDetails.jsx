import React from 'react';
import BetComponent from './Bet';
import "../css/betDetails.css";
import moment from 'moment';

const BetDetailsComponent = (props) => {
    const { changeContent, keyTest } = props;
    let inzet = null;
    let temperatuur = null;
    let locatie = null;
    let timestamp = null;

    {props.bets.map((bet => bet.id == props.betId ? 
        (
            inzet= bet.inzet,
            temperatuur= bet.guess, 
            locatie= bet.name,
            timestamp= bet.made_on
         ) :
        console.log("error")))}
        
 

    let datum = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");
    console.log("betId props", props.betId)
    console.log(props)

    return(
        
        <div className="card col-7">
            <div className="flex">
                <h2>Weddenschap details</h2>
                <h2 className="XCursor" onClick={() => props.onClickDetail(changeContent)}><i className="material-icons">clear</i></h2>
            </div>
            <div className="col-md-5 mb-3">
                <label>Inzet (in Dollar) </label>
                <div className="input-group mb-2">
                <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                </div>
                
                <input type="number" className="form-control" placeholder={inzet} disabled={true} required />
                
                </div>
                <label>Welke temperatuur wed je?</label>
                <div className="input-group mb-2">
                <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                </div>
                <input type="number" className="form-control" placeholder={temperatuur} disabled={true} required />
                </div>
                <div className="form-group">
                <label>Locatie</label>
                <select className="form-control" disabled={true}>
                    <option>{locatie}</option>
                </select>
                </div>
                <div className="form-group">
                <label>Datum</label>
                <select className="form-control" disabled={true}>
                    <option>{datum}</option>
                </select>
                </div>
            </div>
        </div>
    )
}

export default BetDetailsComponent