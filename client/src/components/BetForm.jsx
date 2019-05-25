import React, { Component } from "react";
import getWeather from "../Weather";
import { placeBet, placeAddress } from "../BetFunctions";
import moment from 'moment';
import "../App.css";


class App extends Component {
  state = { weather: null };
  inzet = React.createRef();
  guess = React.createRef();
  city = React.createRef();
  time = React.createRef();
  address = React.createRef();

  componentWillReceiveProps = (props) => {
    this.setState({ addressReceived: props.oracleReady })
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
    console.log(weather)
    const betObject = {
      cityId: weather.id,
      name: this.city.current.value,
      inzet: parseInt(this.inzet.current.value),
      guess: parseInt(this.guess.current.value),
      time: new Date(this.time.current.value).getTime(),
      timeOfNow: new Date().getTime()
    }
    console.log(betObject)
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

    var date = moment().format("YYYY-MM-DD");
    var time = "12:00";
    var calcTimeAndDate = moment(date + ' ' + time).format("YYYY-MM-DD HH:mm");
    var timeAndDate = moment(calcTimeAndDate).add(2, 'days').format("DD-MM-YYYY HH:mm");
    
    const message = (<div><span className="text-danger"><b>Admin, Insert Oracle Address first. Without Single Quotes</b></span>
      <input className="form-control mt-2 mb-2" placeholder="address" ref={this.address} />
      <button type="button" onClick={this.setAddress} className="btn btn-warning mb-3">Insert Oracle Address from console here above</button></div>);

    // if it exists, then we display its value
    return (
      <div className="card col-7">
        <h2>Weerweddenschappen</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="col-md-4 mb-3">
            <label>Inzet (in Dolla) </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <span className="input-group-text">@</span>
              </div>
              <input type="number" className="form-control" placeholder="Dollar" ref={this.inzet} required />
            </div>
            <label>Welke temperatuur wed je?</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <span className="input-group-text">@</span>
              </div>
              <input type="number" className="form-control" placeholder="Guess" ref={this.guess} required />
            </div>
            <div className="form-group">
              <label>Locatie</label>
              <select className="form-control" ref={this.city}  >
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
                <option>{timeAndDate}</option>
                <option>{moment(calcTimeAndDate).add(3, 'days').format("DD-MM-YYYY HH:mm")}</option>
                <option>{moment(calcTimeAndDate).add(4, 'days').format("DD-MM-YYYY HH:mm")}</option>
                <option>{moment(calcTimeAndDate).add(5, 'days').format("DD-MM-YYYY HH:mm")}</option>
                <option>{moment(calcTimeAndDate).add(6, 'days').format("DD-MM-YYYY HH:mm")}</option>
              </select>
            </div>
            {!this.state.addressReceived && message}
            <div style={{ display: 'flex' }}>
              <button type="button" className="btn btn-secondary">Annuleren</button>
              <button type="submit" disabled={!this.props.oracleReady} className="btn btn-primary">Plaats weddenschap</button>
            </div>
          </div>
          <div>
            <h4>Het is nu</h4>
            {/* <h1>{Math.round(this.state.weather.main.temp)} C°</h1>
                  <h3>in {this.state.weather.name}</h3> */}
          </div>
        </form>
      </div>
    );
  }
}

export default App;

