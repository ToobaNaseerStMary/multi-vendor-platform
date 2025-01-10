import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editedProduct, setEditedProduct] = useState(null);

    // Fetch products
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.base_url}api/admin/products`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch categories for dropdown
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.base_url}api/admin/categories`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle product update
    const handleUpdateProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${config.base_url}api/admin/products/${productId}`,
                editedProduct,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log('Product updated successfully:', response.data);
            fetchProducts(); // Refresh the list of products after update
            setEditedProduct(null); // Clear edit form
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${config.base_url}api/admin/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            console.log('Product deleted successfully:', response.data);
            fetchProducts(); // Refresh the list of products after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Manage Products</h2>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Vendor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.category ? product.category.name : 'N/A'}</td>
                            <td>{product.vendor ? product.vendor.username : 'N/A'}</td>
                            <td>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => setEditedProduct(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger ml-2"
                                    onClick={() => handleDeleteProduct(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editedProduct && (
                <div className="mt-4">
                    <h3>Edit Product</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(editedProduct._id); }}>
                        <div className="mb-3">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editedProduct.name}
                                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                value={editedProduct.description}
                                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={editedProduct.price}
                                onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select
                                className="form-control"
                                value={editedProduct.category ? editedProduct.category._id : ''}
                                onChange={(e) =>
                                    setEditedProduct({
                                        ...editedProduct,
                                        category: categories.find((cat) => cat._id === e.target.value),
                                    })
                                }
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Update Product</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
