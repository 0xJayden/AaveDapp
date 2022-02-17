export const ether = (n) => {
	return new web3.utils.BN(
		web3.utils.toWei(n.toString(), 'ether')
	)
}

export const tokens = (n) => ether(n)

export const fromWei = (num) => web3.utils.fromWei(num.toString())