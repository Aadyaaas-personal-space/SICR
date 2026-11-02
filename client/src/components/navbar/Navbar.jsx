import { Link } from "react-router-dom";
import "./Navbar.css";
import NotificationBell from "../notifications/NotificationBell";

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-mark">S</span>
                    <span className="logo-text">SICR</span>
                </Link>

                {/* Navigation */}
                <nav className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/ecosystem">Ecosystem</Link>
                    <Link to="/dashboard">Roadmap</Link>

                    {/* Search / Discover */}
                    <Link to="/search">
                        🔍 Search
                    </Link>
                </nav>

                {/* Actions */}
                <div className="navbar-actions">
                    <Link to="/login" className="login-btn">
                        Login
                    </Link>

                    <Link to="/register" className="register-btn">
                        Get Started
                    </Link>
                </div>

            </div>
        </header>
    );
}

export default Navbar;