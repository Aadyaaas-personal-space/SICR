import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartupLogin.css";

function StartupLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/startup/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Login failed."
                );
                return;
            }

            console.log(
                "STARTUP LOGIN SUCCESS:",
                data
            );

            // Save JWT
            localStorage.setItem(
                "startupToken",
                data.token
            );
            
            localStorage.setItem("activeEcosystem", "STARTUP");

            localStorage.setItem(
                "startupUser",
                JSON.stringify(data.user)
            );

            // Go to dashboard
            navigate("/startup/dashboard");

        } catch (error) {
            console.error(
                "STARTUP LOGIN ERROR:",
                error
            );

            setError(
                "Unable to connect to server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="startup-login-page">

            <div className="startup-login-card">

                {/* Header */}

                <div className="startup-login-header">

                    <div className="startup-login-logo">
                        SICR
                    </div>

                    <span>
                        Startup Ecosystem
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to continue to your startup
                        ecosystem.
                    </p>

                </div>

                {/* Error */}

                {error && (
                    <div className="startup-login-error">
                        {error}
                    </div>
                )}

                {/* Form */}

                <form onSubmit={handleLogin}>

                    <div className="startup-form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                    </div>

                    <div className="startup-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    <div className="startup-login-options">

                        <button
                            type="button"
                            onClick={() => {
                                alert(
                                    "Forgot password feature will be added next."
                                );
                            }}
                        >
                            Forgot Password?
                        </button>

                    </div>

                    <button
                        type="submit"
                        className="startup-login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>

                </form>

                {/* Register */}

                <div className="startup-register-link">

                    <span>
                        Don't have a Startup account?
                    </span>

                    <button
                        onClick={() =>
                            navigate("/startup/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

                {/* Back */}

                <button
                    className="startup-back-button"
                    onClick={() =>
                        navigate("/startup")
                    }
                >
                    ← Back to Startup
                </button>

            </div>

        </div>
    );
}

export default StartupLogin;