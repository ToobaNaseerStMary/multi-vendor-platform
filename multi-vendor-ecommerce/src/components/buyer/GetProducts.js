import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import config from '../config';

const GetProducts = () => {
  const [products, setProducts] = useState({});
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.base_url}api/buyer/products?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.data);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalProducts / limit)) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Buyer Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div id="productsAccordion">
        {Object.entries(products).map(([categoryName, categoryProducts]) => (
          <div className="card mb-3" key={categoryName}>
            <div className="card-header" id={`heading-${categoryName}`}>
              <h2 className="mb-0">
                <button
                  className="btn btn-link text-decoration-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${categoryName}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${categoryName}`}
                >
                  {categoryName}
                </button>
              </h2>
            </div>

            <div
              id={`collapse-${categoryName}`}
              className="collapse"
              aria-labelledby={`heading-${categoryName}`}
              data-bs-parent="#productsAccordion"
            >
              <div className="card-body">
                <div className="row">
                  {categoryProducts.map((product) => (
                    <div className="col-md-4 mb-3" key={product._id}>
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">{product.description}</p>
                          <p className="card-text">
                            <strong>Price:</strong> ${product.price}
                          </p>
                          <p className="card-text">
                            <strong>Stock:</strong> {product.stock}
                          </p>
                          <p className="card-text">
                            <strong>Vendor:</strong> {product.vendor.username} (
                            {product.vendor.email})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(page - 1)}>
              Previous
            </button>
          </li>
          {[...Array(Math.ceil(totalProducts / limit)).keys()].map((pageNumber) => (
            <li
              className={`page-item ${page === pageNumber + 1 ? "active" : ""}`}
              key={pageNumber}
            >
              <button className="page-link" onClick={() => handlePageChange(pageNumber + 1)}>
                {pageNumber + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              page === Math.ceil(totalProducts / limit) ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={() => handlePageChange(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default GetProducts;
