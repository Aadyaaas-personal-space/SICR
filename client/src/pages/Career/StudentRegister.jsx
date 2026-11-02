
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentAuth.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudentRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/student/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim().toLowerCase(),
                        phone: formData.phone.trim(),
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed.");
                return;
            }

            setSuccess("Your student account has been created!");

            setTimeout(() => {
                navigate("/student/login", {
                    state: {
                        registeredEmail: formData.email.trim().toLowerCase(),
                    },
                });
            }, 1000);

        } catch (err) {
            console.error("STUDENT REGISTRATION ERROR:", err);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-auth-page">

            <section className="student-auth-visual">
                <div className="student-brand">
                    <div className="student-brand-icon">S</div>
                    <span>SICR</span>
                </div>

                <div className="student-visual-content">
                    <span className="student-eyebrow">
                        YOUR FUTURE STARTS HERE
                    </span>

                    <h1>
                        Discover your potential.
                        <br />
                        <span>Build your future.</span>
                    </h1>

                    <p>
                        Your education, interests and ambitions deserve
                        a clear direction. Start your personalized
                        career journey with SICR.
                    </p>

                    <div className="student-feature-list">
                        <div>
                            <span>01</span>
                            <p>Discover your interests and strengths</p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>Explore careers that match your profile</p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>Build skills and track your progress</p>
                        </div>
                    </div>
                </div>

                <div className="student-visual-footer">
                    Student Career Intelligence Platform
                </div>
            </section>

            <section className="student-auth-form-section">
                <div className="student-auth-form-container">

                    <div className="student-mobile-brand">
                        <div className="student-brand-icon">S</div>
                        <span>SICR</span>
                    </div>

                    <div className="student-auth-heading">
                        <span className="student-heading-label">
                            STUDENT ACCOUNT
                        </span>

                        <h2>Create your account</h2>

                        <p>
                            Start your personalized career discovery journey.
                        </p>
                    </div>

                    {error && (
                        <div className="student-alert student-alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="student-alert student-alert-success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>

                        <div className="student-input-group">
                            <label htmlFor="student-name">Full Name</label>
                            <input
                                id="student-name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={100}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="student-input-group">
                            <label htmlFor="student-email">Email Address</label>
                            <input
                                id="student-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="student-input-group">
                            <label htmlFor="student-phone">Phone Number</label>
                            <input
                                id="student-phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={15}
                                autoComplete="tel"
                                required
                            />
                        </div>

                        <div className="student-input-row">
                            <div className="student-input-group">
                                <label htmlFor="student-password">Password</label>
                                <input
                                    id="student-password"
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <div className="student-input-group">
                                <label htmlFor="student-confirm-password">
                                    Confirm Password
                                </label>
                                <input
                                    id="student-confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="student-primary-button"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Student Account"}
                            {!loading && <span>→</span>}
                        </button>

                    </form>

                    <div className="student-auth-switch">
                        Already have an account?
                        <Link to="/student/login">Sign in</Link>
                    </div>

                    <Link to="/career" className="student-back-link">
                        ← Back to Career Explorer
                    </Link>

                    <p className="student-auth-note">
                        By creating an account, you agree to use SICR
                        responsibly and provide accurate information.
                    </p>

                </div>
            </section>

        </div>
    );
}

export default StudentRegister;
