import React, { Component } from "react";
import {getWeather, getWeather2} from "../Weather";
import { placeBet, placeAddress } from "../BetFunctions";
import CoinValue from "../CoinValue";
import moment from 'moment';
import { ReactComponent as EtherIcon } from './eth.svg';
import "../css/App.css";
import getForeCastWeather from "../ForeCastWeather";
import getOdds from "../Odds"
import getPreviewBets from "../PreviewBets"
import getPreviewOdds from "../PreviewOdds.js";


class App extends Component {
  state = { weather: null, inzet: 0, city: 'Rotterdam', changeContent: false, dollar: 0,
  forecastWeather: null, date: null, odds: null, previewBets: null, previewOdds: null, bet: null  };
  dollar = React.createRef();
  inzet = React.createRef();
  guess = React.createRef();
  city = React.createRef();
  time = React.createRef();
  address = React.createRef();

  componentWillReceiveProps = (props) => {
    this.setState({ addressReceived: props.oracleReady })
 
  }
  componentDidMount = async () => {
    this.setState({ addressReceived: this.props.oracleReady, weather: await getWeather(this.state.city) })
    const { weather } = this.state;
    this.state.date = weather[0].dt_txt;
    this.state.forecastWeather = await getForeCastWeather(this.state.date, this.state.city);
    this.state.odds = await getOdds(Math.round(this.state.forecastWeather), this.state.bet, this.state.weather, this.state.date)
    this.state.previewBets = await getPreviewBets(Math.round(this.state.forecastWeather));
    this.state.previewOdds = await getPreviewOdds(this.state.previewBets, this.state.forecastWeather, this.state.weather, this.state.date);
  }
  onChangeCity = async (e) => {
    let { value } = e.target;
    const weather = await getWeather(value);
    this.setState({ weather, city: value });

    const forecastWeather = await getForeCastWeather(this.state.date, value);
    this.setState({ forecastWeather });
    const odds = await getOdds(Math.round(forecastWeather), this.state.bet, weather, this.state.date);
    this.setState({ odds });
    const previewBets =  await getPreviewBets(Math.round(forecastWeather));
    this.setState({ previewBets });
  }
  onChangeDate = async (e) => {
    let {value} = e.target;
    const date = value;
    this.setState({ date })
    const forecastWeather = await getForeCastWeather(date, this.state.city);
    this.setState({ forecastWeather });
    const odds = await getOdds(Math.round(forecastWeather), this.state.bet, this.state.weather, date);
    this.setState({ odds });
    const previewBets =  await getPreviewBets(Math.round(forecastWeather));
    this.setState({ previewBets });
  }

  onChangeTemperatuur = async (e) => {
    let {value} = e.target;
    const bet = value;
    this.setState({ bet });
    const odds = await getOdds(Math.round(this.state.forecastWeather), bet, this.state.weather, this.state.date);
    this.setState({ odds });
    const previewBets =  await getPreviewBets(Math.round(this.state.forecastWeather));
    this.setState({ previewBets });
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { drizzle, drizzleState } = this.props;
    const weather = await getWeather2(this.city.current.value);
    const betObject = {
      cityId: weather.id,
      name: this.city.current.value,
      inzet: this.state.inzet,
      dollar: parseInt(this.state.dollar),
      guess: parseInt(this.guess.current.value),
      time: moment(this.time.current.value).unix(),
      timeOfNow: moment().unix(),
      quotering: this.state.odds
    }
    placeBet(drizzle, drizzleState, betObject);

  }

  setAddress = async (event) => {
    event.preventDefault()
    const { drizzle, drizzleState } = this.props;
    const addressReceived = await placeAddress(drizzle, drizzleState, this.address.current.value)
    await this.setState({ addressReceived }, () => {
      if (this.state.addressReceived) alert("well received")
      else alert("wrong address")
    }
    );
  }

  render() {
    if (!this.state.weather) {
      return <div>Weer is aan het laden...</div>;
    }
    var date = moment().format("YYYY-MM-DD");
    var time = "00:00";
    var calcTimeAndDate = moment(date + ' ' + time).format("YYYY-MM-DD HH:mm");

    const message = (<div><span className="text-danger"><b>Admin, Insert Oracle Address first. Without Single Quotes</b></span>
      <input className="form-control mt-2 mb-2" placeholder="address" ref={this.address} />
      <button type="button" onClick={this.setAddress} className="btn btn-warning mb-3">Insert Oracle Address from console here above</button></div>);
      
      var dollarberekening;
      var etherberekening;
      if(this.state.odds){
         dollarberekening = (Math.round(this.state.dollar * this.state.odds * 100) / 100);
         etherberekening = (Math.round(this.state.inzet * this.state.odds * 1000000) / 1000000);
      } 
    // if it exists, then we display its value
    return (
      <div className="card col-7">
        <h2>Weerweddenschappen</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Hoeveel wil je inzetten?</label>
            <div>
              <CoinValue onChangeValue={(v, b) => this.setState({ inzet: v, dollar:b })}/>
              <span style={{ display: 'flex', margin: '.5em' }}>
                ≈ <span style={{ marginLeft: '.3em' }}>
                  <EtherIcon />
                </span>
                {this.state.inzet}
              </span>
            </div>
            <label>Welke temperatuur wed je?</label>
            <div className="input-group mb-2">
              <input type="number" className="form-control" placeholder={`Hoeveel graden wordt het in ${this.state.city}?`} onChange={this.onChangeTemperatuur}min="-50" max="50"   ref={this.guess} required />
            </div>
            <div className="form-group">
              <label>Locatie</label>
              <select className="form-control" ref={this.city} onChange={this.onChangeCity} >
                <option>Rotterdam</option>
                <option>Amsterdam</option>
                <option>Breda</option>
                <option>Dordrecht</option>
                <option>Groningen</option>
              </select>
            </div>
            <div className="form-group">
              <label>Datum</label>
              <select className="form-control" onChange={this.onChangeDate} ref={this.time} >
                  {this.state.weather.map((weather, index) => {
                      return <option key={index}>{weather.dt_txt}</option>
                    })}
      
              </select>
            </div>

            {(this.state.odds && dollarberekening !==0 &&  etherberekening !==0 && 
            !isNaN(dollarberekening) && !isNaN(etherberekening) &&
            dollarberekening !== Infinity && etherberekening !== Infinity) &&
            <div>  
            <label> <b>Quotering:  {this.state.odds}</b> </label>  
               
              <div className="form-group">
                    <table>
                      <tbody>
                        <tr>
                          {this.state.previewBets && this.state.previewBets.map((previewBets, index) => {
                            return <td className="quotering" key ={index}>{previewBets} C°</td>
                          })}
                        </tr>
                          {this.state.previewOdds && this.state.previewOdds.map((previewOdds, index) => {
                            return <td className="quotering" key ={index}>{previewOdds}</td>
                          })}
                        <tr>
                        </tr>
                      </tbody>
                    </table>
                </div>        
              <div className="form-group">
                  <span className="text-success"><b>Je maakt kans op: ${dollarberekening} Dollar!
                    ({etherberekening} Ether.) </b></span>
              </div>           
            </div>
            }
            {dollarberekening === Infinity &&
            <span className="text-danger">Je bent echt al ver over je limiet.</span>}
                 
            {!this.state.addressReceived && message}
            <div style={{ display: 'flex' }}>
              <button type="button" className="btn btn-secondary">Annuleren</button>
              <button type="submit" disabled={!this.state.addressReceived} className="btn btn-primary">Plaats weddenschap</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default App;

