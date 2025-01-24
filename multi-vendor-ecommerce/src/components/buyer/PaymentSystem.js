import React, { useState } from "react";
import axios from "axios";

const PaymentSystem = ({ orderId, totalAmount, sellerWallet }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handlePayment = async () => {
    if (!paymentMethod) {
      setStatusMessage("Please select a payment method.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      if (paymentMethod === "ethereum") {
        // Call backend Ethereum payment endpoint
        const response = await axios.post("/api/escrow/ethereum-payment", {
          orderId,
          buyerWallet: "YOUR_ETHEREUM_WALLET_ADDRESS", // Fetch this dynamically in production
        });
        setStatusMessage(response.data.message);
      } else if (paymentMethod === "bitcoin") {
        // Call backend Bitcoin payment endpoint
        const response = await axios.post("/api/escrow/bitcoin-payment", { orderId });
        setStatusMessage(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-system">
      <h2>Complete Your Payment</h2>
      <p>Order ID: {orderId}</p>
      <p>Total Amount: {totalAmount} ETH/BTC</p>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="ethereum"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Ethereum
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="bitcoin"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Bitcoin
        </label>
      </div>

      <button className="btn btn-primary mt-3" onClick={handlePayment} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>

      {statusMessage && <p className="status-message mt-3">{statusMessage}</p>}
    </div>
  );
};

export default PaymentSystem;
