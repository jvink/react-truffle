import React from 'react';
import BetComponent from './Bet';
import "../css/betDetails.css";
import moment from 'moment';
import { ReactComponent as EtherIcon } from './eth.svg';
import CoinValue from "../CoinValue";

const App = (props) => {
    const { changeContent, keyTest } = props;
    let inzet = null;
    let temperatuur = null;
    let locatie = null;
    let timestamp = null;
    let weather_date = null;
    let ethereumInzet = null;

    {props.bets.map((bet => bet.id == props.betId ? 
        (
            inzet= bet.inzet,
            temperatuur= bet.guess, 
            locatie= bet.name,
            timestamp= bet.made_on,
            weather_date = bet.weather_date
         ) :
        console.log("error")))}
        
    //let datum = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");

    return(
        
    <div className="card col-7">
        <div className="flex">
            <h2>Weerweddenschappen</h2>
            <h2 className="XCursor" onClick={() => props.onClickDetail(changeContent)}><i className="material-icons">clear</i></h2>
        </div>
        <form>
          <div>
            <label>Inzet</label>
            <div className="input-group mb-2">
              {/* <CoinValue ethereumInzet={inzet}/>
              <span style={{ display: 'flex', margin: '.5em' }}>
                ≈ <span style={{ marginLeft: '.3em' }}>
                  <EtherIcon />
                </span>
                {ethereumInzet}
              </span> */}
              <input type="number" className="form-control" placeholder={inzet}  value={inzet} disabled={true}/>
            </div>
            <label>Gewedde temperatuur</label>
            <div className="input-group mb-2">
              <input type="number" className="form-control" placeholder={temperatuur} value={temperatuur} disabled={true}  />
            </div>
            <label>Gekozen stad</label>
            <div className="form-group">
              
              <select className="form-control" disabled={true}>
                <option selected={true}>{locatie}</option>
              </select>
            </div>
            <label>Weddenschap gemaakt op:</label>
            <div className="form-group">
             
              <select className="form-control" disabled={true}>
                <option selected={true}>{timestamp}</option>
              </select>
            </div>
            <label>Deze Weddenschap verloopt op:</label>
            <div className="input-group">
              <input  className="form-control" placeholder={weather_date} value={weather_date} disabled={true}  />
            </div>
          </div>
        </form>
      </div>
    )
}

export default App;