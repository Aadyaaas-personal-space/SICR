import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipOTP.css";

function SponsorshipOTP() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const registerData =
        JSON.parse(
            localStorage.getItem(
                "sponsorshipRegisterData"
            ) || "null"
        );

    const [otp, setOtp] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    if (!registerData) {
        return (
            <div className="otp-error">
                <h2>
                    Registration information
                    not found.
                </h2>

                <button
                    onClick={() =>
                        navigate(
                            "/sponsorship/register"
                        )
                    }
                >
                    Register Again
                </button>
            </div>
        );
    }

    const verifyOTP = async () => {
        if (otp.length !== 6) {
            setMessage(
                "Enter a valid 6-digit OTP"
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await fetch(
                    `${API_URL}/api/sponsorship/verify-otp`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            email:
                                registerData.email,
                            otp,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message
                );
            }

            const registerResponse =
                await fetch(
                    `${API_URL}/api/sponsorship/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            registerData
                        ),
                    }
                );

            const registerResult =
                await registerResponse.json();

            if (
                !registerResponse.ok
            ) {
                throw new Error(
                    registerResult.message
                );
            }

            localStorage.setItem(
                "sponsorshipToken",
                registerResult.token
            );

            localStorage.setItem(
                "sponsorshipAccountType",
                registerData.accountType
            );

            localStorage.removeItem(
                "sponsorshipRegisterData"
            );

            navigate(
                "/sponsorship/profile"
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
        <div className="sponsor-otp-page">
            <div className="sponsor-otp-card">

                <div className="otp-icon">
                    ✉
                </div>

                <h1>
                    Verify your email
                </h1>

                <p>
                    We've sent a 6-digit
                    verification code to
                </p>

                <strong>
                    {registerData.email}
                </strong>

                <input
                    value={otp}
                    onChange={(e) =>
                        setOtp(
                            e.target.value
                                .replace(
                                    /\D/g,
                                    ""
                                )
                        )
                    }
                    maxLength={6}
                    placeholder="000000"
                    className="otp-input"
                />

                <button
                    onClick={verifyOTP}
                    disabled={loading}
                >
                    {loading
                        ? "Verifying..."
                        : "Verify & Create Account"}
                </button>

                {message && (
                    <div className="otp-message">
                        {message}
                    </div>
                )}

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/sponsorship/register"
                        )
                    }
                >
                    Change Email
                </button>
            </div>
        </div>
    );
}

export default SponsorshipOTP;