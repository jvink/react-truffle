import React, { Component } from "react";
import "../App.css";
import BetComponent from "./Bet";
import { changeOutcome } from "../BetFunctions";
class App extends Component {
  state = { stackId: null, bets: null };

  componentWillReceiveProps = async (props) => {
    this.setState({ bets: await props.bets}) 
  }


  setValue = async () => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.SimpleStorage;
    // let drizzle know we want to call the `add` method with `value1 and value2`
    const stackId = await contract.methods["set"].cacheSend(100, {
      from: drizzleState.accounts[0], gas: 2000000
    });
    console.log(stackId)
    // save the `stackId` for later reference
    this.setState({ stackId });
  };

  checkWin = async () => {
    const { drizzle, drizzleState } = this.props;
    
        const checkDate = async () => {
      changeOutcome(drizzle, drizzleState, this.state.bets);
      }
  
      if(this.state.bets){
          checkDate();
      }  
    }

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask...</div>;
    }
    const { drizzleState, storageValue, drizzle } = this.props;
    const { bets } = this.state;

    // if it exists, then we display its value
    return (
      <div className="card col-4">
        <h2>Wallet</h2>
        <p>The stored value is: {storageValue && storageValue}</p>
        <h4>Accounts: </h4>
        <ul>
          <li>{drizzleState && drizzleState.accounts[0]}</li>
        </ul>
        <button type="button" onClick={this.setValue} className="btn btn-secondary mb-4">click here</button>
        <h4>Your bets:</h4>
        {bets && bets.map((bet, i) => { console.log(bet);
          if (parseInt(bet.outcome) === 1) {
            return <BetComponent bet={bet} key={i} type={1}/>;
          } else {
            return <BetComponent bet={bet} key={i} type={0}/>;
          }
        }
        )}

          <button type="button" disabled={bets&&bets.length===0} onClick={this.checkWin} className="btn btn-success mb-4">Kijk of gewonnen</button>

      </div>
    );
  }
}
export default App;