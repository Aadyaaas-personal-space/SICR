import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="sicr-footer">

            <div className="footer-container">

                {/* TOP FOOTER */}
                <div className="footer-main">

                    {/* BRAND */}
                    <div className="footer-brand">

                        <div className="footer-logo">
                            <img
                                src="/logo.png"
                                alt="SICR Logo"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement.classList.add(
                                        "footer-logo-fallback"
                                    );
                                }}
                            />

                            <span>S</span>
                        </div>

                        <h2>SICR</h2>

                        <p>
                            Startup Incubator & Career Roadmap
                        </p>

                        <div className="footer-description">
                            A connected ecosystem that helps startups,
                            innovators and professionals discover
                            opportunities, build meaningful connections
                            and grow together.
                        </div>

                    </div>


                    {/* ECOSYSTEMS */}
                    <div className="footer-column">

                        <h3>All Ecosystems</h3>

                        <Link to="/startup/ecosystems">
                            Startup
                        </Link>

                        <Link to="/startup/ecosystems">
                            Investor
                        </Link>

                        <Link to="/startup/ecosystems">
                            Mentor
                        </Link>

                        <Link to="/startup/ecosystems">
                            Corporate
                        </Link>

                        <Link to="/startup/ecosystems">
                            Partnership
                        </Link>

                        <Link to="/startup/ecosystems">
                            Sponsorship
                        </Link>

                        <Link to="/startup/ecosystems">
                            T-Bridge
                        </Link>

                    </div>


                    {/* QUICK LINKS */}
                    <div className="footer-column">

                        <h3>Explore</h3>

                        <Link to="/startup/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/search">
                            Discover
                        </Link>

                        <Link to="/connections">
                            Connections
                        </Link>

                        <Link to="/startup/messenger">
                            Messenger
                        </Link>

                        <Link to="/startup/profile">
                            Profile
                        </Link>

                    </div>


                    {/* CONTACT */}
                    <div className="footer-column footer-contact">

                        <h3>Contact Us</h3>

                        <p>
                            Have questions or want to connect
                            with the SICR team?
                        </p>

                        <a href="mailto:contact@sicr.in">
                            contact@sicr.in
                        </a>

                        <span>
                            India
                        </span>

                    </div>

                </div>


                {/* DIVIDER */}
                <div className="footer-divider"></div>


                {/* BOTTOM */}
                <div className="footer-bottom">

                    <div className="footer-copyright">
                        © 2026 SICR. All Rights Reserved.
                    </div>

                    <div className="footer-legal">

                        <Link to="/privacy">
                            Privacy Policy
                        </Link>

                        <span>•</span>

                        <Link to="/terms">
                            Terms & Conditions
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;