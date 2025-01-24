// const Web3 = require('web3');
// const axios = require("axios");
// const Order = require("../models/Order"); // Assume you have an Order model in your backend

// // Ethereum Configuration
// const web3 = new Web3("https://rinkeby.infura.io/v3/d6866643a1a6464eb2f568f99c20f620"); // Replace with your Infura project ID
// const escrowAddress = "YOUR_ESCROW_CONTRACT_ADDRESS"; // Replace with your deployed contract address
// const escrowABI = [/* Your Escrow Contract ABI */];
// const escrowContract = new web3.eth.Contract(escrowABI, escrowAddress);

// // Handle Ethereum Payment
// exports.handleEthereumPayment = async (req, res) => {
//   try {
//     const { orderId, buyerWallet } = req.body;

//     // Fetch order details
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Create a transaction in the escrow contract
//     const receipt = await escrowContract.methods
//       .createTransaction(order.vendorWallet)
//       .send({
//         from: buyerWallet,
//         value: web3.utils.toWei(order.totalPrice.toString(), "ether"),
//       });

//     // Update order status to 'processed'
//     order.status = "processed";
//     await order.save();

//     res.status(200).json({ message: "Payment successful", receipt });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Ethereum payment failed" });
//   }
// };

// // Handle Bitcoin Payment
// exports.handleBitcoinPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;

//     // Fetch order details
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Create a transaction with Blockcypher API
//     const response = await axios.post("https://api.blockcypher.com/v1/btc/test3/txs/new", {
//       inputs: [{ addresses: ["YOUR_BITCOIN_WALLET_ADDRESS"] }],
//       outputs: [{ addresses: [order.vendorWallet], value: order.totalPrice * 1e8 }],
//     });

//     // Update order status to 'processed'
//     order.status = "processed";
//     await order.save();

//     res.status(200).json({ message: "Bitcoin payment successful", transaction: response.data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Bitcoin payment failed" });
//   }
// };
