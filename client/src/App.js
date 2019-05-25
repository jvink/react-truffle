import React, { Component } from "react";

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import getWeather from "./Weather";
import BetDetails from "./components/betDetails";

import BetForm from "./components/BetForm";
import BetList from "./components/BetList";
import { getAllBets } from "./BetFunctions";
import "./App.css";

class App extends Component {
  state = { loading: true, drizzleState: null, storageValue:0 , stackId:null, oracleReady: false, bets: [], web3: null, accounts: null, contract: null, weather: null, changeContent: false };
  inzet = React.createRef();
  city = React.createRef();
  time = React.createRef();


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

      const changeContent = false;
      this.setState({changeContent})

      const { drizzle } = this.props;
      // subscribe to changes in the store
      this.unsubscribe = drizzle.store.subscribe( async () => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();
        //get accounts
        if (drizzleState.drizzleStatus.initialized) {
          this.setState({ loading: false, drizzleState}, this.readValue);
        }

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance }, this.runExample);
      }); 
    }catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    };
  };

  componentWillUnmount() {
    this.unsubscribe();
  }
  readValue = async () => {

    /// Hier leest alle weddenschappen...
    // alle data die veranderbaar is
    const { drizzle } = this.props;
    try{
      const contract = drizzle.contracts.SimpleStorage;
      const contract2 = drizzle.contracts.WeatherBets;

      await contract2.methods.getOracleAddress().call()
    .then(address => {
      if(parseInt(address)!== 0) {
      console.log(parseInt(address))
      this.setState({oracleReady: true});
      }

      return address;}, 
    () => console.log("first enter oracle address"));

    console.log(this.state.oracleReady)
    console.log("stap2")

    this.setState({bets: await getAllBets(drizzle)});

    var value = await contract.methods.get().call()
    console.log(value)

     if(value) this.setState({storageValue: value})
    }
    catch{
      alert("Wait few seconds then restart browser, probably the contracts take time to deploy.")
    }
  };

  initialStateChangeContent = async () => {
    this.setState({changeContent : false})
  }

  onClickChangeContent = async () => {
    this.setState({changeContent : true})
  }

  getBets = async () => {
    const { contract } = this.state;

    const response = await contract.methods.getAllCityBets().call();
    console.log(response);
  }

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask, en Contracts...</div>;
    }
    
    const { drizzle } = this.props;
    const { drizzleState, storageValue, oracleReady, bets } = this.state;
    return (

      <div className="container">
        <div className="row">
          <div className="card col-7" id="WeddenschappenCard">
            <form>
              {this.state.changeContent ? <BetDetails changecontent={this.initialStateChangeContent}/> 
                : 
                <div>
                  <h2>Weddenschappen</h2>
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
                </div>
              }


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
            {/* <h2>Wallet</h2>
            <p>The stored value is: {this.state.storageValue}</p>
            <h3>Accounts: </h3>
            <ul>
              {this.state.accounts.map((account, i) => {
                return <li key={i}>{account}</li>
              })}
            </ul> */}
            <h3> Lopende weddenschappen:</h3>
            <div>
              <div className="card col-10 offset-1" id="MijnWeddenschappenCard" onClick={this.onClickChangeContent}>
                <h4>Weddenschap 1</h4>
                <p>
                  Resultaat: Verloren <br/>
                  Datum: 22-05-2019
                </p>
              </div>
            </div>
            <BetForm drizzle={drizzle} drizzleState={drizzleState} oracleReady={oracleReady}/>
           <div className="col-1">
       
          </div>
            <BetList drizzle={drizzle} drizzleState={drizzleState} storageValue={storageValue} bets={bets}/>  
        </div>
      </div>
      </div>
    );
  }
}
export default App;

