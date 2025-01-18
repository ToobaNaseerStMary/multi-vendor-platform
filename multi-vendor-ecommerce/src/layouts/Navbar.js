import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add your custom styles here
import axios from 'axios'; // For API calls (if needed)
import config from './config'; // Update with your config path

const Navbar = () => {
    const [userRole, setUserRole] = useState(null); // State to store user role

    useEffect(() => {
        // Fetch user role from API or local storage
        const fetchUserRole = async () => {
            try {
                // If role is stored locally
                const role = localStorage.getItem("role");
                if (role) {
                    setUserRole(role);
                } else {
                    // If fetching role from the backend
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`${config.base_url}api/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log(response);
                    setUserRole(response.data.role); // Assume `role` is part of the response
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
            }
        };

        fetchUserRole();
    }, []);

    // Determine the dashboard route based on role
    const getDashboardRoute = () => {
        if (userRole === 'admin') return '/admin/dashboard';
        if (userRole === 'vendor') return '/vendor/dashboard';
        if (userRole === 'buyer') return '/buyer/dashboard';
        return '/'; // Default route
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-orange">
            <div className="container">
                <Link className="navbar-brand" to="/">Shop Sizzle</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            {userRole ? (
                                <Link className="nav-link" to={getDashboardRoute()}>
                                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
                                </Link>
                            ) : (
                                <span className="nav-link disabled">Loading...</span>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
