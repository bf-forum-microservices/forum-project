import {Link, useNavigate} from 'react-router-dom'
import { isAuthenticated } from "../auth";
import logo from '../images/logo.svg'
import './Navbar.css'

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className='full-navbar'>
            <ul className='navbar'>
                <Link to='/'>
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                <div className='nav-elements'>
                    {!isAuthenticated() ? <Link to="/login">Login</Link> : <button onClick={handleLogout} className="nav-button">Logout</button> }
                    <Link to="/register">Register</Link> {/* change later once authorization happens*/}
                    <Link to="/home">Home Page</Link> {/* change later once authorization happens*/}
                    {/*<Link to="/admin/home">Admin Home</Link>*/}
                    <Link to="/profile">My Profile</Link> {/* Replace 1 with dynamic user ID when available */}
                    <Link to="/contactus">Contact Admin</Link>
                    <Link to="/posts/123">Post Detail</Link> {/* Replace 123 with actual post ID */}
                    <Link to="/messages">Messages</Link>
                    <Link to="/users">Manage Users</Link>
                    <Link to="/tokenValidation">Token Validation</Link>
                </div>
            </ul>
        </div>
    )
}

export default Navbar;