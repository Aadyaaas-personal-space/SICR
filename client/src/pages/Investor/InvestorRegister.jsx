import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Investor/InvestorAuth.css";

const API_URL = "http://localhost:5000/api/investor-funder";

const InvestorRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.phone ||
            !formData.password
        ) {
            setError("Please fill all required fields.");
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        firstName:
                            formData.firstName,
                        lastName:
                            formData.lastName,
                        phone:
                            formData.phone,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to send OTP"
                );
            }

            localStorage.setItem(
                "investorRegisterData",
                JSON.stringify(formData)
            );

            setMessage(
                "OTP sent successfully. Check your email."
            );

            setTimeout(() => {
                navigate("/investor/verify-otp");
            }, 800);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="investor-auth-page">

            <div className="investor-auth-card">

                <div className="investor-brand">
                    <h1>SICR</h1>
                    <p>
                        Investor & Funder Ecosystem
                    </p>
                </div>

                <div className="investor-auth-heading">
                    <h2>Create your account</h2>

                    <p>
                        Join SICR as an Investor or
                        Funder and connect with
                        promising startups.
                    </p>
                </div>

                {error && (
                    <div className="investor-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="investor-success">
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="investor-form"
                >

                    <div className="investor-form-row">

                        <div className="investor-field">
                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                        <div className="investor-field">
                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                    </div>

                    <div className="investor-field">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </div>

                    <div className="investor-field">
                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </div>

                    <div className="investor-field">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="investor-field">
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="investor-primary-btn"
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="investor-login-link">

                    Already registered?

                    {" "}

                    <Link to="/investor/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default InvestorRegister;