
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentOnboarding.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EDUCATION_LEVELS = ["Class 10", "Class 12", "Diploma", "UG", "PG"];

const SUBJECT_OPTIONS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "Information Technology", "English", "Economics", "Commerce",
    "Accountancy", "Business Studies", "History", "Geography",
    "Psychology", "Statistics", "Other"
];

const INTEREST_OPTIONS = [
    "Technology", "Science", "Business", "Design", "Arts",
    "Education", "Healthcare", "Finance", "Engineering",
    "Research", "Sports", "Entrepreneurship", "Social Work",
    "Environment", "Writing"
];

const HOBBY_OPTIONS = [
    "Reading", "Coding", "Gaming", "Drawing", "Music",
    "Photography", "Writing", "Sports", "Travelling",
    "Cooking", "Dancing", "Public Speaking", "DIY Projects"
];

const STRENGTH_OPTIONS = [
    "Problem Solving", "Communication", "Creativity",
    "Leadership", "Teamwork", "Logical Thinking",
    "Time Management", "Analytical Thinking",
    "Adaptability", "Critical Thinking"
];

const CAREER_OPTIONS = [
    "Software Developer", "Data Scientist", "AI Engineer",
    "Cybersecurity Analyst", "Doctor", "Engineer",
    "Teacher", "Designer", "Business Manager",
    "Entrepreneur", "Accountant", "Researcher",
    "Digital Marketer", "Government Services"
];

const EMPTY_FORM = {
    education: {
        level: "",
        currentClass: "",
        stream: "",
        institution: "",
    },
    subjects: [],
    interests: [],
    hobbies: [],
    strengths: [],
    careerPreferences: [],
    careerGoalStatus: "UNDECIDED",
};

