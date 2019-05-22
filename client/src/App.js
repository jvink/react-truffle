import React, { Component } from "react";
import getWeather from "./Weather";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, accounts: null, weather: null, loading: true, drizzleState: null, stackId:null };
  componentDidMount = async () => {
      const { drizzle } = this.props;
// subscribe to changes in the store
     this.unsubscribe = drizzle.store.subscribe( async () => {
// every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      //get accounts
      const accounts = drizzleState.accounts;
      // const weather = await getWeather("Rotterdam");
   
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState, accounts }, this.readValue);
      }
    });
  };
  compomentWillUnmount() {
    this.unsubscribe();
  }

  onChangeCity = async (e) => {
    let {value} = e.target;
    const weather = await getWeather(value);
    this.setState({ weather });
  }

  readValue = async () => {
    const { drizzle } = this.props;

    const contract = drizzle.contracts.SimpleStorage;
   //     check to see if it's ready, if so, update local component state
   //      let drizzle know we want to watch 'sum'
    var value = await contract.methods.get().call()
    console.log(value)

    if(value) this.setState({storageValue: value})
  };

  setValue = () => {
    const { drizzleState } = this.state;
    const { drizzle} = this.props;
    const contract = drizzle.contracts.SimpleStorage;
// let drizzle know we want to call the `add` method with `value1 and value2`
    const stackId = contract.methods["set"].cacheSend(1000 ,{
      from: drizzleState.accounts[0], gas: 2000000
    });
// save the `stackId` for later reference
    this.setState({ stackId });
  };
  render() {
    if (this.state.loading ) {
      return <div>Loading Drizzle...</div>;
    }
// if it exists, then we display its value
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
                  <select className="form-control" > 
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
                  <button type="button" onClick={this.setValue} className="btn btn-primary">Plaats weddenschap</button>
                </div>
              </div>
              <div>
                <h4>Het is nu</h4>
                {/* <h1>{Math.round(this.state.weather.main.temp)} C°</h1>
                <h3>in {this.state.weather.name}</h3> */}
              </div>
            </form>
          </div>
          <div className="col-1">

          </div>
          <div className="card col-4">
            <h2>Wallet</h2>
            <p>The stored value is: {this.state.storageValue && this.state.storageValue}</p>
            <h3>Accounts: </h3>
            <ul>
              <li>{this.state.accounts && this.state.accounts[0]}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

/*} onChange={this.onChangeCity}*/
