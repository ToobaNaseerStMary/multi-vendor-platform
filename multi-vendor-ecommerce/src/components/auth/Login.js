import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';
import './Auth.css'; // Ensure this import is correct
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/tokenService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${config.base_url}api/auth/login`, formData);
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
            alert('Login successful');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/signup" className="auth-link">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