function MultiSelectSection({ title, description, options, values, onChange }) {
    const [customValue, setCustomValue] = useState("");

    const toggleValue = (value) => {
        onChange(
            values.includes(value)
                ? values.filter((item) => item !== value)
                : [...values, value]
        );
    };

    const addCustomValue = () => {
        const value = customValue.trim();

        if (value && !values.some(
            (item) => item.toLowerCase() === value.toLowerCase()
        )) {
            onChange([...values, value]);
        }

        setCustomValue("");
    };

    return (
        <section className="onboarding-section">
            <div className="onboarding-section-heading">
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
                <span className="onboarding-count">{values.length} selected</span>
            </div>

            <div className="onboarding-chips">
                {options.map((option) => (
                    <button
                        type="button"
                        key={option}
                        className={`onboarding-chip ${
                            values.includes(option) ? "selected" : ""
                        }`}
                        onClick={() => toggleValue(option)}
                    >
                        {values.includes(option) ? "✓ " : "+ "}
                        {option}
                    </button>
                ))}
            </div>

            <div className="onboarding-custom-input">
                <input
                    type="text"
                    value={customValue}
                    placeholder={`Add another ${title.toLowerCase()}...`}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomValue();
                        }
                    }}
                />
                <button type="button" onClick={addCustomValue}>
                    Add
                </button>
            </div>

            {values.length > 0 && (
                <div className="onboarding-selected-list">
                    {values.map((value) => (
                        <span key={value}>
                            {value}
                            <button
                                type="button"
                                aria-label={`Remove ${value}`}
                                onClick={() => toggleValue(value)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function StudentOnboarding() {
    const navigate = useNavigate();
    const token = localStorage.getItem("studentToken");
    const studentUser = JSON.parse(
        localStorage.getItem("studentUser") || "{}"
    );

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loadedProfile, setLoadedProfile] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/student/login", { replace: true });
            return;
        }

        const loadProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/api/student/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("studentToken");
                    localStorage.removeItem("studentUser");
                    navigate("/student/login", { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Could not load your profile.");
                }

                const profile = data.profile || data;

                if (profile && profile.education) {
                    setForm({
                        ...EMPTY_FORM,
                        ...profile,
                        education: {
                            ...EMPTY_FORM.education,
                            ...(profile.education || {}),
                        },
                        subjects: profile.subjects || [],
                        interests: profile.interests || [],
                        hobbies: profile.hobbies || [],
                        strengths: profile.strengths || [],
                        careerPreferences: profile.careerPreferences || [],
                    });
                    setLoadedProfile(true);
                }
            } catch (err) {
                setError(err.message || "Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [token, navigate]);

    const updateEducation = (field, value) => {
        setForm((previous) => ({
            ...previous,
            education: {
                ...previous.education,
                [field]: value,
            },
        }));
    };

    const updateArray = (field, values) => {
        setForm((previous) => ({
            ...previous,
            [field]: values,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!form.education.level) {
            setError("Please select your current education level.");
            return;
        }

        if (!form.education.currentClass.trim()) {
            setError("Please enter your current class or degree.");
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(`${API_URL}/api/student/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("studentToken");
                localStorage.removeItem("studentUser");
                navigate("/student/login", { replace: true });
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Could not save your profile.");
            }

            navigate("/student/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "Unable to save your profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="onboarding-loading">
                <div className="onboarding-spinner"></div>
                <p>Preparing your student profile...</p>
            </div>
        );
    }

    return (
        <main className="student-onboarding-page">
            <header className="onboarding-topbar">
                <button
                    type="button"
                    className="onboarding-brand"
                    onClick={() => navigate("/career")}
                >
                    <span>S</span>
                    SICR <small>CAREER</small>
                </button>

                <div className="onboarding-account">
                    <div className="onboarding-avatar">
                        {(studentUser.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <span>{studentUser.name || "Student"}</span>
                </div>
            </header>

            <div className="onboarding-main">
                <div className="onboarding-progress">
                    <div>
                        <span>PROFILE SETUP</span>
                        <strong>Step 1 of 1</strong>
                    </div>
                    <div className="onboarding-progress-track">
                        <span></span>
                    </div>
                </div>

                <div className="onboarding-intro">
                    <span className="onboarding-kicker">LET'S GET TO KNOW YOU</span>
                    <h1>Build your student profile.</h1>
                    <p>
                        Tell us about your education, interests and strengths.
                        This information will help SICR understand your goals
                        and guide your career exploration.
                    </p>
                </div>

                {error && (
                    <div className="onboarding-alert error">{error}</div>
                )}

                {message && (
                    <div className="onboarding-alert success">{message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <section className="onboarding-section">
                        <div className="onboarding-section-heading">
                            <div>
                                <h3>01. Education details</h3>
                                <p>Where are you currently in your education?</p>
                            </div>
                        </div>

                        <div className="onboarding-form-grid">
                            <div className="onboarding-field">
                                <label>Education level *</label>
                                <select
                                    value={form.education.level}
                                    onChange={(e) =>
                                        updateEducation("level", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select education level</option>
                                    {EDUCATION_LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="onboarding-field">
                                <label>Current class / degree *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Class 12, B.E. IT, M.Sc."
                                    value={form.education.currentClass}
                                    onChange={(e) =>
                                        updateEducation("currentClass", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="onboarding-field">
                                <label>Stream / specialization</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Science, Commerce, Computer Engineering"
                                    value={form.education.stream}
                                    onChange={(e) =>
                                        updateEducation("stream", e.target.value)
                                    }
                                />
                            </div>

                            <div className="onboarding-field">
                                <label>School / college / institution</label>
                                <input
                                    type="text"
                                    placeholder="Enter your institution name"
                                    value={form.education.institution}
                                    onChange={(e) =>
                                        updateEducation("institution", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <MultiSelectSection
                        title="02. Subjects"
                        description="Select the subjects you currently study."
                        options={SUBJECT_OPTIONS}
                        values={form.subjects}
                        onChange={(values) => updateArray("subjects", values)}
                    />

                    <MultiSelectSection
                        title="03. Interests"
                        description="Choose topics or fields that genuinely interest you."
                        options={INTEREST_OPTIONS}
                        values={form.interests}
                        onChange={(values) => updateArray("interests", values)}
                    />

                    <MultiSelectSection
                        title="04. Hobbies"
                        description="What do you enjoy doing in your free time?"
                        options={HOBBY_OPTIONS}
                        values={form.hobbies}
                        onChange={(values) => updateArray("hobbies", values)}
                    />

                    <MultiSelectSection
                        title="05. Strengths"
                        description="Select skills or qualities you think you are good at."
                        options={STRENGTH_OPTIONS}
                        values={form.strengths}
                        onChange={(values) => updateArray("strengths", values)}
                    />

                    <section className="onboarding-section">
                        <div className="onboarding-section-heading">
                            <div>
                                <h3>06. Career preferences</h3>
                                <p>
                                    Select careers you are interested in, or tell us
                                    if you are still exploring.
                                </p>
                            </div>
                        </div>

                        <div className="onboarding-goal-options">
                            {[
                                ["UNDECIDED", "I'm not sure yet"],
                                ["EXPLORING", "I'm exploring options"],
                                ["DECIDED", "I have a career goal"],
                            ].map(([value, label]) => (
                                <button
                                    type="button"
                                    key={value}
                                    className={
                                        form.careerGoalStatus === value
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setForm((previous) => ({
                                            ...previous,
                                            careerGoalStatus: value,
                                        }))
                                    }
                                >
                                    {form.careerGoalStatus === value ? "✓ " : ""}
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="onboarding-chips onboarding-career-chips">
                            {CAREER_OPTIONS.map((career) => (
                                <button
                                    type="button"
                                    key={career}
                                    className={`onboarding-chip ${
                                        form.careerPreferences.includes(career)
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        const selected = form.careerPreferences;
                                        updateArray(
                                            "careerPreferences",
                                            selected.includes(career)
                                                ? selected.filter((item) => item !== career)
                                                : [...selected, career]
                                        );
                                    }}
                                >
                                    {form.careerPreferences.includes(career)
                                        ? "✓ "
                                        : "+ "}
                                    {career}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="onboarding-submit-area">
                        <div>
                            <strong>Your profile, your journey.</strong>
                            <p>
                                You can update these details later as your interests
                                and goals change.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="onboarding-submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving profile..."
                                : loadedProfile
                                    ? "Update profile →"
                                    : "Save and continue →"}
                        </button>
                    </div>
                </form>
            </div>

            <footer className="onboarding-footer">
                © {new Date().getFullYear()} SICR · Student Career Intelligence
            </footer>
        </main>
    );
}
