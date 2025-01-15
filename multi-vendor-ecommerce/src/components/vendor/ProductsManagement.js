import React, { useState, useEffect } from "react";
import axios from "axios";
import config from '../config';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Ensure your token is correctly stored in localStorage

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.base_url}api/vendor/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.base_url}api/vendor/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post(
        `${config.base_url}api/vendor/products`,
        { ...newProduct, category: newProduct.category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
      setNewProduct({ name: "", description: "", price: "", category: "", stock: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to create product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || "",
      stock: product.stock,
    });
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(
        `${config.base_url}api/vendor/products/${editingProduct._id}`,
        { ...newProduct, category: newProduct.category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
      setEditingProduct(null);
      setNewProduct({ name: "", description: "", price: "", category: "", stock: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${config.base_url}api/vendor/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  return (
    <div className="vendor-dashboard">
      <h1>Vendor Dashboard</h1>
      {error && <p className="error">{error}</p>}

      {/* Product Form */}
      <div className="product-form">
        <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}>
          {editingProduct ? "Update Product" : "Create Product"}
        </button>
        {editingProduct && <button onClick={() => setEditingProduct(null)}>Cancel</button>}
      </div>

      {/* Products Table */}
      <div className="products-table">
        <h2>Manage Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.category?.name || "N/A"}</td>
                <td>{product.stock}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsManagement;
