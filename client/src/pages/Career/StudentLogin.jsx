
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./StudentLogin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentLogin() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.registeredEmail || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        location.state?.registeredEmail
            ? "Registration successful! Please sign in."
            : ""
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/student/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to sign in. Please try again.");
            }

            if (!data.token) {
                throw new Error("Login response did not contain an authentication token.");
            }

            // Student-only storage keys. Do not modify Startup/Investor keys.
            localStorage.setItem("studentToken", data.token);
            localStorage.setItem(
                "studentUser",
                JSON.stringify(data.student || data.user || {})
            );

            navigate("/student/onboarding", { replace: true });
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="student-login-page">
            <section className="student-login-brand">
                <Link to="/career" className="student-login-logo">
                    <span className="student-login-logo-icon">S</span>
                    SICR <span>CAREER</span>
                </Link>

                <div className="student-login-brand-content">
                    <span className="student-login-eyebrow">
                        YOUR FUTURE STARTS HERE
                    </span>

                    <h1>
                        Every student has a path.
                        <span> Let's discover yours.</span>
                    </h1>

                    <p>
                        Sign in to explore career possibilities, understand your
                        strengths and build a learning journey that matches your goals.
                    </p>

                    <div className="student-login-points">
                        <div>
                            <span>01</span>
                            <p>Discover your interests and strengths</p>
                        </div>
                        <div>
                            <span>02</span>
                            <p>Explore career paths that fit you</p>
                        </div>
                        <div>
                            <span>03</span>
                            <p>Track your learning and progress</p>
                        </div>
                    </div>
                </div>

                <div className="student-login-brand-footer">
                    <span>Student Career Intelligence</span>
                    <span>Learn · Explore · Grow</span>
                </div>
            </section>

            <section className="student-login-form-section">
                <div className="student-login-form-wrap">
                    <Link to="/career" className="student-login-back">
                        ← Back to Career Intelligence
                    </Link>

                    <div className="student-login-heading">
                        <span className="student-login-eyebrow">
                            STUDENT ACCOUNT
                        </span>
                        <h2>Welcome back</h2>
                        <p>Sign in to continue your career journey.</p>
                    </div>

                    {success && (
                        <div className="student-login-alert success">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="student-login-alert error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="student-login-field">
                            <label htmlFor="student-email">Email address</label>
                            <input
                                id="student-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="student-login-field">
                            <div className="student-login-label-row">
                                <label htmlFor="student-password">Password</label>
                            </div>

                            <div className="student-login-password-wrap">
                                <input
                                    id="student-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="student-login-show-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="student-login-submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <div className="student-login-register">
                        Don't have a student account?
                        <Link to="/student/register"> Create account</Link>
                    </div>

                    <div className="student-login-security">
                        <span>🔒</span>
                        Your student account is protected with secure authentication.
                    </div>
                </div>

                <div className="student-login-copyright">
                    © {new Date().getFullYear()} SICR · Student Career Intelligence
                </div>
            </section>
        </main>
    );
}
