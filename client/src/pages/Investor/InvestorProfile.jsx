import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InvestorProfile.css";

function InvestorProfile() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        bio: "",
        fundingTypes: [],
        industries: [],
        minimumInvestment: "",
        maximumInvestment: "",
        preferredCurrency: "USD",
        fundingConditions: "",
    });

    const [completion, setCompletion] = useState(0);

    // =====================================================
    // FETCH PROFILE
    // =====================================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token =
                    localStorage.getItem(
                        "investorFunderToken"
                    );

                if (!token) {
                    navigate("/investor/login");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/investor-funder/profile`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem(
                        "investorFunderToken"
                    );

                    navigate("/investor/login");
                    return;
                }

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Failed to load profile."
                    );
                    return;
                }

                const investor =
                    data.investorFunder;

                setProfile(investor);

                setFormData({
                    bio: investor.bio || "",

                    fundingTypes:
                        investor.fundingTypes || [],

                    industries:
                        investor.industries || [],

                    minimumInvestment:
                        investor.minimumInvestment ??
                        "",

                    maximumInvestment:
                        investor.maximumInvestment ??
                        "",

                    preferredCurrency:
                        investor.preferredCurrency ||
                        "USD",

                    fundingConditions:
                        investor.fundingConditions ||
                        "",
                });

                calculateCompletion(investor);

            } catch (error) {
                console.error(error);

                setError(
                    "Unable to connect to the server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [API_URL, navigate]);

    // =====================================================
    // COMPLETION CALCULATOR
    // =====================================================

    const calculateCompletion = (data) => {
        let completed = 0;

        if (
            data.bio &&
            data.bio.trim()
        ) {
            completed++;
        }

        if (
            data.fundingTypes &&
            data.fundingTypes.length > 0
        ) {
            completed++;
        }

        if (
            data.industries &&
            data.industries.length > 0
        ) {
            completed++;
        }

        if (
            data.minimumInvestment !==
            undefined &&
            data.minimumInvestment !==
            null &&
            data.minimumInvestment !== "" &&
            data.maximumInvestment !==
            undefined &&
            data.maximumInvestment !==
            null &&
            data.maximumInvestment !== ""
        ) {
            completed++;
        }

        if (
            data.fundingConditions &&
            data.fundingConditions.trim()
        ) {
            completed++;
        }

        const percentage =
            Math.round(
                (completed / 5) * 100
            );

        setCompletion(percentage);
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updated = {
            ...formData,
            [name]: value,
        };

        setFormData(updated);

        calculateCompletion(updated);
    };

    // =====================================================
    // MULTI SELECT
    // =====================================================

    const toggleFundingType = (value) => {
        let updatedFundingTypes;

        if (
            formData.fundingTypes.includes(value)
        ) {
            updatedFundingTypes =
                formData.fundingTypes.filter(
                    (item) => item !== value
                );
        } else {
            updatedFundingTypes = [
                ...formData.fundingTypes,
                value,
            ];
        }

        const updated = {
            ...formData,
            fundingTypes:
                updatedFundingTypes,
        };

        setFormData(updated);

        calculateCompletion(updated);
    };

    // =====================================================
    // INDUSTRIES
    // =====================================================

    const handleIndustries = (e) => {
        const industries =
            e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

        const updated = {
            ...formData,
            industries,
        };

        setFormData(updated);

        calculateCompletion(updated);
    };

    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const token =
                localStorage.getItem(
                    "investorFunderToken"
                );

            const response = await fetch(
                `${API_URL}/api/investor-funder/profile`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        bio:
                            formData.bio,

                        fundingTypes:
                            formData.fundingTypes,

                        industries:
                            formData.industries,

                        minimumInvestment:
                            formData.minimumInvestment
                                ? Number(
                                    formData.minimumInvestment
                                )
                                : undefined,

                        maximumInvestment:
                            formData.maximumInvestment
                                ? Number(
                                    formData.maximumInvestment
                                )
                                : undefined,

                        preferredCurrency:
                            formData.preferredCurrency,

                        fundingConditions:
                            formData.fundingConditions,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to update profile."
                );
                return;
            }

            setProfile(
                data.investorFunder
            );

            setCompletion(
                data.profileCompletionPercentage
            );

            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {
            console.error(error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="investor-profile-page">
                <div className="profile-loading">
                    Loading your profile...
                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="investor-profile-page">

            {/* NAVBAR */}

            <nav className="investor-navbar">

                <div
                    className="navbar-logo"
                    onClick={() =>
                        navigate(
                            "/investor/dashboard"
                        )
                    }
                >
                    <span className="logo-main">
                        SICR
                    </span>

                    <span className="logo-sub">
                        Investor & Funder Ecosystem
                    </span>
                </div>

                <div className="navbar-links">

                    <button
                        onClick={() =>
                            navigate(
                                "/investor/dashboard"
                            )
                        }
                        className="nav-link"
                    >
                        Dashboard
                    </button>

                    <button
                        className="nav-link active"
                    >
                        My Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/ecosystem")
                        }
                        className="nav-link"
                    >
                        Ecosystem
                    </button>

                    <button
                        onClick={() =>
                            navigate("/career")
                        }
                        className="nav-link"
                    >
                        Career Roadmap
                    </button>

                </div>

            </nav>

            {/* MAIN */}

            <main className="investor-profile-container">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/investor/dashboard"
                        )
                    }
                >
                    ← Back to Dashboard
                </button>

                {/* HEADER */}

                <section className="profile-header">

                    <div>

                        <span className="profile-label">
                            INVESTOR PROFILE
                        </span>

                        <h1>
                            Complete your profile
                        </h1>

                        <p>
                            Help SICR understand your
                            investment interests and
                            connect you with suitable
                            startups.
                        </p>

                    </div>

                    <div className="completion-card">

                        <span>
                            Profile Completion
                        </span>

                        <strong>
                            {completion}%
                        </strong>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width:
                                        `${completion}%`,
                                }}
                            />
                        </div>

                        <small>
                            {completion === 100
                                ? "Profile completed"
                                : "Complete all questions"}
                        </small>

                    </div>

                </section>

                {/* MESSAGES */}

                {error && (
                    <div className="message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="message success">
                        {success}
                    </div>
                )}

                {/* FORM */}

                <form
                    className="investor-profile-form"
                    onSubmit={handleSubmit}
                >

                    {/* QUESTION 1 */}

                    <section className="question-card">

                        <div className="question-number">
                            01
                        </div>

                        <div className="question-content">

                            <h2>
                                Describe your role in
                                funding or investing
                            </h2>

                            <p>
                                Tell us about your role,
                                experience and involvement
                                in investment or funding.
                            </p>

                            <textarea
                                name="bio"
                                value={
                                    formData.bio
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: I am an angel investor with 8 years of experience investing in early-stage technology startups..."
                                rows="5"
                            />

                        </div>

                    </section>

                    {/* QUESTION 2 */}

                    <section className="question-card">

                        <div className="question-number">
                            02
                        </div>

                        <div className="question-content">

                            <h2>
                                What type of funding
                                do you provide?
                            </h2>

                            <p>
                                Select all funding
                                methods you provide.
                            </p>

                            <div className="option-grid">

                                {[
                                    "EQUITY",
                                    "DEBT",
                                    "GRANT",
                                    "CONVERTIBLE_NOTE",
                                    "SAFE",
                                    "REVENUE_BASED",
                                    "LOAN",
                                    "OTHER",
                                ].map(
                                    (type) => (
                                        <label
                                            key={type}
                                            className={
                                                formData
                                                    .fundingTypes
                                                    .includes(
                                                        type
                                                    )
                                                    ? "option selected"
                                                    : "option"
                                            }
                                        >

                                            <input
                                                type="checkbox"
                                                checked={formData.fundingTypes.includes(
                                                    type
                                                )}
                                                onChange={() =>
                                                    toggleFundingType(
                                                        type
                                                    )
                                                }
                                            />

                                            {type.replace(
                                                /_/g,
                                                " "
                                            )}

                                        </label>
                                    )
                                )}

                            </div>

                        </div>

                    </section>

                    {/* QUESTION 3 */}

                    <section className="question-card">

                        <div className="question-number">
                            03
                        </div>

                        <div className="question-content">

                            <h2>
                                What industries or
                                business areas interest you?
                            </h2>

                            <p>
                                Enter the industries or
                                sectors you prefer.
                            </p>

                            <input
                                type="text"
                                placeholder="Example: AI, FinTech, Healthcare, EdTech"
                                defaultValue={
                                    formData.industries.join(
                                        ", "
                                    )
                                }
                                onChange={
                                    handleIndustries
                                }
                            />

                            <small>
                                Separate multiple
                                industries using commas.
                            </small>

                        </div>

                    </section>

                    {/* QUESTION 4 */}

                    <section className="question-card">

                        <div className="question-number">
                            04
                        </div>

                        <div className="question-content">

                            <h2>
                                What is your typical
                                funding range?
                            </h2>

                            <p>
                                Your investment amount can
                                be provided in different
                                currencies.
                            </p>

                            <div className="range-grid">

                                <div>

                                    <label>
                                        Minimum
                                    </label>

                                    <input
                                        type="number"
                                        name="minimumInvestment"
                                        value={
                                            formData.minimumInvestment
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        placeholder="10000"
                                    />

                                </div>

                                <div>

                                    <label>
                                        Maximum
                                    </label>

                                    <input
                                        type="number"
                                        name="maximumInvestment"
                                        value={
                                            formData.maximumInvestment
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        placeholder="500000"
                                    />

                                </div>

                                <div>

                                    <label>
                                        Currency
                                    </label>

                                    <select
                                        name="preferredCurrency"
                                        value={
                                            formData.preferredCurrency
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="USD">
                                            USD - US Dollar
                                        </option>

                                        <option value="INR">
                                            INR - Indian Rupee
                                        </option>

                                        <option value="EUR">
                                            EUR - Euro
                                        </option>

                                        <option value="GBP">
                                            GBP - British Pound
                                        </option>

                                        <option value="AED">
                                            AED - UAE Dirham
                                        </option>

                                        <option value="SGD">
                                            SGD - Singapore Dollar
                                        </option>

                                        <option value="CAD">
                                            CAD - Canadian Dollar
                                        </option>

                                        <option value="AUD">
                                            AUD - Australian Dollar
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* QUESTION 5 */}

                    <section className="question-card">

                        <div className="question-number">
                            05
                        </div>

                        <div className="question-content">

                            <h2>
                                What conditions do you
                                consider for your funding
                                decision?
                            </h2>

                            <p>
                                Describe the factors you
                                consider before investing
                                or providing funding.
                            </p>

                            <textarea
                                name="fundingConditions"
                                value={
                                    formData.fundingConditions
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: Market potential, founder experience, revenue, scalability, business model, equity percentage..."
                                rows="5"
                            />

                        </div>

                    </section>

                    {/* SAVE */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(
                                    "/investor/dashboard"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Profile →"}
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default InvestorProfile;