import React, { Component } from "react";
import {getWeather} from "../Weather";
import { placeBet, placeAddress } from "../BetFunctions";
import CoinValue from "../CoinValue";
import moment from 'moment';
import { ReactComponent as EtherIcon } from './eth.svg';
import "../css/App.css";


class App extends Component {
  state = { weather: null, inzet: 0, city: 'Rotterdam', changeContent: false };
  dollar = React.createRef();
  inzet = React.createRef();
  guess = React.createRef();
  city = React.createRef();
  time = React.createRef();
  address = React.createRef();

  componentWillReceiveProps = (props) => {
    this.setState({ addressReceived: props.oracleReady })
    console.log("komt ie hier nog langs 2/")
  }
  componentDidMount = () => {
    this.setState({ addressReceived: this.props.oracleReady })
    console.log("komt ie hier nog langs 2/")
  }
  onChangeCity = async (e) => {
    let { value } = e.target;
    const weather = await getWeather(value);
    this.setState({ weather });
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { drizzle, drizzleState } = this.props;
    const weather = await getWeather(this.city.current.value);
    const betObject = {
      cityId: weather.id,
      name: this.city.current.value,
      inzet: this.state.inzet,
      dollar: parseInt(this.state.dollar),
      guess: parseInt(this.guess.current.value),
      time: moment(this.time.current.value).unix(),
      timeOfNow: moment().unix()
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
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask...</div>;
    }
    console.log(this.state.addressReceived)
    var date = moment().format("YYYY-MM-DD");
    var time = "00:00";
    var calcTimeAndDate = moment(date + ' ' + time).format("YYYY-MM-DD HH:mm");

    const message = (<div><span className="text-danger"><b>Admin, Insert Oracle Address first. Without Single Quotes</b></span>
      <input className="form-control mt-2 mb-2" placeholder="address" ref={this.address} />
      <button type="button" onClick={this.setAddress} className="btn btn-warning mb-3">Insert Oracle Address from console here above</button></div>);
      const hours = [0, 3, 6, 9, 12, 15, 18, 21];
      const days = [2,3,4,5,6];
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
              <input type="number" className="form-control" placeholder={`Hoeveel graden wordt het in ${this.state.city}?`} ref={this.guess} required />
            </div>
            <div className="form-group">
              <label>Locatie</label>
              <select className="form-control" ref={this.city} onChange={(e) => this.setState({ city: e.target.value })} >
                <option>Rotterdam</option>
                <option>Amsterdam</option>
                <option>Breda</option>
                <option>Dordrecht</option>
                <option>Groningen</option>
              </select>
            </div>
            <div className="form-group">
              <label>Datum</label>
              <select className="form-control" ref={this.time} >
              {days.map( (x) => {
                return hours.map(y => {
                  return <option value={moment(calcTimeAndDate).add(x, 'days').add(y, 'hours').format("YYYY-MM-DD HH:mm")}>{moment(calcTimeAndDate).add(x, 'days').add(y, 'hours').format("DD-MM-YYYY HH:mm")}</option>
                }
                )
              })
            }
      
              </select>
            </div>
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

