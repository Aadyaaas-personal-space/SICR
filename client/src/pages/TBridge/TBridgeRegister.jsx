import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeAuth.css";

const TBridgeRegister = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/tbridge/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        firstName:
                            form.firstName,
                        lastName:
                            form.lastName,
                        email:
                            form.email,
                        phone:
                            form.phone,
                        password:
                            form.password
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Registration failed"
                );
            }

            localStorage.setItem(
                "tBridgeRegisterEmail",
                form.email
            );

            await fetch(
                "http://localhost:5000/api/tbridge/otp/send-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email: form.email
                    })
                }
            );

            navigate("/tbridge/otp");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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
                        Join T-Bridge
                    </h1>

                    <p>
                        One account. Multiple
                        ecosystems.
                    </p>
                </div>

                {error && (
                    <div className="tb-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                >
                    <div className="tb-two-column">

                        <div>
                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={
                                    form.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                        <div>
                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={
                                    form.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                    </div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Phone
                    </label>

                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

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
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create T-Bridge Account"}
                    </button>
                </form>

                <div className="tb-auth-footer">
                    Already have an account?

                    <button
                        onClick={() =>
                            navigate(
                                "/tbridge/login"
                            )
                        }
                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TBridgeRegister;