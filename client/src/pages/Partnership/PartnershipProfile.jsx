import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Partnership/PartnershipProfile.css";

function PartnershipProfile() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [form, setForm] = useState({
        collaborationRole: "",
        offerings: [],
        collaborationNeeds: [],
        sectors: [],
        collaborationScale: "",
    });

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const roles = [
        "Strategic Partner",
        "Technology Partner",
        "Implementation Partner",
        "Service Partner",
        "Channel / Distribution Partner",
        "Research & Innovation Partner",
        "Community / Network Partner",
        "NGO / Social Impact Partner",
    ];

    const offerings = [
        "Technology",
        "Expertise",
        "Infrastructure",
        "Distribution",
        "Market Access",
        "Workforce",
        "Research",
        "Business Services",
        "Network / Community",
        "Social Impact Support",
    ];

    const needs = [
        "Technology",
        "Expertise",
        "Infrastructure",
        "Distribution",
        "Market Access",
        "Workforce",
        "Research",
        "Business Services",
        "Network / Community",
        "Strategic Alliance",
    ];

    const sectors = [
        "IT & Software",
        "AI & Data",
        "Cybersecurity",
        "Cloud Computing",
        "FinTech",
        "EdTech",
        "HealthTech",
        "Manufacturing",
        "Agriculture",
        "Sustainability",
        "E-Commerce",
        "Media & Entertainment",
    ];

    const toggleArrayValue = (
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(
                    (item) => item !== value
                )
                : [
                    ...prev[field],
                    value,
                ],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.collaborationRole ||
            !form.collaborationScale
        ) {
            setMessage(
                "Please complete all required selections."
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const token =
                localStorage.getItem(
                    "partnershipToken"
                );

            if (!token) {
                navigate(
                    "/partnership/login"
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/api/partnership/profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save profile"
                );
            }

            navigate(
                "/partnership/dashboard"
            );

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="partnership-profile-page">

            <div className="partnership-profile-card">

                <div className="profile-heading">
                    <span>
                        PARTNERSHIP PROFILE
                    </span>

                    <h1>
                        Tell us how you
                        collaborate.
                    </h1>

                    <p>
                        This information helps the
                        ecosystem understand your
                        collaboration capabilities.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <section>
                        <h2>
                            01. Your Collaboration Role
                        </h2>

                        <div className="option-grid">
                            {roles.map(
                                (role) => (
                                    <button
                                        type="button"
                                        key={role}
                                        className={
                                            form.collaborationRole ===
                                                role
                                                ? "option active"
                                                : "option"
                                        }
                                        onClick={() =>
                                            setForm(
                                                {
                                                    ...form,
                                                    collaborationRole:
                                                        role,
                                                }
                                            )
                                        }
                                    >
                                        {role}
                                    </button>
                                )
                            )}
                        </div>
                    </section>

                    <section>
                        <h2>
                            02. What Can You Offer?
                        </h2>

                        <div className="option-grid">
                            {offerings.map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.offerings.includes(
                                                item
                                            )
                                                ? "option active"
                                                : "option"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "offerings",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                        </div>
                    </section>

                    <section>
                        <h2>
                            03. What Are You Looking For?
                        </h2>

                        <div className="option-grid">
                            {needs.map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.collaborationNeeds.includes(
                                                item
                                            )
                                                ? "option active"
                                                : "option"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "collaborationNeeds",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                        </div>
                    </section>

                    <section>
                        <h2>
                            04. Domains You Work In
                        </h2>

                        <div className="option-grid">
                            {sectors.map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.sectors.includes(
                                                item
                                            )
                                                ? "option active"
                                                : "option"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "sectors",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                        </div>
                    </section>

                    <section>
                        <h2>
                            05. Collaboration Scale
                        </h2>

                        <div className="scale-options">
                            {[
                                "Local",
                                "Regional",
                                "National",
                                "International",
                            ].map(
                                (scale) => (
                                    <button
                                        type="button"
                                        key={scale}
                                        className={
                                            form.collaborationScale ===
                                                scale
                                                ? "option active"
                                                : "option"
                                        }
                                        onClick={() =>
                                            setForm(
                                                {
                                                    ...form,
                                                    collaborationScale:
                                                        scale,
                                                }
                                            )
                                        }
                                    >
                                        {scale}
                                    </button>
                                )
                            )}
                        </div>
                    </section>

                    {message && (
                        <div className="profile-message">
                            {message}
                        </div>
                    )}

                    <button
                        className="save-profile-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Complete Partnership Profile"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default PartnershipProfile;