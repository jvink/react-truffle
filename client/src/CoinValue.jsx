import React, {Component} from 'react';

class CoinValue extends Component {
    state = {
        items: [],
        isLoaded: false,
        ether: null,
    }

    componentDidMount() {
        fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
        .then(res => res.json())
        .then(json => {
            this.setState({
                isLoaded: true,
                items: json,
            })
        });      
    }

    calculate = (e) => {
        const { items } = this.state
        let test = items.map(i => i.price_usd)
        let test2 = 1 / parseFloat(test)
        let bet = e.target.value * test2

        this.setState({ether: bet})
    }

    render() {

        const { isLoaded, items , ether} = this.state        

        if (!isLoaded) {
            return <div>loading...</div>
        }

        else {
            return(
                <div >
                    {items.map(item => (
                        <div className="container">
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="card col-3">
                                    {item.price_usd}
                                </div>
                                <div className="col-1"></div>
                                <div className="card col-4">
                                    {ether} 
                                </div>
                            </div>
                        </div>
                    ))}
                    <input type="number" className="form-control" placeholder="dollar" required onChange={this.calculate}/>
                </div>
            );
        }
    }
}

export default CoinValue;