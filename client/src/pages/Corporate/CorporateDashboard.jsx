import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";

import "../../styles/Corporate/CorporateDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function CorporateDashboard() {
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token =
                    localStorage.getItem(
                        "corporateToken"
                    );

                if (!token) {
                    navigate(
                        "/corporate/login",
                        { replace: true }
                    );
                    return;
                }

                // ---------------------------------------------
                // GET COMPANY ACCOUNT
                // ---------------------------------------------

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

                if (!accountResponse.ok) {
                    localStorage.removeItem(
                        "corporateToken"
                    );

                    localStorage.removeItem(
                        "corporateCompany"
                    );

                    navigate(
                        "/corporate/login",
                        { replace: true }
                    );

                    return;
                }

                const accountData =
                    await accountResponse.json();

                setCompany(
                    accountData.corporate ||
                    accountData.company ||
                    accountData.data ||
                    null
                );

                // ---------------------------------------------
                // GET COMPANY PROFILE
                // ---------------------------------------------

                const profileResponse =
                    await fetch(
                        `${API_URL}/api/corporate/profile`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                if (
                    profileResponse.status === 404
                ) {
                    setProfile(null);
                } else if (
                    profileResponse.ok
                ) {
                    const profileData =
                        await profileResponse.json();

                    setProfile(
                        profileData.profile ||
                        profileData.data ||
                        null
                    );
                }

            } catch (error) {
                console.error(
                    "Corporate Dashboard Error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);


    // =====================================================
    // COMPANY INFORMATION
    // =====================================================

    const companyName =
        company?.companyName ||
        company?.name ||
        "Company";

    const industry =
        profile?.industryDomain ||
        profile?.industry ||
        "Not specified";

    const ecosystemRole =
        Array.isArray(
            profile?.ecosystemRole
        ) &&
        profile.ecosystemRole.length > 0
            ? profile.ecosystemRole.join(", ")
            : "Not specified";

    const profileCompletion =
        profile?.profileCompletion ??
        (profile ? 100 : 0);


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="corporate-dashboard-layout">

            <Sidebar />

            <main className="corporate-dashboard-main">

                {loading ? (

                    <div className="corporate-dashboard-loader">
                        <div className="corporate-loader-circle" />

                        <p>
                            Loading your workspace...
                        </p>
                    </div>

                ) : (

                    <>

                        {/* =====================================
                            HERO SECTION
                        ====================================== */}

                        <section className="corporate-hero">

                            <div className="corporate-hero-content">

                                <div className="corporate-welcome-badge">
                                    CORPORATE WORKSPACE
                                </div>

                                <h1>
                                    Welcome back,
                                    <span>
                                        {" "}
                                        {companyName}
                                    </span>
                                </h1>

                                <p>
                                    Connect your organization with
                                    startups, innovators, investors,
                                    and professionals across the
                                    SICR ecosystem.
                                </p>

                                <div className="corporate-hero-actions">

                                    <button
                                        className="corporate-primary-btn"
                                        onClick={() =>
                                            navigate("/search")
                                        }
                                    >
                                        Discover Members
                                    </button>

                                    <button
                                        className="corporate-secondary-btn"
                                        onClick={() =>
                                            navigate(
                                                "/corporate/profile"
                                            )
                                        }
                                    >
                                        {profile
                                            ? "Manage Profile"
                                            : "Complete Profile"}
                                    </button>

                                </div>

                            </div>


                            <div className="corporate-hero-visual">

                                <div className="corporate-card-main">

                                    <span className="corporate-card-icon">
                                        ◈
                                    </span>

                                    <strong>
                                        Your Organization
                                    </strong>

                                    <p>
                                        {industry}
                                    </p>

                                </div>


                                <div className="corporate-floating-card corporate-card-top">

                                    <span>
                                        🤝
                                    </span>

                                    <div>
                                        <strong>
                                            Build Partnerships
                                        </strong>

                                        <small>
                                            Connect across SICR
                                        </small>
                                    </div>

                                </div>


                                <div className="corporate-floating-card corporate-card-bottom">

                                    <span>
                                        🚀
                                    </span>

                                    <div>
                                        <strong>
                                            Drive Innovation
                                        </strong>

                                        <small>
                                            Create new opportunities
                                        </small>
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =====================================
                            STATISTICS
                        ====================================== */}

                        <section className="corporate-stats-grid">

                            <div className="corporate-stat-card">

                                <div className="corporate-stat-icon">
                                    ◎
                                </div>

                                <div>
                                    <span>
                                        Connections
                                    </span>

                                    <h2>
                                        —
                                    </h2>

                                    <small>
                                        Your professional network
                                    </small>
                                </div>

                            </div>


                            <div className="corporate-stat-card">

                                <div className="corporate-stat-icon">
                                    ◌
                                </div>

                                <div>
                                    <span>
                                        Messages
                                    </span>

                                    <h2>
                                        —
                                    </h2>

                                    <small>
                                        Stay connected
                                    </small>
                                </div>

                            </div>


                            <div className="corporate-stat-card">

                                <div className="corporate-stat-icon">
                                    ◈
                                </div>

                                <div>
                                    <span>
                                        Industry
                                    </span>

                                    <h2 className="corporate-stat-text">
                                        {industry ===
                                        "Not specified"
                                            ? "—"
                                            : "Active"}
                                    </h2>

                                    <small>
                                        Your organization focus
                                    </small>
                                </div>

                            </div>


                            <div className="corporate-stat-card">

                                <div className="corporate-stat-icon">
                                    ✓
                                </div>

                                <div>
                                    <span>
                                        Profile Status
                                    </span>

                                    <h2>
                                        {profileCompletion}%
                                    </h2>

                                    <small>
                                        Profile completion
                                    </small>
                                </div>

                            </div>

                        </section>


                        {/* =====================================
                            DASHBOARD CONTENT
                        ====================================== */}

                        <section className="corporate-content-grid">


                            {/* LEFT COLUMN */}

                            <div className="corporate-main-column">


                                {/* ORGANIZATION OVERVIEW */}

                                <div className="corporate-section-card">

                                    <div className="corporate-section-header">

                                        <div>

                                            <span className="corporate-section-label">
                                                YOUR ORGANIZATION
                                            </span>

                                            <h2>
                                                Build meaningful impact
                                            </h2>

                                        </div>

                                        <span className="corporate-section-icon">
                                            ◈
                                        </span>

                                    </div>


                                    <p className="corporate-section-description">

                                        SICR brings organizations,
                                        startups, investors, mentors,
                                        and professionals together
                                        in one connected ecosystem.
                                        Your company can discover
                                        opportunities, build
                                        partnerships, and support
                                        innovation.

                                    </p>


                                    <div className="corporate-focus-grid">


                                        <div className="corporate-focus-item">

                                            <span>
                                                01
                                            </span>

                                            <div>

                                                <strong>
                                                    Discover
                                                </strong>

                                                <p>
                                                    Explore members and
                                                    opportunities across
                                                    SICR.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="corporate-focus-item">

                                            <span>
                                                02
                                            </span>

                                            <div>

                                                <strong>
                                                    Connect
                                                </strong>

                                                <p>
                                                    Build valuable
                                                    professional
                                                    relationships.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="corporate-focus-item">

                                            <span>
                                                03
                                            </span>

                                            <div>

                                                <strong>
                                                    Collaborate
                                                </strong>

                                                <p>
                                                    Create opportunities
                                                    and drive innovation.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* QUICK ACTIONS */}

                                <div className="corporate-section-card corporate-actions-card">

                                    <div className="corporate-section-header">

                                        <div>

                                            <span className="corporate-section-label">
                                                QUICK ACTIONS
                                            </span>

                                            <h2>
                                                Continue your journey
                                            </h2>

                                        </div>

                                    </div>


                                    <div className="corporate-quick-actions">

                                        <button
                                            onClick={() =>
                                                navigate("/search")
                                            }
                                        >

                                            <span>
                                                🔍
                                            </span>

                                            <div>

                                                <strong>
                                                    Discover
                                                </strong>

                                                <small>
                                                    Find ecosystem members
                                                </small>

                                            </div>

                                        </button>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/connections"
                                                )
                                            }
                                        >

                                            <span>
                                                🤝
                                            </span>

                                            <div>

                                                <strong>
                                                    Connections
                                                </strong>

                                                <small>
                                                    Manage your network
                                                </small>

                                            </div>

                                        </button>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/corporate/messenger"
                                                )
                                            }
                                        >

                                            <span>
                                                💬
                                            </span>

                                            <div>

                                                <strong>
                                                    Messages
                                                </strong>

                                                <small>
                                                    Continue conversations
                                                </small>

                                            </div>

                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* RIGHT COLUMN */}

                            <aside className="corporate-right-column">


                                {/* COMPANY PROFILE */}

                                <div className="corporate-profile-card">

                                    <div className="corporate-profile-top">

                                        <div className="corporate-avatar">
                                            {companyName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>


                                        <div>

                                            <h3>
                                                {companyName}
                                            </h3>

                                            <p>
                                                Corporate Member
                                            </p>

                                        </div>

                                    </div>


                                    <div className="corporate-profile-info">

                                        <div>

                                            <span>
                                                INDUSTRY
                                            </span>

                                            <strong>
                                                {industry}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                ECOSYSTEM ROLE
                                            </span>

                                            <strong>
                                                {ecosystemRole}
                                            </strong>

                                        </div>

                                    </div>


                                    <button
                                        className="corporate-profile-button"
                                        onClick={() =>
                                            navigate(
                                                "/corporate/profile"
                                            )
                                        }
                                    >
                                        {profile
                                            ? "Manage Profile"
                                            : "Complete Profile"}
                                    </button>

                                </div>


                                {/* PROFILE TIP */}

                                <div className="corporate-tip-card">

                                    <div className="corporate-tip-icon">
                                        💡
                                    </div>

                                    <span>
                                        SICR TIP
                                    </span>

                                    <h3>
                                        Strong partnerships start with
                                        meaningful connections.
                                    </h3>

                                    <p>
                                        Keep your company profile
                                        updated so ecosystem members
                                        can better understand your
                                        organization and collaboration
                                        interests.
                                    </p>

                                </div>

                            </aside>

                        </section>

                    </>

                )}

            </main>

        </div>
    );
}

export default CorporateDashboard;