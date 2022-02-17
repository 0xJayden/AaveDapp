const Borrow = artifacts.require("BorrowDai")

module.exports = async function (deployer) {
	await deployer.deploy(Borrow)
}