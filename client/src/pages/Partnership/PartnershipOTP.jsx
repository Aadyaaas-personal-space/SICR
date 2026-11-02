import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/Partnership/PartnershipOTP.css";

function PartnershipOTP() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const email =
        searchParams.get("email") || "";

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [otp, setOtp] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const verifyOTP = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setMessage(
                "Enter a valid 6-digit OTP."
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/partnership/verify-otp`,
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
                    "OTP verification failed"
                );
            }

            const registerData =
                JSON.parse(
                    sessionStorage.getItem(
                        "partnershipRegisterData"
                    )
                );

            if (!registerData) {
                throw new Error(
                    "Registration data not found."
                );
            }

            const registerResponse =
                await fetch(
                    `${API_URL}/api/partnership/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name:
                                registerData.name,
                            email:
                                registerData.email,
                            phone:
                                registerData.phone,
                            password:
                                registerData.password,
                        }),
                    }
                );

            const registerResult =
                await registerResponse.json();

            if (!registerResponse.ok) {
                throw new Error(
                    registerResult.message ||
                    "Registration failed"
                );
            }

            sessionStorage.removeItem(
                "partnershipRegisterData"
            );

            navigate(
                `/partnership/profile?email=${encodeURIComponent(
                    email
                )}`
            );

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="partnership-otp-page">

            <div className="partnership-otp-card">

                <div className="otp-icon">
                    ✉
                </div>

                <h1>
                    Verify Your Email
                </h1>

                <p>
                    Enter the 6-digit OTP sent to
                </p>

                <strong>
                    {email}
                </strong>

                <form onSubmit={verifyOTP}>

                    <input
                        type="text"
                        maxLength="6"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                        placeholder="000000"
                    />

                    {message && (
                        <div className="otp-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify & Continue"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default PartnershipOTP;