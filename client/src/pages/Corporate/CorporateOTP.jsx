import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CorporateOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const email =
        location.state?.email ||
        new URLSearchParams(location.search).get("email") ||
        "";

    const companyName =
        location.state?.companyName ||
        "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const verifyOTP = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/corporate/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        otp,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "OTP verification failed."
                );
            }

            setMessage(
                "Email verified successfully!"
            );

            setTimeout(() => {
                navigate(
                    `/corporate/profile?email=${encodeURIComponent(
                        email
                    )}`
                );
            }, 1000);

        } catch (err) {
            setError(
                err.message ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setError("");
        setMessage("");

        try {
            setResending(true);

            const response = await fetch(
                `${API_URL}/api/corporate/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        companyName,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to resend OTP."
                );
            }

            setMessage(
                "A new OTP has been sent to your email."
            );

            setOtp("");

        } catch (err) {
            setError(
                err.message ||
                "Failed to resend OTP."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f7fb",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "460px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "40px",
                    boxShadow:
                        "0 15px 45px rgba(0,0,0,0.08)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "30px",
                            color: "#111827",
                        }}
                    >
                        Verify Company Email
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "12px",
                            lineHeight: 1.6,
                        }}
                    >
                        We sent a 6-digit verification
                        code to
                    </p>

                    <strong
                        style={{
                            color: "#111827",
                            wordBreak: "break-word",
                        }}
                    >
                        {email}
                    </strong>
                </div>

                <form onSubmit={verifyOTP}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 600,
                            color: "#374151",
                        }}
                    >
                        Verification OTP
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                        placeholder="Enter 6-digit OTP"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "15px",
                            border: "1px solid #d1d5db",
                            borderRadius: "10px",
                            fontSize: "22px",
                            letterSpacing: "8px",
                            textAlign: "center",
                            outline: "none",
                        }}
                    />

                    {error && (
                        <p
                            style={{
                                color: "#dc2626",
                                fontSize: "14px",
                                marginTop: "12px",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {message && (
                        <p
                            style={{
                                color: "#16a34a",
                                fontSize: "14px",
                                marginTop: "12px",
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                        style={{
                            width: "100%",
                            marginTop: "20px",
                            padding: "14px",
                            border: "none",
                            borderRadius: "10px",
                            background: "#111827",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity:
                                loading ||
                                    otp.length !== 6
                                    ? 0.6
                                    : 1,
                        }}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify Email"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resending}
                    style={{
                        width: "100%",
                        marginTop: "14px",
                        padding: "13px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        background: "#ffffff",
                        color: "#111827",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    {resending
                        ? "Sending..."
                        : "Resend OTP"}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/corporate")
                    }
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "10px",
                        border: "none",
                        background: "transparent",
                        color: "#6b7280",
                        cursor: "pointer",
                    }}
                >
                    Back to Registration
                </button>
            </div>
        </div>
    );
}

export default CorporateOTP;