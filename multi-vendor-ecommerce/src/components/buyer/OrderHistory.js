import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import config from '../config';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${config.base_url}api/buyer/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order history.");
    }
  };

  const handleViewProducts = (products) => {
    setSelectedProducts(products);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProducts([]);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Order History</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>${order.totalPrice}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{new Date(order.updatedAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleViewProducts(order.products)}
                  >
                    View Products
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Viewing Products */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProducts.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((item) => (
                  <tr key={item._id}>
                    <td>{item.product.name}</td>
                    <td>${item.product.price}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available for this order.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderHistory;
