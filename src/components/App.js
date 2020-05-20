import React, { Component } from 'react';
import Web3 from 'web3';
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';
import Navbar from './Navbar';

import './App.css';

class App extends Component {

  async componentWillMount() {
    console.log("EXECUTING: componentWillMount()")
    await this.loadWeb3();
    console.log(window.web3);
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(this.state.account);

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    console.log(this.state.ethbalance)

    // Load Token
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      console.log("tokenBalance", tokenBalance.toString())
      this.setState({ tokenBalance : tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }
    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }
  }

  async loadWeb3() {
    console.log("EXECUTING: loadWeb3()")
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log('window.ethereum ~ Modern dapp browsers...');
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('window.web3 ~ Legacy dapp browsers...');
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: {},
      tokenBalance: '0',
      ethSwap: {},
      ethBalance: 0
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Hello World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;