import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import BorrowDai from '../abis/BorrowDai.json'

const BigNumber = require('bignumber.js')
const toWei = (n) => (n * 10**18).toString()
const fromWei = (n) => (+n / 10**18).toString()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: '',
      account: '',
      borrow: '',
      ethDeposit: '0',
      daiEthPrice: '0',
      safeMaxBorrow: '0',
      totalEthDeposited: '0',
      totalDaiBorrowed: '0'
    }
    this.handleChange = this.handleChange.bind(this)
    this.borrowDai = this.borrowDai.bind(this)
  }

  async componentWillMount() {
    await this.loadBlockchainData()
    await this.loadDaiEthPrice()
    await this.loadTotalEthDeposited()
    await this.loadTotalDaiBorrowed()
  }

  async loadBlockchainData () {
    if(typeof window.ethereum != 'undefined') {
      const web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.setState({web3: web3})
      const accounts = await web3.eth.getAccounts()
      const account = await accounts[0]
      this.setState({account: account})
      const networkId = await web3.eth.net.getId()
      const borrow = new web3.eth.Contract(BorrowDai.abi, BorrowDai.networks[networkId].address)
      this.setState({borrow})
    } else {
      window.alert('Please install Metamask.')
    }
  }

  async loadTotalDaiBorrowed () {
    let totalDaiBorrowed = await this.state.borrow.methods.totalDaiBorrowed(this.state.account).call()
    totalDaiBorrowed = new BigNumber(fromWei(totalDaiBorrowed)).toFixed(2)
    await this.setState({totalDaiBorrowed})
  }

  async loadTotalEthDeposited () {
    let totalEthDeposited = await this.state.borrow.methods.totalEthDeposited(this.state.account).call()
    totalEthDeposited = fromWei(totalEthDeposited)
    await this.setState({totalEthDeposited})

  }

  async loadDaiEthPrice () {
    let daiEthPrice = await this.state.borrow.methods.daiEthPrice().call()
    daiEthPrice = fromWei(daiEthPrice).toString()
    await this.setState({daiEthPrice})
  }

  async handleChange (event) {
    const ethDeposit = toWei(event.target.value)
    await this.setState({ethDeposit})
  }

  async borrowDai () {
    const ltv = 0.8 // loan to value ratio for ETH
    const safetyFactor = 0.6 // to avoid liquidations
    const ethAmount = this.state.ethDeposit
    const maxSafeDeposit = ethAmount * ltv
    const daiPrice = this.state.daiEthPrice
    const maxSafeBorrow = maxSafeDeposit * safetyFactor / daiPrice / 10**18
    const safeMaxBorrow = new BigNumber(((new this.state.web3.utils.BN(maxSafeBorrow).toString()) * 10**18))
    await this.setState({safeMaxBorrow})
    await this.state.borrow.methods.borrow(safeMaxBorrow).send({ from: this.state.account, value: this.state.ethDeposit})
  }
  
  render() {
    return (
      <div className="content">
        <nav className="navbar fixed-top flex-md-nowrap shadow text-light">
            <a className="navbar-brand text-light" href="/#">Aave Borrow Dai DApp</a>
            <div className="account ml-auto text-light small">
              {this.state.account ? this.state.account : <button className="btn2 btn-sm" onClick={async () => {
                await window.ethereum.enable()
              }}>Connect</button>}
            </div>
        </nav>
        <div className="container-fluid mt-5 pt-2">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center text-dark">
              <div className="mr-auto ml-auto">
                <h1>Enter ETH Amount & Click Button to Borrow Dai</h1>
                <form className="row mt-5 w-50 mr-auto ml-auto" onSubmit={e => {
                  e.preventDefault()
                  this.borrowDai()
                }}>
                  <div className="col-12 col-sm pr-sm-2">
                    <input
                    type="text"
                    placeholder="ETH Amount"
                    onChange={this.handleChange}
                    className="form-control form-control-sm bg-light text-muted"
                    required />
                  </div>
                  <button type="submit" className="btn text-light btn-block btn-sm w-50">Borrow Dai</button>
                </form>
                <h2 className="mt-5">Total ETH Deposited: {this.state.totalEthDeposited}</h2>
                <h2>Total DAI Borrowed: {this.state.totalDaiBorrowed}</h2>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
