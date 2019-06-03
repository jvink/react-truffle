import React, { Component } from "react";
import BetForm from "./components/BetForm";
import BetList from "./components/BetList";
import { getBetsByUser } from "./BetFunctions";
import "./App.css";

class App extends Component {
  state = {loading: true, drizzleState: null, storageValue:0 , stackId:null, oracleReady: false, bets: []};
  inzet = React.createRef();
  city = React.createRef();
  time = React.createRef();
  componentDidMount = async () => {
      const { drizzle } = this.props;
// subscribe to changes in the store
     this.unsubscribe = drizzle.store.subscribe( async () => {
// every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      //get accounts
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState}, this.readValue);
      }
    });
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

      if(!this.state.oracleReady){
      await contract2.methods.getOracleAddress().call()
    .then(address => {
      if(parseInt(address)!== 0 && !isNaN(parseInt(address))) {
      this.setState({oracleReady: true});
      }

      return address;}, 
    () => console.log("first enter oracle address"));

      }
     this.setState({bets: await getBetsByUser(drizzle)});
     var value = await contract.methods.get().call()
      if(value) this.setState({storageValue: value})
    }
    catch{
      alert("Wait few seconds then restart browser, probably the contracts take time to deploy.")
    }
  };

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask, en Contracts...</div>;
    }
    const { drizzle } = this.props;
    const { drizzleState, storageValue, oracleReady, bets } = this.state;
    return (
      <div className="container">
        <div className="row">
            <BetForm drizzle={drizzle} drizzleState={drizzleState} oracleReady={oracleReady}/>
           <div className="col-1">
       
          </div>
            <BetList drizzle={drizzle} drizzleState={drizzleState} storageValue={storageValue} bets={bets}/>  
        </div>
      </div>
    );
  }
}
export default App;

