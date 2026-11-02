import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipRegister.css";

function SponsorshipRegister() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [accountType, setAccountType] =
        useState("seeker");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        organizationName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const updateField = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const continueRegistration = async (
        e
    ) => {
        e.preventDefault();

        if (
            form.password !==
            form.confirmPassword
        ) {
            setMessage(
                "Passwords do not match"
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response =
                await fetch(
                    `${API_URL}/api/sponsorship/send-otp`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            email:
                                form.email,
                            organizationName:
                                form.organizationName,
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

            localStorage.setItem(
                "sponsorshipRegisterData",
                JSON.stringify({
                    ...form,
                    accountType,
                })
            );

            navigate(
                "/sponsorship/otp"
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
        <div className="sponsor-register-page">
            <div className="sponsor-register-card">

                <div className="sponsor-heading">
                    <span>
                        SICR ECOSYSTEM
                    </span>

                    <h1>
                        Sponsorship
                    </h1>

                    <p>
                        Connect opportunities
                        with the right sponsors.
                    </p>
                </div>

                <div className="account-type">
                    <button
                        type="button"
                        className={
                            accountType ===
                                "seeker"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setAccountType(
                                "seeker"
                            )
                        }
                    >
                        <strong>
                            Need Sponsorship
                        </strong>

                        <small>
                            Startup, event,
                            project or organization
                        </small>
                    </button>

                    <button
                        type="button"
                        className={
                            accountType ===
                                "sponsor"
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            setAccountType(
                                "sponsor"
                            )
                        }
                    >
                        <strong>
                            Become a Sponsor
                        </strong>

                        <small>
                            Company, brand
                            or institution
                        </small>
                    </button>
                </div>

                <form
                    onSubmit={
                        continueRegistration
                    }
                >
                    <div className="two-column">
                        <input
                            name="firstName"
                            placeholder="First Name"
                            value={
                                form.firstName
                            }
                            onChange={
                                updateField
                            }
                            required
                        />

                        <input
                            name="lastName"
                            placeholder="Last Name"
                            value={
                                form.lastName
                            }
                            onChange={
                                updateField
                            }
                            required
                        />
                    </div>

                    <input
                        name="organizationName"
                        placeholder="Company / Organization / Project"
                        value={
                            form.organizationName
                        }
                        onChange={
                            updateField
                        }
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={
                            form.email
                        }
                        onChange={
                            updateField
                        }
                        required
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={
                            form.phone
                        }
                        onChange={
                            updateField
                        }
                        required
                    />

                    <div className="two-column">
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={
                                form.password
                            }
                            onChange={
                                updateField
                            }
                            required
                        />

                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={
                                form.confirmPassword
                            }
                            onChange={
                                updateField
                            }
                            required
                        />
                    </div>

                    <button
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Continue"}
                    </button>
                </form>

                {message && (
                    <div className="register-message">
                        {message}
                    </div>
                )}

                <p
                    className="login-link"
                    onClick={() =>
                        navigate(
                            "/sponsorship/login"
                        )
                    }
                >
                    Already have an account?
                    <strong>
                        {" "}
                        Login
                    </strong>
                </p>
            </div>
        </div>
    );
}

export default SponsorshipRegister;