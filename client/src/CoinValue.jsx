import React, { Component } from 'react';

class CoinValue extends Component {
    state = {
        items: [],
        isLoaded: false,
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
        let ether = items.map(i => i.price_usd)
        let dollar = 1 / parseFloat(ether)
        let bet = e.target.value * dollar

        this.props.onChangeValue(bet);
    }

    render() {

        const { isLoaded, items } = this.state

        if (!isLoaded) {
            return <div>loading...</div>
        }

        else {
            return (
                <>
                    {items.map((i, index) => (
                        <div className="input-group" key={index}>
                            <input type="number" className="form-control" placeholder="Bedrag in dollars" required onChange={this.calculate} min="1" style={{width: '100%'}} />
                        </div>
                    ))}
                </>
            );
        }
    }
}

export default CoinValue;