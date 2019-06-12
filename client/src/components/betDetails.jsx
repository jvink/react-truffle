import React from 'react';
import BetComponent from './Bet';
import "../css/betDetails.css";
import moment from 'moment';
import { ReactComponent as EtherIcon } from './eth.svg';
import CoinValue from "../CoinValue";
import Timer from 'react-compound-timer';

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
    function calculateTime ()  {
      var span = convertTimeToSeconds(moment.unix(weather_date));
     
      console.log(moment.unix(weather_date))
      if(span <= 0){
        span = 0;
      }
      return span *1000;
    }
    function convertTimeToSeconds (time)  {
      var today =  moment()
      console.log(today)
      var yearNow = today.year()
      var monthNow = today.month() 
      var dateNow = today.date()
      var hoursNow = today.hours() 
      var minutesNow = today.minutes() 
      var secondsNow = today.seconds()
      var year = time.year()
      var month = time.month()
      var date = time.date()
      var hours = time.hours() 
      var minutes = time.minutes() 
      var seconds = time.seconds()

      var t1 = new Date(yearNow, monthNow, dateNow, hoursNow, minutesNow, secondsNow);
      var t2 = new Date(year, month, date, hours, minutes, seconds);
      var dif = t1.getTime() - t2.getTime();

      var Seconds_from_T1_to_T2 = dif / 1000;
      var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
      return Seconds_Between_Dates;
    }
    

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
                <option selected={true}>{moment.unix(timestamp).format("YYYY-MM-DD HH:mm")}</option>
              </select>
            </div>
            <label>Deze Weddenschap verloopt op:</label>
            <div className="input-group mb-5">
              <input  className="form-control" placeholder={weather_date} value={moment.unix(weather_date).format("YYYY-MM-DD HH:mm")} disabled={true}  />
            </div>
            <div className=" mb-5 align-self-end">
            <label><h3>Tijd voordat de Weddenschap verloopt:</h3></label>
            <br/>
            <b>
              <Timer
                  initialTime={calculateTime()}
                  direction="backward"
              >
                  {() => (
                      <React.Fragment>
                        <h4>
                        <span> <Timer.Days /> dag(en) </span>
                        <span> <Timer.Hours /> uren </span>
                        <span><Timer.Minutes /> minuten</span>
                        <span> <Timer.Seconds /> seconden</span>
                        </h4>
                        </React.Fragment>
                  )}
            </Timer>
            </b>
            </div>
          </div>
        </form>
      </div>
    )
}

export default App;