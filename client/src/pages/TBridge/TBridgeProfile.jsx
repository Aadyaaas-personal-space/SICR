import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeProfile.css";

const TBridgeProfile = () => {
    const navigate = useNavigate();

    const token =
        localStorage.getItem(
            "tBridgeToken"
        );

    const [form, setForm] =
        useState({
            location: "",
            professionalType: "",
            bio: "",
            interests: "",
            profilePhoto: ""
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!token) {
            navigate("/tbridge/login");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response =
                await fetch(
                    "http://localhost:5000/api/tbridge/profile",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            ...form,
                            interests:
                                form.interests
                                    .split(",")
                                    .map(
                                        (item) =>
                                            item.trim()
                                    )
                                    .filter(
                                        Boolean
                                    )
                        })
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
                "/tbridge/ecosystems"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tb-profile-page">
            <div className="tb-profile-card">

                <h1>
                    Complete Your T-Bridge
                    Profile
                </h1>

                <p>
                    This profile is shared
                    across your SICR
                    ecosystems.
                </p>

                {error && (
                    <div className="tb-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                >
                    <label>
                        Location
                    </label>

                    <input
                        name="location"
                        value={
                            form.location
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="e.g. Mumbai, Maharashtra"
                        required
                    />

                    <label>
                        Professional Type
                    </label>

                    <select
                        name="professionalType"
                        value={
                            form.professionalType
                        }
                        onChange={
                            handleChange
                        }
                        required
                    >
                        <option value="">
                            Select
                        </option>

                        <option value="student">
                            Student
                        </option>

                        <option value="founder">
                            Founder
                        </option>

                        <option value="professional">
                            Professional
                        </option>

                        <option value="investor">
                            Investor
                        </option>

                        <option value="mentor">
                            Mentor
                        </option>

                        <option value="organization">
                            Organization
                        </option>

                        <option value="other">
                            Other
                        </option>
                    </select>

                    <label>
                        Short Bio
                    </label>

                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={
                            handleChange
                        }
                        rows="5"
                        placeholder="Tell us about yourself..."
                        required
                    />

                    <label>
                        Interests
                    </label>

                    <input
                        name="interests"
                        value={
                            form.interests
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Technology, AI, Business..."
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Continue"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default TBridgeProfile;