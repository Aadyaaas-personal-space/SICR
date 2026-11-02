import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Partnership/PartnershipDashboard.css";

function PartnershipDashboard() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState("Overview");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token =
                    localStorage.getItem("partnershipToken");

                if (!token) {
                    navigate("/partnership/login");
                    return;
                }

                const accountResponse = await fetch(
                    `${API_URL}/api/partnership/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (accountResponse.status === 401) {
                    localStorage.removeItem(
                        "partnershipToken"
                    );

                    navigate("/partnership/login");
                    return;
                }

                const accountData =
                    await accountResponse.json();

                setAccount(accountData.account);

                const profileResponse = await fetch(
                    `${API_URL}/api/partnership/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (profileResponse.ok) {
                    const profileData =
                        await profileResponse.json();

                    setProfile(profileData.profile);
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error(
                    "Partnership dashboard error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate, API_URL]);

    const logout = () => {
        localStorage.removeItem("partnershipToken");
        navigate("/ecosystem");
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);

        if (menu === "Profile") {
            navigate("/partnership/profile");
        }
    };

    if (loading) {
        return (
            <div className="partnership-dashboard-loading">
                <div className="loading-circle"></div>
                <p>Preparing your collaboration space...</p>
            </div>
        );
    }

    return (
        <div className="partnership-dashboard-shell">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="partnership-sidebar">

                <div className="sidebar-brand">

                    <div className="brand-mark">
                        P
                    </div>

                    <div>
                        <h2>Partnership</h2>
                        <span>COLLABORATION</span>
                    </div>

                </div>

                <div className="sidebar-section-title">
                    WORKSPACE
                </div>

                <nav className="sidebar-nav">

                    <button
                        className={
                            activeMenu === "Overview"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick("Overview")
                        }
                    >
                        <span className="nav-icon">
                            ◈
                        </span>

                        Overview
                    </button>

                    <button
                        className={
                            activeMenu === "Profile"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleMenuClick("Profile")
                        }
                    >
                        <span className="nav-icon">
                            ◉
                        </span>

                        My Profile
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            setActiveMenu(
                                "Opportunities"
                            )
                        }
                    >
                        <span className="nav-icon">
                            ◇
                        </span>

                        Opportunities

                        <span className="coming-soon">
                            Soon
                        </span>
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            setActiveMenu("Network")
                        }
                    >
                        <span className="nav-icon">
                            ◎
                        </span>

                        Network

                        <span className="coming-soon">
                            Soon
                        </span>
                    </button>

                </nav>

                <div className="sidebar-section-title second">
                    ACCOUNT
                </div>

                <nav className="sidebar-nav">

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            setActiveMenu("Settings")
                        }
                    >
                        <span className="nav-icon">
                            ⚙
                        </span>

                        Settings
                    </button>

                    <button
                        className="sidebar-item logout-sidebar"
                        onClick={logout}
                    >
                        <span className="nav-icon">
                            ↪
                        </span>

                        Logout
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <div className="ecosystem-mini-card">

                        <div className="mini-dot"></div>

                        <div>
                            <strong>
                                SICR Ecosystem
                            </strong>

                            <span>
                                Connected
                            </span>
                        </div>

                    </div>

                </div>

            </aside>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="partnership-main">

                {/* TOPBAR */}

                <header className="partnership-topbar">

                    <div className="mobile-brand">
                        <div className="brand-mark">
                            P
                        </div>

                        <strong>
                            Partnership
                        </strong>
                    </div>

                    <div className="topbar-right">

                        <button className="notification-btn">
                            ♢
                            <span></span>
                        </button>

                        <div className="user-mini">

                            <div className="user-avatar">
                                {account?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div>
                                <strong>
                                    {account?.name}
                                </strong>

                                <span>
                                    Partner
                                </span>
                            </div>

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="partnership-content">

                    {/* HERO */}

                    <section className="dashboard-hero">

                        <div className="hero-copy">

                            <span className="hero-eyebrow">
                                PARTNERSHIP & COLLABORATION
                            </span>

                            <h1>
                                Build connections
                                <br />
                                that create impact.
                            </h1>

                            <p>
                                Your collaboration workspace
                                connects your capabilities,
                                interests and opportunities
                                with the wider SICR ecosystem.
                            </p>

                        </div>

                        <div className="hero-visual">

                            <div className="orbit orbit-one"></div>
                            <div className="orbit orbit-two"></div>

                            <div className="connection-node center">
                                P
                            </div>

                            <div className="connection-node node-one">
                                S
                            </div>

                            <div className="connection-node node-two">
                                C
                            </div>

                            <div className="connection-node node-three">
                                I
                            </div>

                            <div className="connection-line line-one"></div>
                            <div className="connection-line line-two"></div>
                            <div className="connection-line line-three"></div>

                        </div>

                    </section>


                    {/* PROFILE STATUS */}

                    <section className="profile-status-card">

                        <div className="profile-status-left">

                            <div className="profile-progress-ring">

                                <div className="progress-inner">
                                    100%
                                </div>

                            </div>

                            <div>

                                <span className="card-label">
                                    PROFILE STRENGTH
                                </span>

                                <h3>
                                    Your profile is complete
                                </h3>

                                <p>
                                    You're ready to be discovered
                                    by potential collaborators.
                                </p>

                            </div>

                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/partnership/profile"
                                )
                            }
                        >
                            Manage Profile →
                        </button>

                    </section>


                    {/* QUICK STATS */}

                    <section className="partnership-stats">

                        <div className="stat-box">

                            <div className="stat-icon">
                                ◈
                            </div>

                            <div>
                                <span>
                                    COLLABORATION ROLE
                                </span>

                                <strong>
                                    {profile?.collaborationRole ||
                                        "Not defined"}
                                </strong>
                            </div>

                        </div>

                        <div className="stat-box">

                            <div className="stat-icon">
                                ◎
                            </div>

                            <div>
                                <span>
                                    COLLABORATION SCALE
                                </span>

                                <strong>
                                    {profile?.collaborationScale ||
                                        "Not defined"}
                                </strong>
                            </div>

                        </div>

                        <div className="stat-box">

                            <div className="stat-icon">
                                ◇
                            </div>

                            <div>
                                <span>
                                    OFFERINGS
                                </span>

                                <strong>
                                    {profile?.offerings?.length ||
                                        0}
                                </strong>
                            </div>

                        </div>

                        <div className="stat-box">

                            <div className="stat-icon">
                                ◉
                            </div>

                            <div>
                                <span>
                                    DOMAINS
                                </span>

                                <strong>
                                    {profile?.sectors?.length ||
                                        0}
                                </strong>
                            </div>

                        </div>

                    </section>


                    {/* TWO COLUMN */}

                    <section className="dashboard-grid">

                        {/* LEFT */}

                        <div className="dashboard-panel">

                            <div className="panel-heading">

                                <div>
                                    <span>
                                        YOUR COLLABORATION
                                    </span>

                                    <h2>
                                        What you bring
                                    </h2>
                                </div>

                                <span className="panel-symbol">
                                    +
                                </span>

                            </div>

                            <p className="panel-description">
                                Capabilities you've made
                                available to the ecosystem.
                            </p>

                            <div className="tag-list">

                                {profile?.offerings?.length ? (
                                    profile.offerings.map(
                                        (item) => (
                                            <span
                                                className="premium-tag"
                                                key={item}
                                            >
                                                <i></i>
                                                {item}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <span className="empty-text">
                                        No offerings added yet.
                                    </span>
                                )}

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div className="dashboard-panel">

                            <div className="panel-heading">

                                <div>
                                    <span>
                                        COLLABORATION NEEDS
                                    </span>

                                    <h2>
                                        What you're looking for
                                    </h2>
                                </div>

                                <span className="panel-symbol">
                                    ↗
                                </span>

                            </div>

                            <p className="panel-description">
                                Areas where the right partnership
                                could accelerate your goals.
                            </p>

                            <div className="tag-list">

                                {profile?.collaborationNeeds?.length ? (
                                    profile.collaborationNeeds.map(
                                        (item) => (
                                            <span
                                                className="premium-tag need-tag"
                                                key={item}
                                            >
                                                <i></i>
                                                {item}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <span className="empty-text">
                                        No collaboration needs added.
                                    </span>
                                )}

                            </div>

                        </div>

                    </section>


                    {/* DOMAIN SECTION */}

                    <section className="domain-panel">

                        <div className="domain-heading">

                            <div>
                                <span>
                                    AREAS OF EXPERTISE
                                </span>

                                <h2>
                                    Your ecosystem footprint
                                </h2>
                            </div>

                            <span className="domain-count">
                                {profile?.sectors?.length || 0}
                                {" "}domains
                            </span>

                        </div>

                        <div className="domain-grid">

                            {profile?.sectors?.length ? (
                                profile.sectors.map(
                                    (sector, index) => (
                                        <div
                                            className="domain-card"
                                            key={sector}
                                        >

                                            <div className="domain-number">
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>

                                            <h3>
                                                {sector}
                                            </h3>

                                            <span>
                                                Collaboration
                                                potential
                                            </span>

                                        </div>
                                    )
                                )
                            ) : (
                                <div className="empty-domain">
                                    Add domains to showcase
                                    your ecosystem expertise.
                                </div>
                            )}

                        </div>

                    </section>


                    {/* OPPORTUNITIES */}

                    <section className="opportunity-banner">

                        <div className="opportunity-icon">
                            ✦
                        </div>

                        <div className="opportunity-copy">

                            <span>
                                COMING NEXT
                            </span>

                            <h2>
                                Intelligent partnership
                                discovery.
                            </h2>

                            <p>
                                SICR will use your collaboration
                                profile to discover relevant
                                startups, corporates, investors,
                                mentors and other ecosystem
                                partners.
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                setActiveMenu(
                                    "Opportunities"
                                )
                            }
                        >
                            Explore Opportunities →
                        </button>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default PartnershipDashboard;