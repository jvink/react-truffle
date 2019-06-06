import React, { Component } from "react";
import BetForm from "./components/BetForm";
import BetList from "./components/BetList";
import BetDetails from "./components/BetDetails";
import "./css/App.css";
import { getBetsByUser } from "./BetFunctions";


class App extends Component {
  state = { loading: true, drizzleState: null, storageValue: 0, stackId: null, oracleReady: false, bets: [], detail: null, changeContent: false, betId: null};
  inzet = React.createRef();
  city = React.createRef();
  time = React.createRef();
  componentDidMount = async () => {
    const { drizzle} = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(async () => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      //get accounts
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState }, this.readValue);
      }
    });
  };
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  readValue = async () => {

    /// Hier leest alle weddenschappen...
    // alle data die veranderbaar is
    const { drizzle } = this.props;
    try {
      const contract = drizzle.contracts.SimpleStorage;
      const contract2 = drizzle.contracts.WeatherBets;
console.log("komt ie hier nog langs?")
      if (!this.state.oracleReady) {     
        await contract2.methods.getOracleAddress().call()
          .then(address => {
            if (parseInt(address) !== 0 && !isNaN(parseInt(address))) {
              console.log(parseInt(address))
              this.setState({ oracleReady: true });
            }
          }
          )
      }
     this.setState({bets: await getBetsByUser(drizzle)});
     var value = await contract.methods.get().call()
      if(value) this.setState({storageValue: value})
          }
      catch{
      alert("Wait few seconds then restart browser, probably the contracts take time to deploy.")
    }
  };

  setBetId = async (betId) => {
    this.setState({betId: betId});  
  }

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask, en Contracts...</div>;
    }
    const { drizzle } = this.props;
    const { drizzleState, storageValue, oracleReady, bets } = this.state;
    console.log(this.state.oracleReady)
    return (
      <div className="container">
        <div className="row">
          {
            this.state.changeContent ? <BetDetails bets={bets} onClickDetail={(changeContent) => this.setState({ changeContent: false})} betId={this.state.betId}/> 
            : <BetForm drizzle={drizzle} drizzleState={drizzleState} oracleReady={oracleReady} />

          }
          <div className="col-1">

          </div>
          <BetList drizzle={drizzle} drizzleState={drizzleState} storageValue={storageValue} bets={bets} onClickDetail={(changeContent) => this.setState({ changeContent: true })} 
          onClickSetBetId={this.setBetId} />
        </div>
      </div>
    );
  }
}
export default App;

