import { Link } from 'react-router-dom'
import logo from '../images/logo.svg'
import './Navbar.css'

const Navbar = () => {
    return (
        <div className='full-navbar'>
            <ul className='navbar'>
                <Link to='/'>
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                <div className='nav-elements'>
                    <Link to="/users/login">Login</Link>
                    <Link to="/users/register">Register</Link> {/* change later once authorization happens*/}
                    <Link to="/user/home">User Home</Link> {/* change later once authorization happens*/}
                    <Link to="/admin/home">Admin Home</Link>
                    <Link to="/users/1/profile">My Profile</Link> {/* Replace 1 with dynamic user ID when available */}
                    <Link to="/contactus">Contact Admin</Link>
                    <Link to="/posts/123">Post Detail</Link> {/* Replace 123 with actual post ID */}
                    <Link to="/messages">Messages</Link>
                    <Link to="/users">Manage Users</Link>
                </div>
            </ul>
        </div>
    )
}

export default Navbar;