import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Mentor/MentorAuth.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function MentorOTP() {
    const navigate = useNavigate();

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");

        const email =
            localStorage.getItem(
                "mentorRegisterEmail"
            );

        if (!email) {
            setError(
                "Registration information not found. Please register again."
            );
            return;
        }

        if (otp.length !== 6) {
            setError(
                "Enter the 6-digit OTP."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await fetch(
                    `${API_URL}/api/mentor/verify-otp`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            email,
                            otp,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "OTP verification failed."
                );
            }

            // =====================================================
            // SAVE LOGIN TOKEN
            // =====================================================

            localStorage.setItem(
                "mentorToken",
                data.token
            );

            // =====================================================
            // SAVE USER
            // =====================================================

            localStorage.setItem(
                "mentorUser",
                JSON.stringify(
                    data.mentor
                )
            );

            // =====================================================
            // REMOVE REGISTRATION EMAIL
            // =====================================================

            localStorage.removeItem(
                "mentorRegisterEmail"
            );

            // =====================================================
            // GO TO DASHBOARD
            // =====================================================

            navigate(
                "/mentor/dashboard"
            );

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
                        EMAIL VERIFICATION
                    </span>

                    <h1>
                        Verify your email
                    </h1>

                    <p>
                        Enter the 6-digit OTP
                        sent to:
                    </p>

                    {localStorage.getItem("mentorRegisterEmail") && (
                        <strong>
                            {localStorage.getItem("mentorRegisterEmail")}
                        </strong>
                    )}
                </div>

                {error && (
                    <div className="mentor-message error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleVerify}
                    className="mentor-auth-form"
                >

                    <div className="mentor-field">
                        <label>
                            Verification OTP
                        </label>

                        <input
                            className="mentor-otp-input"
                            value={otp}
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="000000"
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mentor-primary-button"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Verify & Create Account"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default MentorOTP;