import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config";
import "./style.css";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const web3 = new Web3(window.ethereum);

const GetProducts = () => {
  const [categories, setCategories] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [cartError, setCartError] = useState("");
  const token = localStorage.getItem("token");
  const [network, setNetwork] = useState("Ethereum");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.base_url}api/buyer/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response.data;
      setCategories(data);
      setActiveCategory(Object.keys(data)[0]); // Set the first category as active by default
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    }
  };

  const addToCart = (product) => {
    if (cart.length === 0 || vendorId === product.vendor._id) {
      setCart([...cart, { ...product, quantity: 1 }]);
      setVendorId(product.vendor._id);
      setCartError("");
    } else {
      setCartError("You can only add products from the same vendor.");
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    if (updatedCart.length === 0) setVendorId(null);
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    try {
      const orderProducts = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Save order details locally
      localStorage.setItem("cart", JSON.stringify(orderProducts));
      localStorage.setItem("totalPrice", totalPrice);
      localStorage.setItem("vendorId", vendorId);
      localStorage.setItem("network", network);

      // Redirect user to payment page
      navigate("/payment");

    } catch (err) {
      console.error(err);
      alert("Failed to initiate order.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Buyer Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {cartError && <div className="alert alert-danger">{cartError}</div>}

      {/* Categories Navigation */}
      <ul className="nav nav-tabs">
        {Object.keys(categories).map((categoryName) => (
          <li className="nav-item" key={categoryName}>
            <button
              className={`nav-link ${activeCategory === categoryName ? "active" : ""}`}
              onClick={() => setActiveCategory(categoryName)}
              style={{ color: "red", fontWeight: "bold" }}
            >
              {categoryName}
            </button>
          </li>
        ))}
      </ul>

      {/* Products Display */}
      <div className="mt-4">
        {activeCategory && categories[activeCategory].length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Vendor Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories[activeCategory].map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.vendor.username}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No products available in this category.</p>
        )}
      </div>

      {/* Cart Section */}
      <div className="mt-5">
        <h3>Cart</h3>
        {cart.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.stock}
                        onChange={(e) =>
                          updateQuantity(item._id, parseInt(e.target.value))
                        }
                      />
                    </td>
                    <td>${item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <select onChange={(e) => setNetwork(e.target.value)}>
                <option value="Ethereum">Ethereum</option>
                <option value="Bitcoin">Bitcoin</option>
            </select>
            <button className="btn btn-success" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>
    </div>
  );
};

export default GetProducts;
