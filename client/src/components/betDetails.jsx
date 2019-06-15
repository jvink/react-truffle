import React from 'react';
import BetComponent from './Bet';
import "../css/betDetails.css";
import moment from 'moment';
import { ReactComponent as EtherIcon } from './eth.svg';
import CoinValue from "../CoinValue";

class App extends React.Component {

  state = {inzet: null, temperatuur: null, locatie: null, timestamp: null, weather_date: null };
  componentWillReceiveProps(props){
    {props.bets.map((async(bet) => bet.id == props.betId ? 
      (
          await this.setState({
            inzet: bet.inzet,
            temperatuur: bet.guess,
            locatie: bet.name,
            timestamp: bet.made_on,
            weather_date: bet.weather_date,
            winning: bet.winning_degree
          })
       ) :
      console.log("error")))}
  }
  componentDidMount(){
    {this.props.bets.map((async(bet) => bet.id == this.props.betId ? 
      (
          await this.setState({
            inzet: bet.inzet,
            temperatuur: bet.guess,
            locatie: bet.name,
            timestamp: bet.made_on,
            weather_date: bet.weather_date,
            winning: bet.winning_degree
          })
       ) :
      console.log("error")))}
  }
        
    render = () => {
        const {inzet, temperatuur, locatie, timestamp, winning,  weather_date} = this.state;
        const { changeContent } = this.props;

        var result = <div></div>
        if(winning !== temperatuur){
          result =  <div><span className="text-danger"><b>Weddenschap afgelopen!</b></span><br/><label>Resultaat weddenschap:</label>  <br/>
          <span>Je hebt deze weddenschap helaas verloren. De juiste temperatuur was: <b>{winning}</b> (afgerond), maar jij raadde: <b>{temperatuur}</b>. 
          <br/>  <b>Volgende keer beter!</b></span> 
          </div>
        }
        else if(winning === temperatuur){
          result = <div><span className="text-danger"><b>Weddenschap afgelopen!</b></span><br/><label>Resultaat weddenschap:</label> <br/>
          <span>Je hebt deze weddenschap gewonnen! De juiste temperatuur was: <b>{winning}</b> (afgerond). Jij raadde: <b>{temperatuur}</b>.
          <br/> <b>Gefeliciteerd!</b></span> 
          </div>     
        }
    return(
            
    <div className="card col-7">
        <div className="flex">
            <h2>Weerweddenschappen</h2>
            <h2 className="XCursor" onClick={() => this.props.onClickDetail(changeContent)}><i className="material-icons">clear</i></h2>
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
            {result}
          </div>
        </form>
      </div>
    );
   }
    
}


export default App;