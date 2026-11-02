import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";

import "../../styles/Mentor/MentorDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function MentorDashboard() {
    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMentor = async () => {
            try {
                const token =
                    localStorage.getItem("mentorToken");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/mentor/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setMentor(
                        data.mentor ||
                        data.profile ||
                        data.data ||
                        null
                    );
                }
            } catch (error) {
                console.error(
                    "Unable to load mentor dashboard:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadMentor();
    }, []);

    const mentorName =
        mentor?.fullName ||
        mentor?.name ||
        mentor?.firstName ||
        "Mentor";

    const expertise =
        mentor?.expertise ||
        mentor?.industry ||
        "Professional Mentoring";

    return (
        <div className="mentor-dashboard-layout">

            {/* ===============================
                SIDEBAR
            =============================== */}

            <Sidebar />

            {/* ===============================
                MAIN CONTENT
            =============================== */}

            <main className="mentor-dashboard-main">

                {loading ? (
                    <div className="mentor-dashboard-loader">
                        <div className="mentor-loader-circle" />
                        <p>Loading your workspace...</p>
                    </div>
                ) : (
                    <>
                        {/* ===============================
                            HERO SECTION
                        =============================== */}

                        <section className="mentor-hero">

                            <div className="mentor-hero-content">

                                <div className="mentor-welcome-badge">
                                    MENTOR WORKSPACE
                                </div>

                                <h1>
                                    Welcome back,
                                    <span> {mentorName}</span>
                                </h1>

                                <p>
                                    Share your experience, connect with
                                    ambitious people, and help shape the
                                    next generation of startups and
                                    professionals.
                                </p>

                                <div className="mentor-hero-actions">

                                    <button
                                        className="mentor-primary-btn"
                                        onClick={() =>
                                            navigate("/mentor/discover")
                                        }
                                    >
                                        Discover Members
                                    </button>

                                    <button
                                        className="mentor-secondary-btn"
                                        onClick={() =>
                                            navigate("/mentor/profile")
                                        }
                                    >
                                        View Profile
                                    </button>

                                </div>

                            </div>

                            <div className="mentor-hero-visual">

                                <div className="mentor-visual-card mentor-card-main">
                                    <span className="mentor-card-icon">
                                        ✦
                                    </span>

                                    <strong>
                                        Your Expertise
                                    </strong>

                                    <p>
                                        {expertise}
                                    </p>
                                </div>

                                <div className="mentor-floating-card mentor-card-top">
                                    <span>👥</span>
                                    <div>
                                        <strong>
                                            Build Connections
                                        </strong>
                                        <small>
                                            Grow your network
                                        </small>
                                    </div>
                                </div>

                                <div className="mentor-floating-card mentor-card-bottom">
                                    <span>🚀</span>
                                    <div>
                                        <strong>
                                            Create Impact
                                        </strong>
                                        <small>
                                            Guide future innovators
                                        </small>
                                    </div>
                                </div>

                            </div>

                        </section>


                        {/* ===============================
                            STATISTICS
                        =============================== */}

                        <section className="mentor-stats-grid">

                            <div className="mentor-stat-card">
                                <div className="mentor-stat-icon">
                                    👥
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


                            <div className="mentor-stat-card">
                                <div className="mentor-stat-icon">
                                    ✉
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


                            <div className="mentor-stat-card">
                                <div className="mentor-stat-icon">
                                    🎯
                                </div>

                                <div>
                                    <span>
                                        Expertise
                                    </span>

                                    <h2>
                                        Active
                                    </h2>

                                    <small>
                                        Share your knowledge
                                    </small>
                                </div>
                            </div>


                            <div className="mentor-stat-card">
                                <div className="mentor-stat-icon">
                                    ⭐
                                </div>

                                <div>
                                    <span>
                                        Profile Status
                                    </span>

                                    <h2>
                                        Ready
                                    </h2>

                                    <small>
                                        Available for connections
                                    </small>
                                </div>
                            </div>

                        </section>


                        {/* ===============================
                            DASHBOARD CONTENT
                        =============================== */}

                        <section className="mentor-content-grid">

                            {/* LEFT */}

                            <div className="mentor-main-column">

                                <div className="mentor-section-card">

                                    <div className="mentor-section-header">

                                        <div>
                                            <span className="mentor-section-label">
                                                YOUR IMPACT
                                            </span>

                                            <h2>
                                                Mentor with purpose
                                            </h2>
                                        </div>

                                        <span className="mentor-section-icon">
                                            ✦
                                        </span>

                                    </div>

                                    <p className="mentor-section-description">
                                        SICR brings startups, investors,
                                        mentors, and organizations together
                                        in one connected ecosystem. Your
                                        experience can help members make
                                        better decisions and build stronger
                                        futures.
                                    </p>


                                    <div className="mentor-focus-grid">

                                        <div className="mentor-focus-item">
                                            <span>01</span>

                                            <div>
                                                <strong>
                                                    Discover
                                                </strong>

                                                <p>
                                                    Explore startups and
                                                    professionals across SICR.
                                                </p>
                                            </div>
                                        </div>


                                        <div className="mentor-focus-item">
                                            <span>02</span>

                                            <div>
                                                <strong>
                                                    Connect
                                                </strong>

                                                <p>
                                                    Build meaningful
                                                    professional relationships.
                                                </p>
                                            </div>
                                        </div>


                                        <div className="mentor-focus-item">
                                            <span>03</span>

                                            <div>
                                                <strong>
                                                    Guide
                                                </strong>

                                                <p>
                                                    Share your expertise and
                                                    help others grow.
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                </div>


                                {/* QUICK ACTIONS */}

                                <div className="mentor-section-card mentor-actions-card">

                                    <div className="mentor-section-header">

                                        <div>
                                            <span className="mentor-section-label">
                                                QUICK ACTIONS
                                            </span>

                                            <h2>
                                                Continue your journey
                                            </h2>
                                        </div>

                                    </div>


                                    <div className="mentor-quick-actions">

                                        <button
                                            onClick={() =>
                                                navigate("/mentor/discover")
                                            }
                                        >
                                            <span>🔍</span>

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
                                                navigate("/connections")
                                            }
                                        >
                                            <span>🤝</span>

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
                                                navigate("/messenger")
                                            }
                                        >
                                            <span>💬</span>

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


                            {/* RIGHT SIDEBAR CONTENT */}

                            <aside className="mentor-right-column">

                                <div className="mentor-profile-card">

                                    <div className="mentor-profile-top">

                                        <div className="mentor-avatar">
                                            {mentorName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <h3>
                                                {mentorName}
                                            </h3>

                                            <p>
                                                Mentor
                                            </p>
                                        </div>

                                    </div>


                                    <div className="mentor-profile-info">

                                        <div>
                                            <span>
                                                AREA OF EXPERTISE
                                            </span>

                                            <strong>
                                                {expertise}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                ECOSYSTEM
                                            </span>

                                            <strong>
                                                SICR Mentor Network
                                            </strong>
                                        </div>

                                    </div>


                                    <button
                                        className="mentor-profile-button"
                                        onClick={() =>
                                            navigate("/mentor/profile")
                                        }
                                    >
                                        Manage Profile
                                    </button>

                                </div>


                                <div className="mentor-tip-card">

                                    <div className="mentor-tip-icon">
                                        💡
                                    </div>

                                    <span>
                                        SICR TIP
                                    </span>

                                    <h3>
                                        A strong network starts with a
                                        meaningful conversation.
                                    </h3>

                                    <p>
                                        Explore the ecosystem and connect
                                        with members where your experience
                                        can create real value.
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

export default MentorDashboard;