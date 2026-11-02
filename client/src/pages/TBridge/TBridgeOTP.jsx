import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeAuth.css";

const TBridgeOTP = () => {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        const storedEmail =
            localStorage.getItem(
                "tBridgeRegisterEmail"
            );

        if (!storedEmail) {
            navigate("/tbridge/register");
            return;
        }

        setEmail(storedEmail);
    }, [navigate]);

    const verifyOTP = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            setLoading(true);

            const response =
                await fetch(
                    "http://localhost:5000/api/tbridge/otp/verify-otp",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            otp
                        })
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

            localStorage.removeItem(
                "tBridgeRegisterEmail"
            );

            localStorage.setItem(
                "tBridgeVerifiedEmail",
                email
            );

            navigate(
                "/tbridge/login"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            setError("");
            setMessage("");

            const response =
                await fetch(
                    "http://localhost:5000/api/tbridge/otp/send-otp",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message
                );
            }

            setMessage(
                "A new OTP has been sent."
            );
        } catch (error) {
            setError(error.message);
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
                        Verify T-Bridge
                    </h1>

                    <p>
                        Enter the OTP sent to
                        <br />
                        <strong>
                            {email}
                        </strong>
                    </p>
                </div>

                {error && (
                    <div className="tb-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="tb-success">
                        {message}
                    </div>
                )}

                <form
                    onSubmit={verifyOTP}
                >
                    <label>
                        Verification OTP
                    </label>

                    <input
                        className="tb-otp-input"
                        type="text"
                        maxLength="6"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
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
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>
                </form>

                <button
                    className="tb-secondary-btn"
                    onClick={resendOTP}
                >
                    Resend OTP
                </button>

            </div>
        </div>
    );
};

export default TBridgeOTP;