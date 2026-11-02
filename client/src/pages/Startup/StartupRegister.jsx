import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

import "./StartupRegister.css";

const roleNames = {
    founder: "Founder",
    cofounder: "Co-Founder",
    entrepreneur: "Entrepreneur",
    "startup-team": "Startup Team",
    "startup-employee": "Startup Professional",
    "aspiring-founder": "Aspiring Founder",
    "student-founder": "Student Entrepreneur",
    other: "Other",
};

function StartupRegister() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const role = searchParams.get("role") || "founder";

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [captchaChecked, setCaptchaChecked] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] =
        useState(false);

    const updateField = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.firstName.trim()) {
            newErrors.firstName =
                "First name is required.";
        }

        if (!form.lastName.trim()) {
            newErrors.lastName =
                "Last name is required.";
        }

        if (!form.email.trim()) {
            newErrors.email =
                "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email
            )
        ) {
            newErrors.email =
                "Enter a valid email address.";
        }

        if (!form.phone.trim()) {
            newErrors.phone =
                "Phone number is required.";
        } else if (
            !/^[0-9]{10}$/.test(form.phone)
        ) {
            newErrors.phone =
                "Enter a valid 10 digit phone number.";
        }

        if (!form.password) {
            newErrors.password =
                "Password is required.";
        } else if (form.password.length < 8) {
            newErrors.password =
                "Password must contain at least 8 characters.";
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        if (!captchaChecked) {
            newErrors.captcha =
                "Please complete the CAPTCHA.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/startup/send-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        phone: form.phone,
                        password: form.password,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setErrors({
                    email:
                        data.message ||
                        "Failed to send OTP",
                });

                return;
            }

            navigate(
                `/startup/verify-otp?role=${role}&email=${encodeURIComponent(
                    form.email
                )}&firstName=${encodeURIComponent(
                    form.firstName
                )}&lastName=${encodeURIComponent(
                    form.lastName
                )}&phone=${encodeURIComponent(
                    form.phone
                )}`
            );

        } catch (error) {

            console.error(
                "OTP SEND ERROR:",
                error
            );

            setErrors({
                email:
                    "Unable to connect to the server.",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="startup-register-page">

            <header className="startup-register-header">

                <Link
                    to="/ecosystem"
                    className="startup-register-logo"
                >
                    <span>S</span>
                    SICR
                </Link>

                <div className="register-login-text">
                    Already registered?

                    <Link to="/startup/login">
                        Login
                    </Link>
                </div>

            </header>

            <main className="startup-register-main">

                <div className="startup-register-layout">

                    {/* LEFT */}

                    <section className="register-info">

                        <span className="register-eyebrow">
                            STARTUP ECOSYSTEM
                        </span>

                        <h1>
                            Start your
                            <br />
                            <span>startup journey.</span>
                        </h1>

                        <p>
                            Create your SICR account and tell us
                            about your entrepreneurial journey.
                            Your profile will be built around your
                            goals, resources, needs and opportunities.
                        </p>

                        <div className="selected-role-box">

                            <span>
                                YOUR SELECTED ROLE
                            </span>

                            <strong>
                                {roleNames[role] || "Founder"}
                            </strong>

                        </div>

                        <div className="register-benefits">

                            <div>
                                <span>01</span>
                                <p>
                                    Secure account verification
                                </p>
                            </div>

                            <div>
                                <span>02</span>
                                <p>
                                    Personalized startup profile
                                </p>
                            </div>

                            <div>
                                <span>03</span>
                                <p>
                                    Discover relevant connections
                                </p>
                            </div>

                        </div>

                    </section>

                    {/* FORM */}

                    <section className="register-form-card">

                        <div className="register-form-heading">

                            <span>
                                CREATE ACCOUNT
                            </span>

                            <h2>
                                Tell us about yourself
                            </h2>

                            <p>
                                Your email will be verified before
                                your account is created.
                            </p>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="register-name-grid">

                                <div className="register-field">

                                    <label>
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={updateField}
                                        placeholder="Enter first name"
                                        autoComplete="given-name"
                                    />

                                    {errors.firstName && (
                                        <small>
                                            {errors.firstName}
                                        </small>
                                    )}

                                </div>

                                <div className="register-field">

                                    <label>
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={updateField}
                                        placeholder="Enter last name"
                                        autoComplete="family-name"
                                    />

                                    {errors.lastName && (
                                        <small>
                                            {errors.lastName}
                                        </small>
                                    )}

                                </div>

                            </div>

                            <div className="register-field">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={updateField}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />

                                <div className="field-hint">
                                    We'll send a verification OTP
                                    to this email.
                                </div>

                                {errors.email && (
                                    <small>
                                        {errors.email}
                                    </small>
                                )}

                            </div>

                            <div className="register-field">

                                <label>
                                    Phone Number
                                </label>

                                <div className="phone-input">

                                    <span>
                                        +91
                                    </span>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={updateField}
                                        placeholder="10 digit mobile number"
                                        maxLength="10"
                                        autoComplete="tel"
                                    />

                                </div>

                                <div className="field-hint">
                                    Phone verification will be added
                                    to the verification system.
                                </div>

                                {errors.phone && (
                                    <small>
                                        {errors.phone}
                                    </small>
                                )}

                            </div>

                            <div className="register-field">

                                <label>
                                    Password
                                </label>

                                <div className="password-input">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={updateField}
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                {errors.password && (
                                    <small>
                                        {errors.password}
                                    </small>
                                )}

                            </div>

                            <div className="register-field">

                                <label>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={updateField}
                                    placeholder="Enter password again"
                                    autoComplete="new-password"
                                />

                                {errors.confirmPassword && (
                                    <small>
                                        {errors.confirmPassword}
                                    </small>
                                )}

                            </div>

                            {/* CAPTCHA PLACEHOLDER */}

                            <div className="captcha-container">

                                <button
                                    type="button"
                                    className={`captcha-box ${captchaChecked
                                        ? "verified"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setCaptchaChecked(
                                            !captchaChecked
                                        )
                                    }
                                >

                                    <span className="captcha-checkbox">
                                        {captchaChecked
                                            ? "✓"
                                            : ""}
                                    </span>

                                    <span>
                                        I'm not a robot
                                    </span>

                                    <span className="captcha-brand">
                                        CAPTCHA
                                        <small>
                                            Security check
                                        </small>
                                    </span>

                                </button>

                                {errors.captcha && (
                                    <small>
                                        {errors.captcha}
                                    </small>
                                )}

                            </div>

                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending OTP..."
                                    : "Continue to Email Verification →"}
                            </button>

                            <p className="terms-text">
                                By continuing, you agree to the SICR
                                terms and privacy policy.
                            </p>

                        </form>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default StartupRegister;