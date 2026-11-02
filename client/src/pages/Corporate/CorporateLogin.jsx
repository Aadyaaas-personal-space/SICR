import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Corporate/CorporateLogin.css";


function CorporateLogin() {

    const navigate =
        useNavigate();


    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";


    const [form, setForm] =
        useState({
            officialEmail: "",
            password: "",
        });


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    // =================================================
    // CHANGE INPUT
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));


        if (error) {
            setError("");
        }
    };


    // =================================================
    // LOGIN
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !form.officialEmail.trim() ||
            !form.password
        ) {
            setError(
                "Please enter your official email and password."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${API_URL}/api/corporate/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                officialEmail:
                                    form
                                        .officialEmail
                                        .trim()
                                        .toLowerCase(),

                                password:
                                    form.password,
                            }),
                    }
                );


            let data = {};

            try {

                data =
                    await response.json();

            } catch {

                data = {};

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `Login failed (${response.status})`
                );
            }


            if (!data.token) {

                throw new Error(
                    "Login successful but authentication token was not received."
                );
            }


            // =========================================
            // SAVE TOKEN
            // =========================================

            localStorage.setItem(
                "corporateToken",
                data.token
            );


            // =========================================
            // SAVE COMPANY
            // =========================================

            if (data.corporate) {

                localStorage.setItem(
                    "corporateCompany",
                    JSON.stringify(
                        data.corporate
                    )
                );
            }


            // =========================================
            // DASHBOARD
            // =========================================

            navigate(
                "/corporate/dashboard",
                {
                    replace: true,
                }
            );

        } catch (err) {

            console.error(
                "Corporate Login Error:",
                err
            );


            setError(
                err.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // =================================================
    // UI
    // =================================================

    return (

        <div className="corporate-login-page">

            <div className="corporate-login-card">

                <div className="corporate-login-header">

                    <span>
                        CORPORATE & INDUSTRY
                    </span>

                    <h1>
                        Company Login
                    </h1>

                    <p>
                        Access your SICR company profile.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="form-group">

                        <label htmlFor="officialEmail">
                            Official Company Email
                        </label>

                        <input
                            id="officialEmail"
                            type="email"
                            name="officialEmail"
                            value={
                                form.officialEmail
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="company@example.com"
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={
                                form.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {error && (

                        <div
                            className="corporate-error"
                            role="alert"
                        >
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                <div className="corporate-register-link">

                    <span>
                        New company?
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/corporate/register"
                            )
                        }
                    >
                        Register Company
                    </button>

                </div>

            </div>

        </div>
    );
}


export default CorporateLogin;