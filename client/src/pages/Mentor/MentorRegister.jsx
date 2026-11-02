import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Mentor/MentorAuth.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function MentorRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
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
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill all fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await fetch(
                    `${API_URL}/api/mentor/send-otp`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            firstName:
                                formData.firstName.trim(),

                            lastName:
                                formData.lastName.trim(),

                            email:
                                formData.email
                                    .trim()
                                    .toLowerCase(),

                            phone:
                                formData.phone.trim(),

                            password:
                                formData.password,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to send OTP."
                );
            }

            // Only keep email on client.
            // Registration details are stored securely
            // inside MentorOTP on backend.

            // SAVE EMAIL FOR OTP VERIFICATION
            localStorage.setItem(
                "mentorRegisterEmail",
                formData.email.trim().toLowerCase()
            );

            setSuccess(
                "OTP sent successfully."
            );

            setTimeout(() => {
                navigate(
                    "/mentor/verify-otp"
                );
            }, 700);

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="mentor-auth-page">

            <div className="mentor-auth-card">

                <div className="mentor-brand">
                    <div className="mentor-logo">
                        SICR
                    </div>

                    <span>
                        Mentor & Expertise
                    </span>
                </div>

                <div className="mentor-auth-heading">
                    <span>
                        MENTOR ECOSYSTEM
                    </span>

                    <h1>
                        Share your expertise
                    </h1>

                    <p>
                        Help founders and startups
                        grow through your knowledge,
                        experience and guidance.
                    </p>
                </div>

                {error && (
                    <div className="mentor-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mentor-message success">
                        {success}
                    </div>
                )}

                <form
                    className="mentor-auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="mentor-form-row">

                        <div className="mentor-field">
                            <label>
                                First Name
                            </label>

                            <input
                                name="firstName"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="First name"
                            />
                        </div>

                        <div className="mentor-field">
                            <label>
                                Last Name
                            </label>

                            <input
                                name="lastName"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Last name"
                            />
                        </div>

                    </div>

                    <div className="mentor-field">
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
                            placeholder="mentor@example.com"
                            autoComplete="username"
                        />
                    </div>

                    <div className="mentor-field">
                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                    </div>

                    <div className="mentor-field">
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
                            placeholder="Create password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="mentor-field">
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Confirm password"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mentor-primary-button"
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Continue →"}
                    </button>

                </form>

                <div className="mentor-auth-footer">
                    Already have an account?

                    <Link to="/mentor/login">
                        Login
                    </Link>
                </div>

                <button
                    className="mentor-back-button"
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

export default MentorRegister;