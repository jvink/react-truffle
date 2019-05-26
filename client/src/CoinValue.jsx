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
                <div>
                    {items.map(item => (
                        <div>
                            <label>Ether</label>
                            <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">@</span>
                            </div>
                            <input type="number" className="form-control" placeholder="Dollar" required onChange={this.calculate} min="1" max="10"/>
                            <div className="container small border" placeholder="0">{ether} Ether</div>
                            </div>
                        </div>
                    ))}
                </div>                
            );
        }
    }
}

export default CoinValue;