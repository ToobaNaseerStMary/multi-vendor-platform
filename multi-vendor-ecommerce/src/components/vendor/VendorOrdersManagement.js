import React, { useState, useEffect } from "react";
import axios from "axios";
import config from '../config';

const VendorOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const statusOptions = ["confirmed", "processed", "shipped", "delivered", "cancelled"];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${config.base_url}api/vendor/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${config.base_url}api/vendor/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError("Failed to update order status");
    }
  };

  const handleViewProducts = (products) => {
    setSelectedProducts(products); // Set the selected products for the modal
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedProducts([]); // Clear the selected products
  };

  return (
    <div className="vendor-dashboard">
      <h1>Manage Orders</h1>
      {error && <p className="error">{error}</p>}

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by buyer username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Filter by Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button onClick={fetchOrders}>Apply Filters</button>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <h2>Orders List</h2>
        <table>
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.buyer.username}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleViewProducts(order.products)}>View Products</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Products */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Products in Order</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
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
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersManagement;
