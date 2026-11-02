import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipLogin.css";

function SponsorshipLogin() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [form, setForm] =
        useState({
            email: "",
            password: "",
        });

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const updateField = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const login = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response =
                await fetch(
                    `${API_URL}/api/sponsorship/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            form
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message
                );
            }

            localStorage.setItem(
                "sponsorshipToken",
                data.token
            );

            localStorage.setItem(
                "sponsorshipAccountType",
                data.account.accountType
            );

            navigate(
                "/sponsorship/dashboard"
            );
        } catch (error) {
            setMessage(
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sponsor-login-page">
            <div className="sponsor-login-card">

                <span className="ecosystem-label">
                    SICR ECOSYSTEM
                </span>

                <h1>
                    Sponsorship Login
                </h1>

                <p>
                    Manage your sponsorship
                    opportunities.
                </p>

                <form onSubmit={login}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={
                            form.email
                        }
                        onChange={
                            updateField
                        }
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={
                            form.password
                        }
                        onChange={
                            updateField
                        }
                        required
                    />

                    <button
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>
                </form>

                {message && (
                    <div className="login-message">
                        {message}
                    </div>
                )}

                <p
                    className="register-link"
                    onClick={() =>
                        navigate(
                            "/sponsorship/register"
                        )
                    }
                >
                    Don't have an account?
                    <strong>
                        {" "}
                        Register
                    </strong>
                </p>
            </div>
        </div>
    );
}

export default SponsorshipLogin;