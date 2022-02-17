// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IPriceOracle.sol";
import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./IWETHGateway.sol";

contract BorrowDai {
	using SafeMath for uint;

	mapping(address => uint256) public totalEthDeposited;
	mapping(address => uint256) public totalDaiBorrowed;
	string public name = "Borrow Dai";

	event Borrowed(
		uint256 daiEthPrice,
		uint256 amountDai,
		uint256 amountEth,
		address user,
		uint256 timestamp
	);

	IWETHGateway public IWETH;
	ILendingPool public lendingPool;
	ILendingPoolAddressesProvider public provider;
	IPriceOracle public oracle;
	address aWETH;
	address addressLendingPool;
	address DAI;
	uint256 public daiEthPrice;

	constructor() {
		IWETH = IWETHGateway(address(0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04));
		provider = ILendingPoolAddressesProvider(address(0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5));
		addressLendingPool = provider.getLendingPool();
		lendingPool = ILendingPool(addressLendingPool);
		oracle = IPriceOracle(address(0xA50ba011c48153De246E5192C8f9258A2ba79Ca9));
		aWETH = address(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);
		DAI = address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
		daiEthPrice = oracle.getAssetPrice(DAI);
	}

	receive() external payable {
	}

	function borrow(uint256 DAIamount) external payable {
		totalEthDeposited[msg.sender] = totalEthDeposited[msg.sender].add(msg.value);

		address onBehalfOf = address(this);
		uint16 referralCode = 0;
		uint256 variableRate = 1;

		IWETH.depositETH{value: msg.value}(addressLendingPool, onBehalfOf, referralCode);

		uint256 daiEth = oracle.getAssetPrice(DAI);
		daiEthPrice = daiEth;
		assert(daiEth != 0);

		lendingPool.borrow(DAI, DAIamount, variableRate, referralCode, onBehalfOf);
		totalDaiBorrowed[msg.sender] = totalDaiBorrowed[msg.sender].add(DAIamount);

		IERC20 daiToken = IERC20(DAI);
		require(daiToken.transfer(msg.sender, DAIamount));

		emit Borrowed(daiEthPrice, DAIamount, msg.value, msg.sender, block.timestamp);
	}
}