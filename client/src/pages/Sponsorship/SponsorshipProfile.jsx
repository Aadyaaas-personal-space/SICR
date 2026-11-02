import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipProfile.css";

function SponsorshipProfile() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const token =
        localStorage.getItem(
            "sponsorshipToken"
        );

    const accountType =
        localStorage.getItem(
            "sponsorshipAccountType"
        ) || "seeker";

    const [form, setForm] =
        useState({
            companyOrProjectName: "",
            description: "",
            industry: "",
            sponsorshipPurpose: "",
            sponsorshipTypes: [],
            preferredIndustries: [],
            minimumBudget: "",
            maximumBudget: "",
            currency: "INR",
            targetAudience: "",
            preferredLocations: [],
            benefits: "",
            conditions: "",
            website: "",
        });

    const [completion, setCompletion] =
        useState(0);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        if (!token) {
            navigate(
                "/sponsorship/login"
            );
            return;
        }

        fetch(
            `${API_URL}/api/sponsorship/profile`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        )
            .then((response) =>
                response.json()
            )
            .then((data) => {
                if (data.profile) {
                    setForm({
                        ...form,
                        ...data.profile,
                    });

                    setCompletion(
                        data.profile
                            .profileCompletion ||
                        0
                    );
                }
            });
    }, []);

    const updateField = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const updateArray = (
        field,
        value
    ) => {
        setForm({
            ...form,
            [field]: value
                .split(",")
                .map((item) =>
                    item.trim()
                )
                .filter(Boolean),
        });
    };

    const saveProfile = async (e) => {
        e.preventDefault();

        try {
            const response =
                await fetch(
                    `${API_URL}/api/sponsorship/profile`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: JSON.stringify(
                            form
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message
                );
            }

            setCompletion(
                data.profile
                    .profileCompletion
            );

            setMessage("Profile saved successfully.");

            setTimeout(() => {
                navigate("/sponsorship/dashboard");
            }, 500);
        } catch (error) {
            setMessage(
                error.message
            );
        }
    };

    return (
        <div className="sponsor-profile-page">
            <div className="profile-container">

                <div className="profile-top">
                    <div>
                        <span>
                            SICR /
                            SPONSORSHIP
                        </span>

                        <h1>
                            {accountType ===
                                "sponsor"
                                ? "Sponsor Profile"
                                : "Sponsorship Seeker Profile"}
                        </h1>
                    </div>

                    <div className="completion-box">
                        <strong>
                            {completion}%
                        </strong>

                        <span>
                            Complete
                        </span>
                    </div>
                </div>

                <form
                    onSubmit={
                        saveProfile
                    }
                >
                    <section>
                        <h2>
                            Basic Information
                        </h2>

                        <input
                            name="companyOrProjectName"
                            placeholder="Company / Project Name"
                            value={
                                form.companyOrProjectName
                            }
                            onChange={
                                updateField
                            }
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Describe your company, project or organization"
                            value={
                                form.description
                            }
                            onChange={
                                updateField
                            }
                        />

                        <input
                            name="industry"
                            placeholder="Industry"
                            value={
                                form.industry
                            }
                            onChange={
                                updateField
                            }
                        />
                    </section>

                    <section>
                        <h2>
                            Sponsorship
                            Requirements
                        </h2>

                        <textarea
                            name="sponsorshipPurpose"
                            placeholder="Why do you need / provide sponsorship?"
                            value={
                                form.sponsorshipPurpose
                            }
                            onChange={
                                updateField
                            }
                        />

                        <input
                            placeholder="Sponsorship Types — comma separated"
                            value={
                                form.sponsorshipTypes.join(
                                    ", "
                                )
                            }
                            onChange={(e) =>
                                updateArray(
                                    "sponsorshipTypes",
                                    e.target.value
                                )
                            }
                        />

                        <input
                            placeholder="Preferred Industries — comma separated"
                            value={
                                form.preferredIndustries.join(
                                    ", "
                                )
                            }
                            onChange={(e) =>
                                updateArray(
                                    "preferredIndustries",
                                    e.target.value
                                )
                            }
                        />

                        <div className="profile-two-column">
                            <input
                                name="minimumBudget"
                                type="number"
                                placeholder="Minimum Budget"
                                value={
                                    form.minimumBudget
                                }
                                onChange={
                                    updateField
                                }
                            />

                            <input
                                name="maximumBudget"
                                type="number"
                                placeholder="Maximum Budget"
                                value={
                                    form.maximumBudget
                                }
                                onChange={
                                    updateField
                                }
                            />
                        </div>

                        <input
                            name="targetAudience"
                            placeholder="Target Audience"
                            value={
                                form.targetAudience
                            }
                            onChange={
                                updateField
                            }
                        />

                        <input
                            placeholder="Preferred Locations — comma separated"
                            value={
                                form.preferredLocations.join(
                                    ", "
                                )
                            }
                            onChange={(e) =>
                                updateArray(
                                    "preferredLocations",
                                    e.target.value
                                )
                            }
                        />
                    </section>

                    <section>
                        <h2>
                            Additional
                            Information
                        </h2>

                        <textarea
                            name="benefits"
                            placeholder="Benefits offered to sponsors"
                            value={
                                form.benefits
                            }
                            onChange={
                                updateField
                            }
                        />

                        <textarea
                            name="conditions"
                            placeholder="Sponsorship conditions"
                            value={
                                form.conditions
                            }
                            onChange={
                                updateField
                            }
                        />

                        <input
                            name="website"
                            placeholder="Website"
                            value={
                                form.website
                            }
                            onChange={
                                updateField
                            }
                        />
                    </section>

                    <button className="save-profile">
                        Save Profile
                    </button>
                </form>

                {message && (
                    <div className="profile-message">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SponsorshipProfile;