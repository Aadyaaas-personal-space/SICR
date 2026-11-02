import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Investor/InvestorAuth.css";

const API_URL =
    "http://localhost:5000/api/investor-funder";

const InvestorOTP = () => {
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const storedData =
        localStorage.getItem(
            "investorRegisterData"
        );

    const registerData =
        storedData
            ? JSON.parse(storedData)
            : null;

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");

        if (!registerData) {
            setError(
                "Registration information not found."
            );
            return;
        }

        if (otp.length !== 6) {
            setError(
                "Please enter the 6-digit OTP."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/verify-otp`,
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

                        firstName:
                            registerData.firstName,

                        lastName:
                            registerData.lastName,

                        phone:
                            registerData.phone,

                        password:
                            registerData.password,
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

            localStorage.removeItem(
                "investorRegisterData"
            );

            localStorage.setItem(
                "investorFunderToken",
                data.token
            );

            
localStorage.setItem(
    "investorFunderToken",
    data.token
);

localStorage.setItem(
    "activeEcosystem",
    "INVESTOR"
);

localStorage.setItem(
    "investorUser",
    JSON.stringify(data.investorFunder)
);


            localStorage.setItem(
                "investorUser",
                JSON.stringify(
                    data.investorFunder
                )
            );

            navigate(
                "/investor/dashboard"
            );
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

                    <h2>
                        Verify your email
                    </h2>

                    <p>
                        Enter the 6-digit OTP sent
                        to your email address.
                    </p>

                    {registerData && (
                        <strong>
                            {registerData.email}
                        </strong>
                    )}

                </div>

                {error && (
                    <div className="investor-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleVerify}
                    className="investor-form"
                >

                    <div className="investor-field">

                        <label>
                            Verification OTP
                        </label>

                        <input
                            type="text"
                            maxLength="6"
                            inputMode="numeric"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                            className="otp-input"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="investor-primary-btn"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify & Create Account"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default InvestorOTP;