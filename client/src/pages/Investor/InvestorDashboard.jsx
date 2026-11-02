import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./InvestorDashboard.css";

function InvestorDashboard() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    // =========================================================
    // STATE
    // =========================================================

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // NAVIGATION
    // =========================================================

    const goTo = (path) => {
        navigate(path);
    };

    const logout = () => {
        localStorage.removeItem("investorFunderToken");
        localStorage.removeItem("investorFunderUser");
        localStorage.removeItem("investorRegisterData");

        navigate("/investor/login");
    };

    // =========================================================
    // FETCH DASHBOARD DATA
    // =========================================================

    useEffect(() => {
        let mounted = true;

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem(
                    "investorFunderToken"
                );

                if (!token) {
                    navigate("/investor/login");
                    return;
                }

                // =================================================
                // ACCOUNT
                // =================================================

                const dashboardResponse = await fetch(
                    `${API_URL}/api/investor-funder/dashboard`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const dashboardData =
                    await dashboardResponse.json();

                if (
                    dashboardResponse.status === 401
                ) {
                    logout();
                    return;
                }

                if (!dashboardResponse.ok) {
                    throw new Error(
                        dashboardData.message ||
                        "Failed to load dashboard."
                    );
                }

                if (!mounted) return;

                setUser(
                    dashboardData.investorFunder
                );

                // =================================================
                // PROFILE
                // =================================================

                const profileResponse = await fetch(
                    `${API_URL}/api/investor-funder/profile`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const profileData =
                    await profileResponse.json();

                if (
                    profileResponse.status === 401
                ) {
                    logout();
                    return;
                }

                if (profileResponse.ok) {
                    if (mounted) {
                        setProfile(
                            profileData.investorFunder
                        );
                    }
                } else {
                    if (mounted) {
                        setProfile(null);
                    }
                }
            } catch (err) {
                console.error(
                    "INVESTOR DASHBOARD ERROR:",
                    err
                );

                if (mounted) {
                    setError(
                        err.message ||
                        "Unable to connect to the server."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            mounted = false;
        };
    }, [navigate, API_URL]);

    // =========================================================
    // PROFILE DATA
    // =========================================================

    const completion = useMemo(() => {
        const value =
            profile?.profileCompletionPercentage ??
            profile?.profileCompletion ??
            0;

        const number = Number(value);

        if (Number.isNaN(number)) {
            return 0;
        }

        return Math.min(
            100,
            Math.max(0, number)
        );
    }, [profile]);

    const firstName =
        user?.firstName ||
        profile?.firstName ||
        "Investor";

    const lastName =
        user?.lastName ||
        profile?.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    const email =
        user?.email ||
        profile?.email ||
        "";

    const initials =
        `${firstName?.charAt(0) || "I"}${lastName?.charAt(0) || ""
            }`.toUpperCase();

    const investorType =
        profile?.profileType ||
        profile?.investorType ||
        "Investor / Funder";

    const industries =
        Array.isArray(profile?.industries)
            ? profile.industries
            : [];

    const startupStages =
        Array.isArray(
            profile?.preferredStartupStages
        )
            ? profile.preferredStartupStages
            : [];

    const supportOffered =
        Array.isArray(profile?.supportOffered)
            ? profile.supportOffered
            : profile?.supportOffered
                ? [profile.supportOffered]
                : [];

    // =========================================================
    // PROFILE STATUS
    // =========================================================

    const profileComplete =
        completion >= 100 ||
        profile?.profileCompleted === true;

    const profileStatus =
        profileComplete
            ? "Complete"
            : "Needs attention";

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="investor-dashboard-loading">
                <div className="loading-card">
                    <div className="loading-logo">
                        SICR
                    </div>

                    <div className="loading-spinner" />

                    <h2>
                        Preparing your dashboard
                    </h2>

                    <p>
                        Loading your investor ecosystem...
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <div className="investor-dashboard-error-page">
                <div className="dashboard-error-card">
                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div className="error-actions">
                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                        <button
                            className="secondary"
                            onClick={() =>
                                navigate("/investor/login")
                            }
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="investor-dashboard">

                        <Sidebar />



            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div className="investor-main">

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="investor-topbar">
<div className="topbar-title">

                        <span>
                            INVESTOR & FUNDER
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                    </div>

                    <div className="topbar-actions">

                        <button
                            className="topbar-icon-button"
                            title="Search"
                        >
                            ⌕
                        </button>

                        <button
                            className="topbar-icon-button notification-icon"
                            onClick={() =>
                                goTo(
                                    "/investor/notifications",
                                    "notifications"
                                )
                            }
                            title="Notifications"
                        >
                            ♢

                            <span />
                        </button>

                        <div className="topbar-user">

                            <div className="topbar-avatar">
                                {initials}
                            </div>

                            <div className="topbar-user-text">

                                <strong>
                                    {firstName}
                                </strong>

                                <small>
                                    {investorType}
                                </small>

                            </div>

                        </div>

                    </div>

                </header>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="investor-content">

                    {/* =================================================
                        WELCOME HERO
                    ================================================= */}

                    <section className="dashboard-hero">

                        <div className="hero-content">

                            <div className="hero-label">
                                INVESTOR WORKSPACE
                            </div>

                            <h2>
                                Good to see you,{" "}
                                {firstName}!
                            </h2>

                            <p>
                                Discover promising startups,
                                evaluate opportunities and
                                build meaningful connections
                                across the SICR ecosystem.
                            </p>

                            <div className="hero-actions">

                                <button
                                    className="primary-action"
                                    onClick={() =>
                                        goTo(
                                            "/search",
                                            "discover"
                                        )
                                    }
                                >
                                    Discover Startups
                                    <span>
                                        →
                                    </span>
                                </button>

                                <button
                                    className="secondary-action"
                                    onClick={() =>
                                        goTo(
                                            "/investor/profile",
                                            "profile"
                                        )
                                    }
                                >
                                    View My Profile
                                </button>

                            </div>

                        </div>

                        <div className="hero-visual">

                            <div className="hero-orbit orbit-one" />
                            <div className="hero-orbit orbit-two" />
                            <div className="hero-orbit orbit-three" />

                            <div className="hero-center">
                                <span>
                                    SICR
                                </span>

                                <small>
                                    ECOSYSTEM
                                </small>
                            </div>

                            <div className="floating-card floating-one">
                                <span>
                                    ✦
                                </span>

                                <div>
                                    <strong>
                                        Startups
                                    </strong>

                                    <small>
                                        Discover
                                    </small>
                                </div>
                            </div>

                            <div className="floating-card floating-two">
                                <span>
                                    $
                                </span>

                                <div>
                                    <strong>
                                        Funding
                                    </strong>

                                    <small>
                                        Opportunities
                                    </small>
                                </div>
                            </div>

                            <div className="floating-card floating-three">
                                <span>
                                    ↗
                                </span>

                                <div>
                                    <strong>
                                        Growth
                                    </strong>

                                    <small>
                                        Connections
                                    </small>
                                </div>
                            </div>

                        </div>

                    </section>

                    {/* =================================================
                        PROFILE COMPLETION
                    ================================================= */}

                    {!profileComplete && (
                        <section className="profile-progress-card">

                            <div className="progress-left">

                                <div className="progress-icon">
                                    %
                                </div>

                                <div>

                                    <span>
                                        PROFILE COMPLETION
                                    </span>

                                    <h3>
                                        Complete your investor profile
                                    </h3>

                                    <p>
                                        A complete profile helps
                                        SICR match you with more
                                        relevant startups and
                                        funding opportunities.
                                    </p>

                                </div>

                            </div>

                            <div className="progress-right">

                                <div className="progress-circle">

                                    <svg
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            className="progress-bg"
                                        />

                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            className="progress-value"
                                            strokeDasharray="264"
                                            strokeDashoffset={
                                                264 -
                                                (264 *
                                                    completion) /
                                                100
                                            }
                                        />
                                    </svg>

                                    <strong>
                                        {completion}%
                                    </strong>

                                </div>

                                <button
                                    onClick={() =>
                                        goTo(
                                            "/investor/profile",
                                            "profile"
                                        )
                                    }
                                >
                                    Complete Profile
                                    <span>
                                        →
                                    </span>
                                </button>

                            </div>

                        </section>
                    )}

                    {/* =================================================
                        QUICK STATS
                    ================================================= */}

                    <section className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-icon">
                                ◉
                            </div>

                            <div className="stat-content">

                                <span>
                                    Profile Status
                                </span>

                                <strong>
                                    {profileStatus}
                                </strong>

                                <small>
                                    {completion}% complete
                                </small>

                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon">
                                ◆
                            </div>

                            <div className="stat-content">

                                <span>
                                    Investor Type
                                </span>

                                <strong>
                                    {investorType}
                                </strong>

                                <small>
                                    Your investment identity
                                </small>

                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon">
                                ◇
                            </div>

                            <div className="stat-content">

                                <span>
                                    Preferred Stages
                                </span>

                                <strong>
                                    {startupStages.length}
                                </strong>

                                <small>
                                    Startup stages selected
                                </small>

                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon">
                                ✦
                            </div>

                            <div className="stat-content">

                                <span>
                                    Focus Industries
                                </span>

                                <strong>
                                    {industries.length}
                                </strong>

                                <small>
                                    Areas of interest
                                </small>

                            </div>

                        </div>

                    </section>

                    {/* =================================================
                        MAIN GRID
                    ================================================= */}

                    <div className="dashboard-main-grid">

                        {/* =================================================
                            INVESTMENT PREFERENCES
                        ================================================= */}

                        <section className="dashboard-panel preferences-panel">

                            <div className="panel-heading">

                                <div>

                                    <span>
                                        INVESTMENT PROFILE
                                    </span>

                                    <h2>
                                        Your Preferences
                                    </h2>

                                </div>

                                <button
                                    onClick={() =>
                                        goTo(
                                            "/investor/profile",
                                            "profile"
                                        )
                                    }
                                >
                                    Edit
                                </button>

                            </div>

                            <div className="preference-list">

                                <div className="preference-item">

                                    <div className="preference-icon">
                                        ◈
                                    </div>

                                    <div>

                                        <span>
                                            Preferred Industries
                                        </span>

                                        <div className="tag-list">

                                            {industries.length >
                                                0 ? (
                                                industries.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className="preference-tag"
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <em>
                                                    Not specified
                                                </em>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div className="preference-item">

                                    <div className="preference-icon">
                                        ◫
                                    </div>

                                    <div>

                                        <span>
                                            Startup Stages
                                        </span>

                                        <div className="tag-list">

                                            {startupStages.length >
                                                0 ? (
                                                startupStages.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className="preference-tag"
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <em>
                                                    Not specified
                                                </em>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div className="preference-item">

                                    <div className="preference-icon">
                                        $
                                    </div>

                                    <div>

                                        <span>
                                            Funding Range
                                        </span>

                                        <strong className="preference-value">
                                            {profile?.fundingRange ||
                                                profile?.fundingInterest ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                </div>

                                <div className="preference-item">

                                    <div className="preference-icon">
                                        ◎
                                    </div>

                                    <div>

                                        <span>
                                            Geography
                                        </span>

                                        <strong className="preference-value">
                                            {profile?.geography ||
                                                "Not specified"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            PROFILE SUMMARY
                        ================================================= */}

                        <section className="dashboard-panel profile-summary-panel">

                            <div className="panel-heading">

                                <div>

                                    <span>
                                        ACCOUNT
                                    </span>

                                    <h2>
                                        Investor Profile
                                    </h2>

                                </div>

                                <button
                                    onClick={() =>
                                        goTo(
                                            "/investor/profile",
                                            "profile"
                                        )
                                    }
                                >
                                    View
                                </button>

                            </div>

                            <div className="profile-summary-header">

                                <div className="large-avatar">
                                    {initials}
                                </div>

                                <div>

                                    <h3>
                                        {fullName}
                                    </h3>

                                    <p>
                                        {email}
                                    </p>

                                    <span className="profile-type-pill">
                                        {investorType}
                                    </span>

                                </div>

                            </div>

                            <div className="profile-summary-details">

                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        <i
                                            className={
                                                profileComplete
                                                    ? "status-green"
                                                    : "status-yellow"
                                            }
                                        />

                                        {profileComplete
                                            ? "Verified"
                                            : "Profile Pending"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Support
                                    </span>

                                    <strong>
                                        {supportOffered.length >
                                            0
                                            ? supportOffered
                                                .slice(
                                                    0,
                                                    2
                                                )
                                                .join(
                                                    ", "
                                                )
                                            : "Not specified"}
                                    </strong>
                                </div>

                            </div>

                        </section>

                    </div>

                    {/* =================================================
                        OPPORTUNITY CENTER
                    ================================================= */}

                    <section className="opportunity-section">

                        <div className="section-title-row">

                            <div>

                                <span>
                                    SICR ECOSYSTEM
                                </span>

                                <h2>
                                    Opportunity Center
                                </h2>

                                <p>
                                    Find ways to create value
                                    across the startup ecosystem.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    goTo(
                                        "/investor/opportunities",
                                        "opportunities"
                                    )
                                }
                            >
                                View All
                                <span>
                                    →
                                </span>
                            </button>

                        </div>

                        <div className="opportunity-grid">

                            {/* STARTUPS */}

                            <button
                                className="opportunity-card startup-opportunity"
                                onClick={() =>
                                    goTo(
                                        "/search",
                                        "discover"
                                    )
                                }
                            >

                                <div className="opportunity-top">

                                    <div className="opportunity-icon">
                                        🚀
                                    </div>

                                    <span>
                                        EXPLORE
                                    </span>

                                </div>

                                <h3>
                                    Discover Startups
                                </h3>

                                <p>
                                    Explore emerging companies,
                                    innovative products and
                                    founders looking for the
                                    right partners.
                                </p>

                                <div className="opportunity-link">
                                    Explore Startups
                                    <span>
                                        →
                                    </span>
                                </div>

                            </button>

                            {/* FUNDING */}

                            <button
                                className="opportunity-card funding-opportunity"
                                onClick={() =>
                                    goTo(
                                        "/investor/opportunities",
                                        "opportunities"
                                    )
                                }
                            >

                                <div className="opportunity-top">

                                    <div className="opportunity-icon">
                                        $
                                    </div>

                                    <span>
                                        INVEST
                                    </span>

                                </div>

                                <h3>
                                    Funding Opportunities
                                </h3>

                                <p>
                                    Discover startups seeking
                                    capital and evaluate
                                    opportunities matching your
                                    investment interests.
                                </p>

                                <div className="opportunity-link">
                                    Explore Funding
                                    <span>
                                        →
                                    </span>
                                </div>

                            </button>

                            {/* CONNECTIONS */}

                            <button
                                className="opportunity-card connection-opportunity"
                                onClick={() =>
                                    goTo(
                                        "/investor/messages",
                                        "messages"
                                    )
                                }
                            >

                                <div className="opportunity-top">

                                    <div className="opportunity-icon">
                                        ↗
                                    </div>

                                    <span>
                                        CONNECT
                                    </span>

                                </div>

                                <h3>
                                    Build Connections
                                </h3>

                                <p>
                                    Connect with founders,
                                    mentors and ecosystem
                                    participants to create
                                    strategic opportunities.
                                </p>

                                <div className="opportunity-link">
                                    View Connections
                                    <span>
                                        →
                                    </span>
                                </div>

                            </button>

                        </div>

                    </section>

                    {/* =================================================
                        LOWER GRID
                    ================================================= */}

                    <div className="lower-dashboard-grid">

                        {/* =================================================
                            RECENT ACTIVITY
                        ================================================= */}

                        <section className="dashboard-panel activity-panel">

                            <div className="panel-heading">

                                <div>

                                    <span>
                                        ACTIVITY
                                    </span>

                                    <h2>
                                        Recent Activity
                                    </h2>

                                </div>

                            </div>

                            <div className="empty-activity">

                                <div className="empty-activity-icon">
                                    ◷
                                </div>

                                <h3>
                                    No activity yet
                                </h3>

                                <p>
                                    Your startup views,
                                    connections and investment
                                    activities will appear here.
                                </p>

                                <button
                                    onClick={() =>
                                        goTo(
                                            "/search",
                                            "discover"
                                        )
                                    }
                                >
                                    Start Exploring
                                    <span>
                                        →
                                    </span>
                                </button>

                            </div>

                        </section>

                        {/* =================================================
                            SAVED STARTUPS
                        ================================================= */}

                        <section className="dashboard-panel saved-panel">

                            <div className="panel-heading">

                                <div>

                                    <span>
                                        WATCHLIST
                                    </span>

                                    <h2>
                                        Saved Startups
                                    </h2>

                                </div>

                                <button
                                    onClick={() =>
                                        goTo(
                                            "/investor/saved",
                                            "saved"
                                        )
                                    }
                                >
                                    View All
                                </button>

                            </div>

                            <div className="empty-saved">

                                <div className="saved-illustration">
                                    ♡
                                </div>

                                <h3>
                                    Your watchlist is empty
                                </h3>

                                <p>
                                    Save interesting startups
                                    here so you can easily
                                    revisit them later.
                                </p>

                                <button
                                    onClick={() =>
                                        goTo(
                                            "/investor/startups",
                                            "discover"
                                        )
                                    }
                                >
                                    Discover Startups
                                    <span>
                                        →
                                    </span>
                                </button>

                            </div>

                        </section>

                    </div>

                    {/* =================================================
                        ECOSYSTEM NETWORK
                    ================================================= */}

                    <section className="ecosystem-network">

                        <div className="network-content">

                            <span>
                                SICR NETWORK
                            </span>

                            <h2>
                                More than an investment platform.
                            </h2>

                            <p>
                                Build relationships with founders,
                                mentors, institutions, corporates,
                                partners and other ecosystem
                                participants.
                            </p>

                            <button
                                onClick={() =>
                                    goTo("/ecosystem")
                                }
                            >
                                Explore SICR Ecosystem
                                <span>
                                    →
                                </span>
                            </button>

                        </div>

                        <div className="network-visual">

                            <div className="network-circle circle-one">
                                <span>
                                    STARTUPS
                                </span>
                            </div>

                            <div className="network-circle circle-two">
                                <span>
                                    INVESTORS
                                </span>
                            </div>

                            <div className="network-circle circle-three">
                                <span>
                                    MENTORS
                                </span>
                            </div>

                            <div className="network-core">
                                SICR
                            </div>

                        </div>

                    </section>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <footer className="investor-dashboard-footer">

                        <div>
                            <strong>
                                SICR
                            </strong>

                            <span>
                                Investor & Funder Ecosystem
                            </span>
                        </div>

                        <div className="footer-links">

                            <button
                                onClick={() =>
                                    goTo("/ecosystem")
                                }
                            >
                                Ecosystem
                            </button>

                            <button
                                onClick={() =>
                                    goTo(
                                        "/investor/profile",
                                        "profile"
                                    )
                                }
                            >
                                Profile
                            </button>

                            <button
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </div>

                    </footer>

                </main>

            </div>

        </div>
    );
}

export default InvestorDashboard;