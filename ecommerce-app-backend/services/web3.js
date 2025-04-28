const Web3 = require("web3");
const path = require("path");
const { HttpProvider } = require("web3"); // Import HttpProvider separately
require("dotenv").config();

// Connect to local Ganache blockchain
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));  // Correct way for Web3

// Resolve the correct path to Escrow.json
const escrowABIPath = path.resolve(__dirname, "../../blockchain/build/contracts/Escrow.json");
const escrowABI = require(escrowABIPath).abi;

// Use your deployed contract address from Ganache migration logs
const escrowAddress = "0x90CA679617C11B952f7Cf9D241c1FFFaE3325BC8"; // Replace this with actual contract address

// Create contract instance
const escrowContract = new web3.eth.Contract(escrowABI, escrowAddress);

module.exports = { web3, escrowContract };
