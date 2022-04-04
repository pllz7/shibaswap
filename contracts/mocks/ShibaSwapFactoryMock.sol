// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../uniswapv2/UniswapV2Factory.sol";

contract ShibaSwapFactoryMock is UniswapV2Factory {
    address[] coinAddress = [address(0x0000000000000000000000000000000000000000)];
    constructor(address _feeToSetter) public UniswapV2Factory(_feeToSetter, coinAddress) {}
}