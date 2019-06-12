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
  componentWillReceiveProps = (props)=>{
    this.setState({bets: props.bets})
  }

  checkWin = async () => {
    const { drizzle, drizzleState } = this.props;
    
      //   const checkDate = async () => {
      // changeOutcome(drizzle, drizzleState, this.state.bets);
      // }
  
      if(this.state.bets){
         // checkDate();
      }  
    }

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask...</div>;
    }
    const { drizzleState, storageValue, drizzle } = this.props;
    const { bets, walletBalance } = this.state;
    console.log(drizzleState);
    console.log(this.state.bets)
    if(drizzleState){
      
    }
  
    // if it exists, then we display its value
    return (
      <div className="card col-4">
        <h2>Wallet</h2>
        <p>The stored value is: {walletBalance}</p>
        <h4>Accounts: </h4>
        <ul>
          <li>{drizzleState && drizzleState.accounts[0]}</li>
        </ul>
        <h4>Your bets:</h4>
        {bets && bets.map((bet, i) => {
           if (parseInt(bet.outcome) === 1)  {
            return <BetComponent bet={bet} keyTest={i} type={1} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={(betId) => this.props.onClickSetBetId(betId)}/>;
          } else {
            return <BetComponent bet={bet} keyTest={i} type={0} onClickDetail={(bet) => this.props.onClickDetail(bet)} onClickSetBetId={this.props.onClickSetBetId}/>;
            }
          })
        }
          <button type="button" disabled={bets&&bets.length===0} onClick={this.checkWin} className="btn btn-success mb-4">Kijk of gewonnen</button>

      </div>
    );
  }
}
export default App;



// setValue = async () => {
//   const { drizzle, drizzleState } = this.props;
//   const contract = drizzle.contracts.SimpleStorage;
//   // let drizzle know we want to call the `add` method with `value1 and value2`
//   const stackId = await contract.methods["set"].cacheSend(100, {
//     from: drizzleState.accounts[0], gas: 2000000
//   });
//   // save the `stackId` for later reference
//   this.setState({ stackId });
// };