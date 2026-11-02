import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../src/styles/Corporate/CorporateProfile.css";

function CorporateProfile() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [form, setForm] = useState({
        industryDomain: "",
        ecosystemRole: [],
        companyOffers: [],
        companyNeeds: [],
        collaborationInterests: [],
    });

    const [company, setCompany] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token =
                localStorage.getItem(
                    "corporateToken"
                );

            if (!token) {
                navigate("/corporate/login");
                return;
            }

            const accountResponse =
                await fetch(
                    `${API_URL}/api/corporate/me`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (accountResponse.ok) {
                const accountData =
                    await accountResponse.json();

                setCompany(
                    accountData.corporate
                );
            }

            const response =
                await fetch(
                    `${API_URL}/api/corporate/profile`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (response.ok) {
                const data =
                    await response.json();

                const profile =
                    data.profile;

                setForm({
                    industryDomain:
                        profile.industryDomain || "",

                    ecosystemRole:
                        profile.ecosystemRole || [],

                    companyOffers:
                        profile.companyOffers || [],

                    companyNeeds:
                        profile.companyNeeds || [],

                    collaborationInterests:
                        profile.collaborationInterests ||
                        [],
                });
            }

        } catch (error) {
            console.error(
                "Corporate Profile Error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleMultiSelect = (
        field,
        value
    ) => {
        setForm((previous) => {

            const current =
                previous[field];

            const updated =
                current.includes(value)
                    ? current.filter(
                        (item) =>
                            item !== value
                    )
                    : [
                        ...current,
                        value,
                    ];

            return {
                ...previous,
                [field]: updated,
            };
        });
    };

    const saveProfile = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.industryDomain) {
            setError(
                "Please select your industry/domain."
            );

            return;
        }

        if (
            form.ecosystemRole.length === 0 ||
            form.companyOffers.length === 0 ||
            form.companyNeeds.length === 0 ||
            form.collaborationInterests.length === 0
        ) {
            setError(
                "Please answer all profile questions."
            );

            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem(
                    "corporateToken"
                );

            const response =
                await fetch(
                    `${API_URL}/api/corporate/profile`,
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

            setSuccess(
                "Company profile completed successfully!"
            );

            setTimeout(() => {
                navigate(
                    "/corporate/dashboard"
                );
            }, 1000);

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="corporate-profile-loading">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="corporate-profile-page">

            <div className="corporate-profile-container">

                <div className="corporate-profile-header">

                    <span>
                        CORPORATE & INDUSTRY
                    </span>

                    <h1>
                        {company?.companyName}
                    </h1>

                    <p>
                        Help SICR understand your
                        company's role in the
                        startup ecosystem.
                    </p>

                </div>

                <form
                    className="corporate-profile-form"
                    onSubmit={saveProfile}
                >

                    {/* QUESTION 1 */}

                    <div className="profile-question">

                        <div className="question-number">
                            01
                        </div>

                        <div className="question-content">

                            <h2>
                                What is your company's
                                primary industry and
                                business domain?
                            </h2>

                            <select
                                value={
                                    form.industryDomain
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        industryDomain:
                                            e.target.value,
                                    })
                                }
                            >

                                <option value="">
                                    Select industry
                                </option>

                                <option value="Information Technology">
                                    Information Technology
                                </option>

                                <option value="Software & SaaS">
                                    Software & SaaS
                                </option>

                                <option value="FinTech">
                                    FinTech
                                </option>

                                <option value="HealthTech">
                                    HealthTech
                                </option>

                                <option value="EdTech">
                                    EdTech
                                </option>

                                <option value="Manufacturing">
                                    Manufacturing
                                </option>

                                <option value="Automotive">
                                    Automotive
                                </option>

                                <option value="Healthcare">
                                    Healthcare
                                </option>

                                <option value="Agriculture">
                                    Agriculture
                                </option>

                                <option value="Energy">
                                    Energy
                                </option>

                                <option value="Telecommunications">
                                    Telecommunications
                                </option>

                                <option value="Retail & E-commerce">
                                    Retail & E-commerce
                                </option>

                                <option value="Logistics & Supply Chain">
                                    Logistics & Supply Chain
                                </option>

                                <option value="Construction & Real Estate">
                                    Construction & Real Estate
                                </option>

                                <option value="Media & Entertainment">
                                    Media & Entertainment
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* QUESTION 2 */}

                    <div className="profile-question">

                        <div className="question-number">
                            02
                        </div>

                        <div className="question-content">

                            <h2>
                                What best describes your
                                company's primary role
                                in the startup ecosystem?
                            </h2>

                            <div className="option-grid">

                                {[
                                    "Enterprise / Corporate",
                                    "Manufacturing Company",
                                    "Technology Provider",
                                    "Service Provider",
                                    "R&D Organization",
                                    "Industry Association",
                                    "Corporate Innovation Center",
                                    "Enterprise Buyer",
                                    "Supply-Chain Partner",
                                    "Accelerator / Incubator",
                                ].map((item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.ecosystemRole.includes(
                                                item
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            toggleMultiSelect(
                                                "ecosystemRole",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* QUESTION 3 */}

                    <div className="profile-question">

                        <div className="question-number">
                            03
                        </div>

                        <div className="question-content">

                            <h2>
                                What capabilities,
                                resources, or expertise
                                can your company offer
                                to startups?
                            </h2>

                            <div className="option-grid">

                                {[
                                    "Technology",
                                    "Manufacturing Facilities",
                                    "Infrastructure",
                                    "Mentorship",
                                    "Industry Expertise",
                                    "Distribution Network",
                                    "Market Access",
                                    "Testing Facilities",
                                    "Data / APIs",
                                    "Supply Chain",
                                    "Corporate Partnerships",
                                    "Talent / Hiring",
                                ].map((item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.companyOffers.includes(
                                                item
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            toggleMultiSelect(
                                                "companyOffers",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* QUESTION 4 */}

                    <div className="profile-question">

                        <div className="question-number">
                            04
                        </div>

                        <div className="question-content">

                            <h2>
                                What does your company
                                currently seek from the
                                startup ecosystem?
                            </h2>

                            <div className="option-grid">

                                {[
                                    "New Technologies",
                                    "Startup Solutions",
                                    "Innovation Partners",
                                    "Vendors / Suppliers",
                                    "Talent",
                                    "R&D Collaboration",
                                    "PoC / Pilot Projects",
                                    "Strategic Partnerships",
                                    "Acquisition Opportunities",
                                    "Market Expansion",
                                ].map((item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.companyNeeds.includes(
                                                item
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            toggleMultiSelect(
                                                "companyNeeds",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* QUESTION 5 */}

                    <div className="profile-question">

                        <div className="question-number">
                            05
                        </div>

                        <div className="question-content">

                            <h2>
                                What type of collaboration
                                is your company most
                                interested in?
                            </h2>

                            <div className="option-grid">

                                {[
                                    "Technology Integration",
                                    "Pilot / PoC",
                                    "R&D Collaboration",
                                    "Vendor Partnership",
                                    "Manufacturing Partnership",
                                    "Distribution Partnership",
                                    "Strategic Alliance",
                                    "Startup Investment",
                                    "Corporate Innovation",
                                    "Joint Product Development",
                                ].map((item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            form.collaborationInterests.includes(
                                                item
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            toggleMultiSelect(
                                                "collaborationInterests",
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>

                                ))}

                            </div>

                        </div>

                    </div>


                    {error && (
                        <div className="corporate-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="corporate-success">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="save-profile-btn"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Complete Company Profile"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default CorporateProfile;