import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Corporate/CorporateRegister.css";

function CorporateRegister() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [form, setForm] = useState({
        companyName: "",
        officialEmail: "",
        phone: "",
        password: "",
        confirmPassword: "",
        website: "",
        location: "",
        companyType: "",
    });

    const [otpLoading, setOtpLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        const requiredFields = [
            {
                value: form.companyName,
                name: "Company / Organization Name",
            },
            {
                value: form.officialEmail,
                name: "Official Company Email",
            },
            {
                value: form.phone,
                name: "Official Phone Number",
            },
            {
                value: form.password,
                name: "Password",
            },
            {
                value: form.confirmPassword,
                name: "Confirm Password",
            },
        ];

        const missingField =
            requiredFields.find(
                (field) =>
                    !String(field.value || "").trim()
            );

        if (missingField) {
            setError(
                `Please enter ${missingField.name}.`
            );

            return false;
        }


        // -------------------------------------------------
        // EMAIL VALIDATION
        // -------------------------------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                form.officialEmail.trim()
            )
        ) {
            setError(
                "Please enter a valid official company email."
            );

            return false;
        }


        // -------------------------------------------------
        // PHONE VALIDATION
        // -------------------------------------------------

        const phoneDigits =
            form.phone.replace(/\D/g, "");

        if (phoneDigits.length < 10) {
            setError(
                "Please enter a valid phone number."
            );

            return false;
        }


        // -------------------------------------------------
        // PASSWORD VALIDATION
        // -------------------------------------------------

        if (form.password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );

            return false;
        }


        // -------------------------------------------------
        // PASSWORD MATCH
        // -------------------------------------------------

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );

            return false;
        }

        return true;
    };


    // =====================================================
    // SEND OTP
    // =====================================================

    const sendOTP = async () => {

        if (!validateForm()) {
            return;
        }

        try {

            setOtpLoading(true);
            setError("");
            setMessage("");


            // =================================================
            // NORMALIZE REGISTRATION DATA
            // =================================================

            const registrationData = {

                companyName:
                    form.companyName.trim(),

                officialEmail:
                    form.officialEmail
                        .trim()
                        .toLowerCase(),

                phone:
                    form.phone.trim(),

                password:
                    form.password,

                confirmPassword:
                    form.confirmPassword,

                website:
                    form.website.trim(),

                location:
                    form.location.trim(),

                companyType:
                    form.companyType,

            };


            // =================================================
            // STEP 1 — CREATE CORPORATE ACCOUNT
            // =================================================

            const registerResponse =
                await fetch(
                    `${API_URL}/api/corporate/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                companyName:
                                    registrationData.companyName,

                                officialEmail:
                                    registrationData.officialEmail,

                                phone:
                                    registrationData.phone,

                                password:
                                    registrationData.password,

                                website:
                                    registrationData.website,

                                location:
                                    registrationData.location,

                                companyType:
                                    registrationData.companyType,

                            }),
                    }
                );


            let registerData = {};

            try {

                registerData =
                    await registerResponse.json();

            } catch {

                registerData = {};

            }


            if (!registerResponse.ok) {

                throw new Error(
                    registerData.message ||
                    "Corporate registration failed."
                );

            }


            // =================================================
            // STEP 2 — SEND OTP
            // =================================================

            const otpResponse =
                await fetch(
                    `${API_URL}/api/corporate/send-otp`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({

                                email:
                                    registrationData
                                        .officialEmail,

                                companyName:
                                    registrationData
                                        .companyName,

                            }),
                    }
                );


            let otpData = {};

            try {

                otpData =
                    await otpResponse.json();

            } catch {

                otpData = {};

            }


            if (!otpResponse.ok) {

                throw new Error(
                    otpData.message ||
                    "Failed to send OTP."
                );

            }


            // =================================================
            // STEP 3 — SAVE REGISTRATION DATA
            // =================================================

            localStorage.setItem(
                "corporateRegisterData",
                JSON.stringify(
                    registrationData
                )
            );


            localStorage.setItem(
                "corporateRegisterEmail",
                registrationData.officialEmail
            );


            // =================================================
            // SUCCESS
            // =================================================

            setMessage(
                "Registration successful. OTP sent to your official company email."
            );


            // =================================================
            // STEP 4 — GO TO OTP PAGE
            // =================================================

            navigate(
                `/corporate/otp?email=${encodeURIComponent(
                    registrationData.officialEmail
                )}`
            );


        } catch (err) {

            console.error(
                "Corporate Registration / OTP Error:",
                err
            );


            setError(
                err.message ||
                "Unable to complete registration."
            );


        } finally {

            setOtpLoading(false);

        }
    };


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        await sendOTP();

    };


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="corporate-register-page">

            <div className="corporate-register-card">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="corporate-register-header">

                    <span className="corporate-badge">
                        CORPORATE & INDUSTRY
                    </span>

                    <h1>
                        Register Your Company
                    </h1>

                    <p>
                        Represent your company in the SICR
                        Startup Ecosystem.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* COMPANY NAME */}

                    <div className="form-group">

                        <label>
                            Company / Organization Name *
                        </label>

                        <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            autoComplete="organization"
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Official Company Email *
                        </label>

                        <input
                            type="email"
                            name="officialEmail"
                            value={form.officialEmail}
                            onChange={handleChange}
                            placeholder="company@example.com"
                            autoComplete="email"
                        />

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label>
                            Official Phone Number *
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter official phone number"
                            autoComplete="tel"
                        />

                    </div>


                    {/* WEBSITE */}

                    <div className="form-group">

                        <label>
                            Company Website
                        </label>

                        <input
                            type="url"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            autoComplete="url"
                        />

                    </div>


                    {/* LOCATION */}

                    <div className="form-group">

                        <label>
                            Company Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="City, State, Country"
                            autoComplete="street-address"
                        />

                    </div>


                    {/* COMPANY TYPE */}

                    <div className="form-group">

                        <label>
                            Company Type
                        </label>

                        <select
                            name="companyType"
                            value={form.companyType}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select company type
                            </option>

                            <option value="Private Limited">
                                Private Limited
                            </option>

                            <option value="Public Limited">
                                Public Limited
                            </option>

                            <option value="LLP">
                                LLP
                            </option>

                            <option value="Partnership">
                                Partnership
                            </option>

                            <option value="Government Organization">
                                Government Organization
                            </option>

                            <option value="NGO">
                                NGO
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* PASSWORD ROW */}

                    <div className="form-row">

                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                Password *
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                autoComplete="new-password"
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="form-group">

                            <label>
                                Confirm Password *
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={
                                    form.confirmPassword
                                }
                                onChange={handleChange}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                            />

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="corporate-error">

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {message && (

                        <div className="corporate-success">

                            {message}

                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={otpLoading}
                    >

                        {otpLoading
                            ? "Sending OTP..."
                            : "Continue & Verify Email"}

                    </button>

                </form>


                {/* LOGIN */}

                <div className="corporate-login-link">

                    Already registered?

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/corporate/login"
                            )
                        }
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CorporateRegister;