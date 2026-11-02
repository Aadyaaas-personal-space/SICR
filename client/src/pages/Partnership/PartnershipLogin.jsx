import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Partnership/PartnershipLogin.css";

function PartnershipLogin() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!form.email || !form.password) {
            setMessage(
                "Please enter email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/partnership/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Login failed"
                );
            }

            localStorage.setItem(
                "partnershipToken",
                data.token
            );

            navigate(
                "/partnership/dashboard"
            );

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="partnership-login-page">

            <div className="partnership-login-card">

                <div className="partnership-login-header">
                    <span>
                        PARTNERSHIP
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Continue building meaningful
                        collaborations.
                    </p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="login-form-group">
                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="login-form-group">
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <div className="register-link">
                    Don't have an account?{" "}
                    <Link to="/partnership/register">
                        Create Account
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default PartnershipLogin;