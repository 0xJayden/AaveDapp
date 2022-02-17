import { ether, tokens, toWei, fromWei } from './helpers'

const Borrow = artifacts.require('./BorrowDai1')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Borrow', accounts => {
	const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
	const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
	const aweth = "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e"
	let borrow
	let balance
	let miniAbi
	let daiRef
	let awethref

	beforeEach(async () => {
		borrow = await Borrow.new()
		miniAbi = [
			{
		        "constant": true,
		        "inputs": [
		            {
		                "name": "_owner",
		                "type": "address"
		            }
		        ],
		        "name": "balanceOf",
		        "outputs": [
		            {
		                "name": "balance",
		                "type": "uint256"
		            }
		        ],
		        "payable": false,
		        "stateMutability": "view",
		        "type": "function"
		    },
		    {
		        "constant": true,
		        "inputs": [],
		        "name": "decimals",
		        "outputs": [
		            {
		                "name": "",
		                "type": "uint8"
		            }
		        ],
		        "payable": false,
		        "stateMutability": "view",
		        "type": "function"
	    	}
	    ]

	    daiRef = new web3.eth.Contract(miniAbi, dai)
	    awethref = new web3.eth.Contract(miniAbi, aweth)
	})

	describe('borrowing', () => {
		let amountDai
		let result

		beforeEach(async () => { 
			amountDai = tokens(1)
			result = await borrow.borrow(amountDai, { from: accounts[1], value: amountDai })
		})

		it('deposits ETH', async() => {
			let balanceOf
			balanceOf = await web3.eth.getBalance(accounts[1])
			console.log(`${fromWei(balanceOf)}`)
			balanceOf = await awethref.methods.balanceOf(borrow.address).call()
			console.log(`${fromWei(balanceOf)}`)
			//balanceOf = await borrow.totalEthDeposited(accounts[1])
			//console.log(`${fromWei(balanceOf)}`)
		})

		it('deposits DAI', async() => {
			let balanceOf
			balanceOf = await daiRef.methods.balanceOf(accounts[1]).call()
			console.log(`${fromWei(balanceOf)}`)
			//balanceOf = await borrow.totalDaiBorrowed(accounts[1])
			//console.log(`${fromWei(balanceOf)}`)
		})

		it('emits a event', async() => {
			const log = result.logs[0]
			const event = log.args
			event.amountDai.toString().should.equal(amountDai.toString())
			console.log(fromWei(event.amountDai).toString())
			console.log(fromWei(event.daiEthPrice).toString())
		})
	})
})