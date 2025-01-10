import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // For logout icon


const Dashboard = () => {
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/login'); // Redirect to login page
    };
    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link to="/admin/categories">Manage Categories</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/admin/users">Manage Users</Link> 
                </li>
                <li className="list-group-item">
                    <Link to="/admin/products">Manage Products</Link> 
                </li>
                <li className="list-group-item">
                    <Link to="/admin/orders">Manage Orders</Link> 
                </li>
            </ul>
            <div className="logout">
                    <FaSignOutAlt
                        size={24}
                        color="red"
                        style={{ cursor: 'pointer' }}
                        onClick={handleLogout}
                        title="Logout"
                    />
            </div>
        </div>
    );
};

export default Dashboard;
