import React, { Component } from "react";
import "../css/App.css";
import BetComponent from "./Bet";


class App extends Component {
  state = { stackId: null, bets: null };


  componentWillReceiveProps = async (props) => {
    this.setState({ bets: props.bets, drizzle: props.drizzle })
  }

  setValue = async () => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.SimpleStorage;
    // let drizzle know we want to call the `add` method with `value1 and value2`
    const stackId = await contract.methods["set"].cacheSend(100, {
      from: drizzleState.accounts[0], gas: 2000000
    });
    // save the `stackId` for later reference
    this.setState({ stackId });
  };

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask...</div>;
    }

    const { drizzleState, storageValue } = this.props;
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
        {bets && bets.map((bet, i) => {
          if (bet.made_on > bet.weather_date) {
            return <BetComponent bet={bet} keyTest={i} type={0} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={(betId) => this.props.onClickSetBetId(betId)}/>;
          } else {
            return <BetComponent bet={bet} keyTest={i} type={1} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={this.props.onClickSetBetId}/>;
          }
        }
        )}
      </div>
    );
  }
}
export default App;