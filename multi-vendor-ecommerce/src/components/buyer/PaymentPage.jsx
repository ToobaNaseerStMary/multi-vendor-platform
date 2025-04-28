import React, { useState } from "react";
import Web3 from "web3";
import EscrowABI from "../../contracts/Escrow.json";
import config from "../config";
import axios from "axios";

const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const totalPrice = parseFloat(localStorage.getItem("totalPrice")) || 0;
console.log(totalPrice);

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("ethereum");
  const [ethAddress, setEthAddress] = useState("");

  const handlePayment = async () => {
    if (paymentMethod === "ethereum") {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);

        // Request connection to MetaMask wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setEthAddress(account);
        console.log("toobss");
        console.log(account);

        // Create the contract instance
        const escrowContract = new web3.eth.Contract(
          EscrowABI.abi,
          "0x90CA679617C11B952f7Cf9D241c1FFFaE3325BC8" // your deployed escrow contract address
        );
        console.log("toobss1");

        // Convert the total price to Wei
        const amountInWei = web3.utils.toWei("0.00001", "ether");
        console.log("hellodearrr");

        // Deposit payment to the escrow contract
        const receipt = await escrowContract.methods.deposit().send({
          from: account,
          value: amountInWei,
        });
        console.log("toobss23");

        // Save the order details after payment
        await axios.post(
          `${config.base_url}api/buyer/orders`,
          {
            products: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            paymentMethod: "ethereum",
            ethTransactionHash: receipt.transactionHash,
            account: account
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        alert("Ethereum payment successful! Order placed.");

      } catch (err) {
        console.error(err);
        alert("Ethereum payment failed. See console for details.");
      }
    } else if (paymentMethod === "bitcoin") {
      // Bitcoin testnet payment handling
      alert(`Please transfer ${totalPrice} BTC to your vendor's Bitcoin testnet address. (Testnet BTC address: 1YourVendorBitcoinAddressHere)`);

      await axios.post(
        `${config.base_url}api/buyer/orders`,
        {
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          paymentMethod: "bitcoin",
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Order placed! Waiting for manual Bitcoin confirmation.");
    }
  };

  return (
    <div className="payment-container">
      <h2>Select Payment Method</h2>

      <div>
        <input
          type="radio"
          id="ethereum"
          value="ethereum"
          checked={paymentMethod === "ethereum"}
          onChange={() => setPaymentMethod("ethereum")}
        />
        <label htmlFor="ethereum">Pay with Ethereum (Sepolia Testnet)</label>
      </div>

      <div>
        <input
          type="radio"
          id="bitcoin"
          value="bitcoin"
          checked={paymentMethod === "bitcoin"}
          onChange={() => setPaymentMethod("bitcoin")}
        />
        <label htmlFor="bitcoin">Pay with Bitcoin (Testnet)</label>
      </div>

      <button onClick={handlePayment} className="btn btn-primary mt-3">
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
