
 const deploy = (contract, netId, web3) => {
    const deployedNetwork = contract.networks[netId];
    const instance = new web3.eth.Contract(
      contract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    return instance;
  }

export default deploy;