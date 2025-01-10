import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        role: '',
        isAdminApproved: '',
    });

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`${config.base_url}api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []); // No dependencies because it does not rely on props or other state

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user) => {
        setEditingUserId(user._id);
        setFormData({
            email: user.email,
            username: user.username,
            role: user.role,
            isAdminApproved: user.isAdminApproved,
        });
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`${config.base_url}api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            alert('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${config.base_url}api/admin/users/${editingUserId}`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            alert('User updated successfully');
            setEditingUserId(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Users Management</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Admin Approved</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isAdminApproved ? 'Yes' : 'No'}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUserId && (
                <div className="card mt-4 p-4">
                    <h4>Edit User</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <select
                                name="role"
                                className="form-control"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="admin">Admin</option>
                                <option value="buyer">Buyer</option>
                                <option value="vendor">Vendor</option>
                            </select>
                        </div>
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                name="isAdminApproved"
                                className="form-check-input"
                                checked={formData.isAdminApproved}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Admin Approved</label>
                        </div>
                        <button type="submit" className="btn btn-success">Save Changes</button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => setEditingUserId(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
