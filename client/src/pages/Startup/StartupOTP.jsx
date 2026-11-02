import { useEffect, useRef, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import "./StartupOTP.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function StartupOTP() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const email =
        searchParams.get("email") || "";

    const role =
        searchParams.get("role") || "founder";

    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const [seconds, setSeconds] =
        useState(60);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const inputRefs =
        useRef([]);

    useEffect(() => {
        if (seconds <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSeconds(
                (previous) => previous - 1
            );
        }, 1000);

        return () =>
            clearInterval(timer);
    }, [seconds]);

    const handleChange = (
        index,
        value
    ) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const updated = [...otp];

        updated[index] = value;

        setOtp(updated);

        setError("");

        if (
            value &&
            index < otp.length - 1
        ) {
            inputRefs.current[
                index + 1
            ]?.focus();
        }
    };

    const handleKeyDown = (
        index,
        event
    ) => {
        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[
                index - 1
            ]?.focus();
        }
    };

    const verifyOTP = async (event) => {
        event.preventDefault();

        const enteredOTP =
            otp.join("");

        if (enteredOTP.length !== 6) {
            setError(
                "Please enter the complete 6 digit OTP."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/startup/verify-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        otp: enteredOTP,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Invalid OTP"
                );

                return;
            }

            // REAL OTP VERIFIED

            navigate(
                `/startup/profile?role=${role}&email=${encodeURIComponent(
                    email
                )}`
            );

        } catch (error) {

            console.error(
                "OTP VERIFICATION ERROR:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };

    const resendOTP = () => {
        if (seconds > 0) {
            return;
        }

        setSeconds(60);

        setOtp([
            "",
            "",
            "",
            "",
            "",
        ]);

        setError("");

        /*
          Later:
    
          POST /api/startup/resend-otp
        */
    };

    return (
        <div className="startup-otp-page">

            <header className="startup-otp-header">

                <Link
                    to="/startup"
                    className="startup-otp-logo"
                >
                    <span>S</span>
                    SICR
                </Link>

            </header>

            <main className="startup-otp-main">

                <div className="startup-otp-card">

                    <div className="otp-icon">
                        ✉
                    </div>

                    <span className="otp-eyebrow">
                        EMAIL VERIFICATION
                    </span>

                    <h1>
                        Check your inbox.
                    </h1>

                    <p className="otp-description">
                        We've sent a 6 digit verification
                        code to
                    </p>

                    <strong className="otp-email">
                        {email || "your email address"}
                    </strong>

                    <form onSubmit={verifyOTP}>

                        <div className="otp-inputs">

                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        inputRefs.current[
                                            index
                                        ] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={value}
                                    onChange={(event) =>
                                        handleChange(
                                            index,
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={(event) =>
                                        handleKeyDown(
                                            index,
                                            event
                                        )
                                    }
                                    autoComplete="one-time-code"
                                />
                            ))}

                        </div>

                        {error && (
                            <div className="otp-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="otp-verify-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify Email →"}
                        </button>

                    </form>

                    <div className="otp-resend">

                        {seconds > 0 ? (
                            <span>
                                Resend code in{" "}
                                <strong>
                                    {seconds}s
                                </strong>
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={resendOTP}
                            >
                                Resend verification code
                            </button>
                        )}

                    </div>

                    <Link
                        to={`/startup/register?role=${role}`}
                        className="change-email"
                    >
                        ← Change email address
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default StartupOTP;