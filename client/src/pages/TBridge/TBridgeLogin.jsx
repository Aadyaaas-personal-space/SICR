import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeAuth.css";

const TBridgeLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response =
                await fetch(
                    "http://localhost:5000/api/tbridge/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
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
                "tBridgeToken",
                data.token
            );

            localStorage.setItem(
                "tBridgeUser",
                JSON.stringify(
                    data.user
                )
            );

            navigate(
                "/tbridge/dashboard"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tb-auth-page">
            <div className="tb-auth-card">

                <div className="tb-auth-header">
                    <span className="tb-logo">
                        T
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to your T-Bridge
                        account
                    </p>
                </div>

                {error && (
                    <div className="tb-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                >
                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                <div className="tb-auth-footer">
                    Don't have an account?

                    <button
                        onClick={() =>
                            navigate(
                                "/tbridge/register"
                            )
                        }
                    >
                        Register
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TBridgeLogin;