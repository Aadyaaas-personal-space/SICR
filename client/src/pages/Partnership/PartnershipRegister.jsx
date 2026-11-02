import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Partnership/PartnershipRegister.css";

function PartnershipRegister() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [captchaChecked, setCaptchaChecked] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.password ||
            !form.confirmPassword
        ) {
            setMessage(
                "Please fill all required fields."
            );
            return;
        }

        if (form.password !== form.confirmPassword) {
            setMessage(
                "Passwords do not match."
            );
            return;
        }

        if (form.password.length < 6) {
            setMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (!captchaChecked) {
            setMessage(
                "Please complete the CAPTCHA."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/partnership/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email: form.email,
                        name: form.name,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to send OTP"
                );
            }

            sessionStorage.setItem(
                "partnershipRegisterData",
                JSON.stringify(form)
            );

            navigate(
                `/partnership/otp?email=${encodeURIComponent(
                    form.email
                )}`
            );

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="partnership-register-page">
            <div className="partnership-register-card">

                <div className="partnership-header">
                    <span className="partnership-badge">
                        PARTNERSHIP
                    </span>

                    <h1>
                        Build Together.
                        <br />
                        Grow Together.
                    </h1>

                    <p>
                        Join the Partnership &
                        Collaboration ecosystem.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="partnership-register-form"
                >

                    <div className="form-group">
                        <label>
                            Name / Organization Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your name or organization"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Official Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter official email"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create password"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                form.confirmPassword
                            }
                            onChange={handleChange}
                            placeholder="Confirm password"
                        />
                    </div>

                    <label className="captcha-box">
                        <input
                            type="checkbox"
                            checked={captchaChecked}
                            onChange={(e) =>
                                setCaptchaChecked(
                                    e.target.checked
                                )
                            }
                        />

                        <span>
                            I'm not a robot
                        </span>
                    </label>

                    {message && (
                        <div className="partnership-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Continue"}
                    </button>
                </form>

                <div className="partnership-login-link">
                    Already registered?{" "}
                    <Link to="/partnership/login">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default PartnershipRegister;