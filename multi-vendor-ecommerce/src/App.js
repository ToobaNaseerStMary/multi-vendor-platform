import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminSignup from './components/auth/AdminSignup';
import Dashboard from './components/admin/Dashboard';
import CategoryCrud from './components/admin/CategoryCrud';
import UsersManagement from './components/admin/UsersManagement';
import ProductManagement from './components/admin/ProductsManagement';
import ManageOrders from './components/admin/ManageOrders';
import VendorDashboard from './components/vendor/Dashboard';
import ProductsManagement from './components/vendor/ProductsManagement';
import VendorOrdersManagement from './components/vendor/VendorOrdersManagement';
import BuyerDashboard from './components/buyer/Dashboard';
import GetProducts from './components/buyer/GetProducts';

function App() {
    // Custom Hook to Hide Navbar on Specific Pages
    const HideNavbar = ({ children }) => {
        const location = useLocation();
        const pathsWithoutNavbar = ['/login', '/signup', '/admin-signup'];
        const showNavbar = !pathsWithoutNavbar.includes(location.pathname);

        return (
            <>
                {showNavbar && <Navbar />}
                <div className="container mt-4">{children}</div>
            </>
        );
    };

    return (
        <Router>
            <HideNavbar>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin-signup" element={<AdminSignup />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/categories" element={<CategoryCrud />} />
                    <Route path="/admin/users" element={<UsersManagement />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/orders" element={<ManageOrders />} />
                    <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                    <Route path="/vendor/products" element={<ProductsManagement />} />
                    <Route path="/vendor/orders" element={<VendorOrdersManagement />} />
                    <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                    <Route path="/buyer/get-products" element={<GetProducts />} />
                </Routes>
            </HideNavbar>
        </Router>
    );
}

export default App;
