import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import "../../styles/Mentor/MentorLogin.css";

function MentorLogin() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [success, setSuccess] =
        useState("");

    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.email ||
            !formData.password
        ) {
            setError(
                "Please enter email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await fetch(
                    `${API_URL}/api/mentor/login`,
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

            // SAVE TOKEN
            localStorage.setItem(
                "mentorToken",
                data.token
            );

            // SAVE USER
            localStorage.setItem(
                "mentorUser",
                JSON.stringify(
                    data.mentor
                )
            );

            // SET ACTIVE SICR ECOSYSTEM
            localStorage.setItem(
                "activeEcosystem",
                "MENTOR"
            );

            setSuccess(
                "Login successful. Redirecting..."
            );

            setTimeout(() => {
                navigate(
                    "/mentor/dashboard"
                );
            }, 500);

        } catch (error) {

            console.error(
                "MENTOR LOGIN ERROR:",
                error
            );

            setError(
                error.message ||
                "Unable to login."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mentor-login-page">

            <div className="mentor-login-card">

                <div className="mentor-login-brand">
                    <div>
                        SICR
                    </div>

                    <span>
                        Mentor & Expertise
                    </span>
                </div>

                <div className="mentor-login-heading">

                    <span>
                        MENTOR PORTAL
                    </span>

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Continue helping the
                        next generation of
                        founders.
                    </p>

                </div>

                {error && (
                    <div className="mentor-login-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mentor-login-form"
                >

                    <div className="mentor-login-field">
                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your email"
                            autoComplete="username"
                        />
                    </div>

                    <div className="mentor-login-field">
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mentor-login-button"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login →"}
                    </button>

                </form>

                <div className="mentor-register-link">

                    Don't have an account?

                    <Link to="/mentor/register">
                        Register as Mentor
                    </Link>

                </div>

                <button
                    className="mentor-login-back"
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

export default MentorLogin;