import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import getWeather from "./Weather";
import getForeCastWeather from "./ForeCastWeather";
import getOdds from "./Odds"
import getPreviewBets from "./PreviewBet"
import getPreviewOdds from "./PreviewOdds.js";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, weather: null, forecastWeather: null, date: null, odds: null, bet: null, previewBets: null, previewOdds: null };
  city = "Rotterdam";
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const weather = await getWeather(this.city);
      this.setState({ weather });
      this.state.date = weather[0].dt_txt;
      this.state.forecastWeather = await getForeCastWeather(this.state.date, this.city);
      this.state.odds = await getOdds(Math.round(this.state.forecastWeather), this.state.bet, this.state.weather, this.state.date)
      this.state.previewBets = await getPreviewBets(Math.round(this.state.forecastWeather));
      this.state.previewOdds = await getPreviewOdds(this.state.previewBets, this.state.forecastWeather, this.state.weather, this.state.date);
      console.log(this.state.previewOdds);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onChangeCity = async (e) => {
    let {value} = e.target;
    this.city = value;
    const weather = await getWeather(value);
    this.setState({ weather });
    const forecastWeather = await getForeCastWeather(this.state.date, this.city);
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
    const forecastWeather = await getForeCastWeather(date, this.city);
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

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="card col-7">
            <h2>Weerweddenschappen</h2>
            <form>
              <div className="col-md-4 mb-3">
                <label>Ether</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                  </div>
                  <input type="number" className="form-control" placeholder="Ether" required />
                </div>
                <div className="form-group">
                  <label>Locatie</label>
                  <select className="form-control" onChange={this.onChangeCity}>
                    <option>Rotterdam</option>
                    <option>Amsterdam</option>
                    <option>Breda</option>
                    <option>Dordrecht</option>
                    <option>Groningen</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Datum</label>
                  <select className="form-control" onChange={this.onChangeDate}>
                {this.state.weather.map((weather, index) => {
                  return <option key={index}>{weather.dt_txt}</option>
                })}
                  </select>
                </div>
                <label>Temperatuur</label>
                <div className="form-group">
                  <input type="number" className="form-control" placeholder="Temperatuur" onChange={this.onChangeTemperatuur} required />
                </div>
                <label>Quotering</label>
                <div className="form-group">
                  {this.state.odds.toFixed(2)}
                </div>
                <div>
                  <div className="form-group">
                    <table>
                      <tbody>
                        <tr>
                          {this.state.previewBets.map((previewBets, index) => {
                            return <td className="quotering" key ={index}>{previewBets} C°</td>
                          })}
                        </tr>
                          {this.state.previewOdds.map((previewOdds, index) => {
                            return <td className="quotering" key ={index}>{previewOdds}</td>
                          })}
                        <tr>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <button type="button" className="btn btn-secondary">Annuleren</button>
                  <button type="button" className="btn btn-primary">Plaats weddenschap</button>
                </div>
              </div>
            <div>
              <h4>Verwachte temperatuur op {this.state.date}</h4>
              <h1>{Math.round(this.state.forecastWeather)} C°</h1>
              <h3>in {this.city}</h3>
            </div>
            </form>
          </div>
          <div className="col-1">

          </div>
          <div className="card col-4">
            <h2>Wallet</h2>
            <p>The stored value is: {this.state.storageValue}</p>
            <h3>Accounts: </h3>
            <ul>
              {this.state.accounts.map((account, i) => {
                return <li key={i}>{account}</li>
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
