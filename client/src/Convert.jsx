


 export const Convert =  async() => {
    const capture =  await fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
            .then(res => res.json())
            .then(json => json);
    return capture;
}

