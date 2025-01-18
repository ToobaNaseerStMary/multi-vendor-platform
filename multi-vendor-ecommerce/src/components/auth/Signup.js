import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';
import './Auth.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/tokenService';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        role: 'buyer',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${config.base_url}api/auth/signup`, formData);
            console.log(response.data);
            setToken(response.data.token);
            switch (response.data.userObj.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'vendor':
                    navigate('/vendor/dashboard');
                    break;
                case 'buyer':
                    navigate('/buyer/dashboard');
                    break;
                default:
                    navigate('/');
            }
            alert('Signup successful');
        } catch (error) {
            console.error(error);
            alert('Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
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
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="form-control"
                            onChange={handleChange}
                        >
                            <option value="buyer">Buyer</option>
                            <option value="vendor">Vendor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Sign Up
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/login" className="auth-link">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
