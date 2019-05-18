import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import getWeather from "./Weather";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, weather: null };
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
      const weather = await getWeather("Rotterdam");
      this.setState({ weather });
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
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
    const weather = await getWeather(value);
    this.setState({ weather });
  }

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0], gas: 2000000 });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

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
                  <select className="form-control">
                    <option>6-6-2019 12:00</option>
                    <option>7-6-2019 12:00</option>
                    <option>8-6-2019 12:00</option>
                    <option>9-6-2019 12:00</option>
                  </select>
                </div>
                <div style={{ display: 'flex' }}>
                  <button type="button" className="btn btn-secondary">Annuleren</button>
                  <button type="button" className="btn btn-primary">Plaats weddenschap</button>
                </div>
              </div>
              <div>
                <h4>Het is nu</h4>
                <h1>{Math.round(this.state.weather.main.temp)} C°</h1>
                <h3>in {this.state.weather.name}</h3>
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
