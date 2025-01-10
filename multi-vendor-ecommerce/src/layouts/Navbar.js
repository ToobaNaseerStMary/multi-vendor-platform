import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add your custom styles here

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-orange">
            <div className="container">
                <Link className="navbar-brand" to="/">Shop Sizzle</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
