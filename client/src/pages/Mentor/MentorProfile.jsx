import { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import "../../styles/Mentor/MentorProfile.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const expertiseOptions = [
    "Technology",
    "Software Development",
    "AI / ML",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "Business Strategy",
    "Marketing",
    "Sales",
    "Finance",
    "Product Management",
    "Leadership",
    "Operations",
    "Legal",
    "Human Resources",
    "Design",
];

const industryOptions = [
    "FinTech",
    "EdTech",
    "HealthTech",
    "AgriTech",
    "SaaS",
    "E-Commerce",
    "DeepTech",
    "Cybersecurity",
    "AI",
    "IoT",
    "GreenTech",
    "Social Impact",
];

function MentorProfile() {
    const navigate = useNavigate();
    const [searchParams] =
        useSearchParams();

    const [profile, setProfile] =
        useState({
            expertiseAreas: [],
            industries: [],
            experienceLevel: "",
            yearsOfExperience: "",
            currentPosition: "",
            organization: "",
            mentoringType: [],
            startupStages: [],
            availability: "",
            mentoringMode: [],
            geography: "",
            languages: [],
            supportAreas: [],
            linkedin: "",
            portfolio: "",
            bio: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const token =
        localStorage.getItem(
            "mentorToken"
        );

    useEffect(() => {
        if (!token) {
            navigate("/mentor/login");
            return;
        }

        const loadProfile =
            async () => {
                try {
                    const response =
                        await fetch(
                            `${API_URL}/api/mentor/profile`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    if (
                        response.status ===
                        401
                    ) {
                        localStorage.removeItem(
                            "mentorToken"
                        );

                        navigate(
                            "/mentor/login"
                        );

                        return;
                    }

                    if (
                        response.status ===
                        404
                    ) {
                        setLoading(false);
                        return;
                    }

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Unable to load profile."
                        );
                    }

                    const p =
                        data.mentorProfile;

                    setProfile({
                        expertiseAreas:
                            p.expertiseAreas ||
                            [],

                        industries:
                            p.industries ||
                            [],

                        experienceLevel:
                            p.experienceLevel ||
                            "",

                        yearsOfExperience:
                            p.yearsOfExperience ||
                            "",

                        currentPosition:
                            p.currentPosition ||
                            "",

                        organization:
                            p.organization ||
                            "",

                        mentoringType:
                            p.mentoringType ||
                            [],

                        startupStages:
                            p.startupStages ||
                            [],

                        availability:
                            p.availability ||
                            "",

                        mentoringMode:
                            p.mentoringMode ||
                            [],

                        geography:
                            p.geography ||
                            "",

                        languages:
                            p.languages ||
                            [],

                        supportAreas:
                            p.supportAreas ||
                            [],

                        linkedin:
                            p.linkedin ||
                            "",

                        portfolio:
                            p.portfolio ||
                            "",

                        bio:
                            p.bio ||
                            "",
                    });
                } catch (error) {
                    setError(
                        error.message
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadProfile();
    }, [navigate, token]);

    const toggleArrayValue = (
        field,
        value
    ) => {
        setProfile((prev) => {
            const current =
                prev[field] || [];

            return {
                ...prev,
                [field]:
                    current.includes(value)
                        ? current.filter(
                            (item) =>
                                item !==
                                value
                        )
                        : [
                            ...current,
                            value,
                        ],
            };
        });
    };

    const handleChange = (e) => {
        setProfile((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSave = async (
        e
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setSaving(true);

            const response =
                await fetch(
                    `${API_URL}/api/mentor/profile`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: JSON.stringify(
                            profile
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to save profile."
                );
            }

            setSuccess(
                "Mentor profile saved successfully."
            );

            setTimeout(() => {
                navigate(
                    "/mentor/dashboard"
                );
            }, 700);
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mentor-profile-page">
                <div className="mentor-profile-loading">
                    Loading your profile...
                </div>
            </div>
        );
    }

    return (
        <div className="mentor-profile-page">

            <header className="mentor-profile-header">

                <div
                    className="mentor-profile-logo"
                    onClick={() =>
                        navigate(
                            "/mentor/dashboard"
                        )
                    }
                >
                    SICR
                </div>

                <div>
                    <span>
                        MENTOR & EXPERTISE
                    </span>

                    <h1>
                        Build your expertise profile
                    </h1>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/mentor/dashboard"
                        )
                    }
                >
                    Dashboard
                </button>

            </header>

            <main className="mentor-profile-container">

                <div className="mentor-profile-intro">

                    <span>
                        STEP INTO THE ECOSYSTEM
                    </span>

                    <h2>
                        Tell startups what you can help them with.
                    </h2>

                    <p>
                        Your profile helps SICR
                        connect you with startups
                        looking for your expertise.
                    </p>

                </div>

                {error && (
                    <div className="mentor-profile-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mentor-profile-message success">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSave}
                >

                    <section className="mentor-profile-card">

                        <div className="mentor-section-title">
                            <span>
                                01
                            </span>

                            <div>
                                <h3>
                                    Your Expertise
                                </h3>

                                <p>
                                    Select the areas where
                                    you have strong knowledge.
                                </p>
                            </div>
                        </div>

                        <div className="mentor-chip-grid">

                            {expertiseOptions.map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            profile.expertiseAreas.includes(
                                                item
                                            )
                                                ? "mentor-chip selected"
                                                : "mentor-chip"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "expertiseAreas",
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

                    <section className="mentor-profile-card">

                        <div className="mentor-section-title">
                            <span>
                                02
                            </span>

                            <div>
                                <h3>
                                    Industry Experience
                                </h3>

                                <p>
                                    Choose industries you understand.
                                </p>
                            </div>
                        </div>

                        <div className="mentor-chip-grid">

                            {industryOptions.map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            profile.industries.includes(
                                                item
                                            )
                                                ? "mentor-chip selected"
                                                : "mentor-chip"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "industries",
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

                    <section className="mentor-profile-card">

                        <div className="mentor-section-title">
                            <span>
                                03
                            </span>

                            <div>
                                <h3>
                                    Professional Experience
                                </h3>

                                <p>
                                    Tell us about your professional background.
                                </p>
                            </div>
                        </div>

                        <div className="mentor-input-grid">

                            <div>
                                <label>
                                    Experience Level
                                </label>

                                <select
                                    name="experienceLevel"
                                    value={
                                        profile.experienceLevel
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select level
                                    </option>

                                    <option>
                                        Industry Professional
                                    </option>

                                    <option>
                                        Senior Professional
                                    </option>

                                    <option>
                                        Executive
                                    </option>

                                    <option>
                                        Founder / Entrepreneur
                                    </option>

                                    <option>
                                        Subject Matter Expert
                                    </option>

                                    <option>
                                        Consultant
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label>
                                    Years of Experience
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="yearsOfExperience"
                                    value={
                                        profile.yearsOfExperience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 10"
                                />
                            </div>

                            <div>
                                <label>
                                    Current Position
                                </label>

                                <input
                                    name="currentPosition"
                                    value={
                                        profile.currentPosition
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. CTO"
                                />
                            </div>

                            <div>
                                <label>
                                    Organization
                                </label>

                                <input
                                    name="organization"
                                    value={
                                        profile.organization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Company / Organization"
                                />
                            </div>

                        </div>

                    </section>

                    <section className="mentor-profile-card">

                        <div className="mentor-section-title">
                            <span>
                                04
                            </span>

                            <div>
                                <h3>
                                    Mentoring Preferences
                                </h3>

                                <p>
                                    Define how you want to mentor startups.
                                </p>
                            </div>
                        </div>

                        <div className="mentor-input-grid">

                            <div>
                                <label>
                                    Availability
                                </label>

                                <select
                                    name="availability"
                                    value={
                                        profile.availability
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select availability
                                    </option>

                                    <option>
                                        Few hours per month
                                    </option>

                                    <option>
                                        1-2 hours per week
                                    </option>

                                    <option>
                                        3-5 hours per week
                                    </option>

                                    <option>
                                        Flexible
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label>
                                    Geography
                                </label>

                                <input
                                    name="geography"
                                    value={
                                        profile.geography
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="India / Global"
                                />
                            </div>

                        </div>

                        <label className="mentor-big-label">
                            Mentoring Mode
                        </label>

                        <div className="mentor-chip-grid">

                            {[
                                "1:1 Mentoring",
                                "Group Sessions",
                                "Workshops",
                                "Office Hours",
                                "Advisory",
                            ].map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            profile.mentoringMode.includes(
                                                item
                                            )
                                                ? "mentor-chip selected"
                                                : "mentor-chip"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "mentoringMode",
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

                    <section className="mentor-profile-card">

                        <div className="mentor-section-title">
                            <span>
                                05
                            </span>

                            <div>
                                <h3>
                                    Startup Support
                                </h3>

                                <p>
                                    What kind of help can you provide?
                                </p>
                            </div>
                        </div>

                        <div className="mentor-chip-grid">

                            {[
                                "Business Strategy",
                                "Technology",
                                "Product",
                                "Fundraising",
                                "Marketing",
                                "Sales",
                                "Leadership",
                                "Hiring",
                                "Go-To-Market",
                                "Networking",
                            ].map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            profile.supportAreas.includes(
                                                item
                                            )
                                                ? "mentor-chip selected"
                                                : "mentor-chip"
                                        }
                                        onClick={() =>
                                            toggleArrayValue(
                                                "supportAreas",
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

                    <section className="mentor-profile-card">

                        <div className="mentor-section-title">
                            <span>
                                06
                            </span>

                            <div>
                                <h3>
                                    Professional Links
                                </h3>

                                <p>
                                    Help startups learn more about you.
                                </p>
                            </div>
                        </div>

                        <div className="mentor-input-grid">

                            <div>
                                <label>
                                    LinkedIn
                                </label>

                                <input
                                    name="linkedin"
                                    value={
                                        profile.linkedin
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="LinkedIn profile"
                                />
                            </div>

                            <div>
                                <label>
                                    Portfolio / Website
                                </label>

                                <input
                                    name="portfolio"
                                    value={
                                        profile.portfolio
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://..."
                                />
                            </div>

                        </div>

                        <div className="mentor-bio-field">

                            <label>
                                Professional Bio
                            </label>

                            <textarea
                                name="bio"
                                rows="6"
                                maxLength="1000"
                                value={
                                    profile.bio
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Tell startups about your professional journey, expertise and mentoring approach..."
                            />

                        </div>

                    </section>

                    <div className="mentor-profile-submit">

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving Profile..."
                                : "Save Mentor Profile →"}
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default MentorProfile;