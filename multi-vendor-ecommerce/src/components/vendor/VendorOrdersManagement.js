import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import "bootstrap/dist/css/bootstrap.min.css";

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
    setSelectedProducts(products);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProducts([]);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Vendor Order Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters Section */}
      <div className="mb-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control me-3"
          placeholder="Search by buyer username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
        <select
          className="form-select me-3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Filter by Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={fetchOrders}>
          Apply Filters
        </button>
      </div>

      {/* Orders Table */}
      <div className="table-responsive">
        <h2 className="mb-3">Orders List</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th className="text-danger">Buyer</th>
              <th className="text-danger">Status</th>
              <th className="text-danger">Total Price</th>
              <th className="text-danger">Created At</th>
              <th className="text-danger">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.buyer.username}</td>
                  <td>
                    <select
                      className="form-select"
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
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewProducts(order.products)}
                    >
                      View Products
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Products */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Products in Order</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th className="text-danger">Name</th>
                      <th className="text-danger">Price</th>
                      <th className="text-danger">Quantity</th>
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
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersManagement;
