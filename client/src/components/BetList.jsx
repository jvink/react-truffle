import React, { Component } from "react";
import "../css/App.css";
import BetComponent from "./Bet";
import { changeOutcome } from "../BetFunctions";

class App extends Component {
  state = { stackId: null, bets: null, walletBalance: 0 };

  componentDidMount(){
    const { drizzle, drizzleState } = this.props;
   
    if(drizzleState) {
      const accountbalance = parseFloat(drizzleState.accountBalances[drizzleState.accounts[0]]/1000000000000000000);
      this.setState({walletBalance: accountbalance})
    }  
  }
 
  componentWillReceiveProps = async(props)=>{
    await this.setState({bets: props.bets})
  }

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask...</div>;
    }
    const { drizzleState, storageValue, drizzle } = this.props;
    const { bets, walletBalance } = this.state;
  
    // if it exists, then we display its value
    return (
      <div className="card col-4">
        <h2>Wallet</h2>
        <h4>Balans: </h4>
        <ul>
          <li>{drizzleState && walletBalance}</li>
        </ul>
        <h4>Jouw adres: </h4>
        <ul>
          <li>{drizzleState && drizzleState.accounts[0]}</li>
        </ul>
        <h4>Jouw weddenschappen:</h4>
        {bets && bets.map((bet, i) =>  {
           if (parseInt(bet.outcome) === 0)  {
            return <BetComponent bet={bet} keyTest={i} type={0} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={(betId) => this.props.onClickSetBetId(betId)}/>;
           }else if (parseInt(bet.outcome) === 2){
            return <BetComponent bet={bet} keyTest={i} type={2} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={(betId) => this.props.onClickSetBetId(betId)}/>;
           } 
          else {
            return <BetComponent bet={bet} keyTest={i} type={3} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={this.props.onClickSetBetId}/>;
            }
          })
        }
      </div>
    );
  }
}
export default App;
