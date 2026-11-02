import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipCreateRequest.css";

function SponsorshipCreateRequest() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        requiredAmount: "",
        targetAudience: "",
        eventDate: "",
        location: "",
        benefits: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("sponsorshipToken");

            if (!token) {
                navigate("/sponsorship/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/sponsorship/requests`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create sponsorship request"
                );
            }

            setMessage("Sponsorship request created successfully.");

            setTimeout(() => {
                navigate("/sponsorship/opportunities");
            }, 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sponsorship-create-page">
            <div className="sponsorship-create-card">

                <div className="create-header">
                    <span className="create-badge">
                        SPONSORSHIP
                    </span>

                    <h1>Create Sponsorship Request</h1>

                    <p>
                        Create an opportunity and connect with potential
                        sponsors for your startup, event, or initiative.
                    </p>
                </div>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Request Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Startup Demo Day Sponsorship"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Describe your sponsorship requirement..."
                            value={form.description}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Sponsorship Type</label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Type
                                </option>

                                <option value="financial">
                                    Financial
                                </option>

                                <option value="product">
                                    Product
                                </option>

                                <option value="service">
                                    Service
                                </option>

                                <option value="media">
                                    Media
                                </option>

                                <option value="technology">
                                    Technology
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Amount Required</label>

                            <input
                                type="number"
                                name="requiredAmount"
                                placeholder="50000"
                                value={form.requiredAmount}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Target Audience</label>

                        <input
                            type="text"
                            name="targetAudience"
                            placeholder="Students, founders, developers..."
                            value={form.targetAudience}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>Event / Activity Date</label>

                            <input
                                type="date"
                                name="eventDate"
                                value={form.eventDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                placeholder="Mumbai, Maharashtra"
                                value={form.location}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Sponsor Benefits</label>

                        <textarea
                            name="benefits"
                            placeholder="Brand visibility, logo placement, event promotion..."
                            value={form.benefits}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <button
                        type="submit"
                        className="create-request-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Request..."
                            : "Create Sponsorship Request"}
                    </button>

                </form>

                <button
                    className="back-btn"
                    onClick={() => navigate("/sponsorship/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>
        </div>
    );
}

export default SponsorshipCreateRequest;