import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorOrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const token = localStorage.getItem('token');

    const statuses = ['confirmed', 'processed', 'shipped', 'delivered', 'cancelled'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('{{base_url}}api/vendor/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await axios.put(
                `{{base_url}}api/vendor/orders/${orderId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders(); // Refresh orders after status update
        } catch (error) {
            console.error('Error updating order status', error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterOrders(term, statusFilter);
    };

    const handleFilterChange = (e) => {
        const status = e.target.value;
        setStatusFilter(status);
        filterOrders(searchTerm, status);
    };

    const filterOrders = (searchTerm, status) => {
        let result = orders;
        if (searchTerm) {
            result = result.filter((order) =>
                order.products.some((product) => product.product.name.toLowerCase().includes(searchTerm))
            );
        }
        if (status) {
            result = result.filter((order) => order.status === status);
        }
        setFilteredOrders(result);
    };

    return (
        <div>
            <h1>Manage Orders</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={statusFilter} onChange={handleFilterChange}>
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Buyer</th>
                        <th>Products</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order._id}>
                            <td>
                                {order.buyer.username} <br />
                                {order.buyer.email}
                            </td>
                            <td>
                                {order.products.map((item) => (
                                    <div key={item._id}>
                                        {item.product.name} (x{item.quantity})
                                    </div>
                                ))}
                            </td>
                            <td>${order.totalPrice}</td>
                            <td>{order.status}</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorOrdersManagement;
