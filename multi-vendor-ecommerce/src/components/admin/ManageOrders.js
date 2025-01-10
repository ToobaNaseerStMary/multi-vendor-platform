import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import config from '../config';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // For viewing products
    const [showModal, setShowModal] = useState(false);

    // Fetch Orders
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.base_url}api/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Update Order Status
    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${config.base_url}api/admin/orders/${orderId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Order status updated successfully!');
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // View Products
    const handleViewProducts = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Manage Orders</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Buyer</th>
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
                            <td>
                                {order.buyer.username} <br />
                                <small>{order.buyer.email}</small>
                            </td>
                            <td>${order.totalPrice}</td>
                            <td>
                                <select
                                    className="form-control"
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{new Date(order.updatedAt).toLocaleString()}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleViewProducts(order)}
                                >
                                    View Products
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Viewing Products */}
            {selectedOrder && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Products in Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.products.map((item) => (
                                    <tr key={item.product._id}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product.description}</td>
                                        <td>${item.product.price}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ManageOrders;
