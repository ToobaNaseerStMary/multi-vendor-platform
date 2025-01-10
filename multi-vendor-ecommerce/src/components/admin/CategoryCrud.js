import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

const CategoryCrud = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState({ id: '', name: '' });

    // Get Token from localStorage
    const token = localStorage.getItem('token');

    // Axios instance with Authorization Header
    const axiosInstance = axios.create({
        baseURL: config.base_url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('api/admin/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Create category
    const handleCreateCategory = async () => {
        if (!newCategory.trim()) {
            alert('Category name is required');
            return;
        }
        try {
            await axiosInstance.post('api/admin/categories', { name: newCategory });
            setNewCategory('');
            fetchCategories(); // Refresh categories after creation
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    // Update category
    const handleUpdateCategory = async () => {
        if (!editCategory.name.trim()) {
            alert('Category name is required');
            return;
        }
        try {
            await axiosInstance.put(`api/admin/categories/${editCategory.id}`, { name: editCategory.name });
            setEditCategory({ id: '', name: '' });
            fetchCategories(); // Refresh categories after update
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    // Delete category
    const handleDeleteCategory = async (id) => {
        try {
            await axiosInstance.delete(`api/admin/categories/${id}`);
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container">
            <h2>Manage Categories</h2>

            {/* Create Category */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleCreateCategory}>
                    Add Category
                </button>
            </div>

            {/* Category List */}
            <ul className="list-group mb-4">
                {categories.map((category) => (
                    <li key={category._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{category.name}</span>
                        <div>
                            <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => setEditCategory({ id: category._id, name: category.name })}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteCategory(category._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Category */}
            {editCategory.id && (
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Edit Category Name"
                        value={editCategory.name}
                        onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    />
                    <button className="btn btn-success" onClick={handleUpdateCategory}>
                        Update Category
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryCrud;
