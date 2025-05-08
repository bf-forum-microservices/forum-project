import { NavLink, useNavigate } from 'react-router-dom';
import { isAdmin, isAuthenticated } from "../auth";
import logo from '../images/logo.svg';
import './Navbar.css';

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className='full-navbar'>
            <ul className='navbar'>
                <NavLink to='/' className="logo-link">
                    <img src={logo} alt="Logo" className="logo" />
                </NavLink>
                <div className='nav-elements'>
                    {!isAuthenticated() ? (
                        <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
                    ) : (
                        <button onClick={handleLogout} className="nav-button">Logout</button>
                    )}
                    {!isAuthenticated() && (
                        <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
                    )}
                    {isAuthenticated() && (
                        <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home Page</NavLink>
                    )}
                    {isAuthenticated() && (
                        <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>My Profile</NavLink>
                    )}
                    <NavLink to="/contactus" className={({ isActive }) => isActive ? "active" : ""}>Contact Admin</NavLink>
                    {isAuthenticated() &&
                        (<NavLink to="/posts/123" className={({ isActive }) => isActive ? "active" : ""}>Post Detail</NavLink>
                    )}
                    {isAdmin() && (
                        <NavLink to="/messages" className={({ isActive }) => isActive ? "active" : ""}>Messages</NavLink>
                    )}
                    {isAdmin() && (
                        <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>Manage Users</NavLink>
                    )}
                    {isAuthenticated() && (
                        <NavLink to="/tokenValidation" className={({ isActive }) => isActive ? "active" : ""}>Token Validation</NavLink>
                    )}
                </div>
            </ul>
        </div>
    );
};

export default Navbar;
