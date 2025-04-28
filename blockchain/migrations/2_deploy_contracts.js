const Escrow = artifacts.require("Escrow");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(Escrow, accounts[0], accounts[1], web3.utils.toWei("1", "ether"), accounts[2]);
};