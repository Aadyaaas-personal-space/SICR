import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./InvestorLogin.css";

function InvestorLogin() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/investor-funder/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email:
                            formData.email
                                .trim()
                                .toLowerCase(),

                        password:
                            formData.password,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Login failed."
                );

                return;
            }

            // =================================================
            // SAVE LOGIN DATA
            // =================================================

            localStorage.setItem(
                "investorFunderToken",
                data.token
            );

            
localStorage.setItem(
    "investorFunderToken",
    data.token
);

localStorage.setItem(
    "activeEcosystem",
    "INVESTOR"
);

localStorage.setItem(
    "investorFunderUser",
    JSON.stringify(data.investorFunder)
);


            localStorage.setItem(
                "investorFunderUser",
                JSON.stringify(
                    data.investorFunder
                )
            );

            setSuccess(
                "Login successful. Redirecting..."
            );

            // =================================================
            // DASHBOARD
            // =================================================

            setTimeout(() => {
                navigate(
                    "/investor/dashboard"
                );
            }, 500);

        } catch (error) {
            console.error(
                "INVESTOR LOGIN ERROR:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="investor-login-page">

            <div className="investor-login-card">

                {/* BRAND */}

                <div className="investor-login-brand">

                    <div className="investor-logo">
                        SICR
                    </div>

                    <span>
                        Investor & Funder Ecosystem
                    </span>

                </div>

                {/* HEADING */}

                <div className="investor-login-heading">

                    <span>
                        INVESTOR / FUNDER
                    </span>

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Login to access your
                        investment ecosystem.
                    </p>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="investor-login-error">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="investor-login-success">
                        {success}
                    </div>
                )}

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="investor-login-form"
                >

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="username"
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="investor-login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login →"}

                    </button>

                </form>

                {/* REGISTER */}

                <div className="investor-login-register">

                    <span>
                        Don't have an account?
                    </span>

                    <Link
                        to="/investor/register"
                    >
                        Register as Investor / Funder
                    </Link>

                </div>

                {/* BACK */}

                <button
                    type="button"
                    className="investor-back-button"
                    onClick={() =>
                        navigate("/ecosystem")
                    }
                >
                    ← Back to Ecosystem
                </button>

            </div>

        </div>
    );
}

export default InvestorLogin;