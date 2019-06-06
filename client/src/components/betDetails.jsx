import React from 'react';
import BetComponent from './Bet';
import "../css/betDetails.css";
import moment from 'moment';
import { ReactComponent as EtherIcon } from './eth.svg';
import CoinValue from "../CoinValue";

const BetDetailsComponent = (props) => {
    const { changeContent, keyTest } = props;
    let inzet = null;
    let temperatuur = null;
    let locatie = null;
    let timestamp = null;
    let ethereumInzet = null;

    {props.bets.map((bet => bet.id == props.betId ? 
        (
            inzet= bet.inzet,
            temperatuur= bet.guess, 
            locatie= bet.name,
            timestamp= bet.made_on
         ) :
        console.log("error")))}
        
    let datum = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");

    return(
        
    <div className="card col-7">
        <div className="flex">
            <h2>Weerweddenschappen</h2>
            <h2 className="XCursor" onClick={() => props.onClickDetail(changeContent)}><i className="material-icons">clear</i></h2>
        </div>
        <form>
          <div>
            <label>Hoeveel wil je inzetten?</label>
            <div>
              {/* <CoinValue ethereumInzet={inzet}/>
              <span style={{ display: 'flex', margin: '.5em' }}>
                ≈ <span style={{ marginLeft: '.3em' }}>
                  <EtherIcon />
                </span>
                {ethereumInzet}
              </span> */}
              <input type="number" className="form-control" placeholder={inzet} disabled={true}/>
            </div>
            <label>Welke temperatuur wed je?</label>
            <div className="input-group mb-2">
              <input type="number" className="form-control" placeholder={temperatuur} value={temperatuur} disabled={true} required />
            </div>
            <div className="form-group">
              <label>Locatie</label>
              <select className="form-control" disabled={true}>
                <option selected={true}>{locatie}</option>
              </select>
            </div>
            <div className="form-group">
              <label>Datum</label>
              <select className="form-control" disabled={true}>
                <option selected={true}>{datum}</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    )
}

export default BetDetailsComponent