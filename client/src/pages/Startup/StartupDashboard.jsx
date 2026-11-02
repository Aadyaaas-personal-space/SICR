import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Footer from "../../components/footer/Footer";

import "./StartupDashboard.css";

function StartupDashboard() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("startupToken");

        if (!token) {
            navigate("/startup/login");
            return;
        }

        const fetchStartup = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/startup/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load startup");
                }

                const data = await response.json();

                setStartup(data);
            } catch (error) {
                console.error("Startup dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStartup();
    }, [API_URL, navigate]);

    const startupName =
        startup?.startupName ||
        startup?.name ||
        startup?.profile?.startupName ||
        "Startup Founder";

    if (loading) {
        return (
            <div className="startup-loading">
                <div className="startup-loading-spinner"></div>
                <p>Loading your startup workspace...</p>
            </div>
        );
    }

    return (
        <div className="startup-layout">

            <Sidebar />

            <main className="startup-main">

                {/* =====================================================
                    HERO / WELCOME
                ===================================================== */}

                <section className="startup-hero">

                    <div className="startup-hero-content">

                        <div className="startup-eyebrow">
                            <span className="startup-eyebrow-dot"></span>
                            Startup Workspace
                        </div>

                        <h1>
                            Welcome to{" "}
                            <span>SICR</span>
                        </h1>

                        <p className="startup-hero-subtitle">
                            Your space to build ideas, discover opportunities,
                            connect with the right people and move your startup
                            forward.
                        </p>

                        <div className="startup-hero-actions">

                            <button
                                className="startup-primary-btn"
                                onClick={() =>
                                    navigate("/search")
                                }
                            >
                                Explore Opportunities
                                <span>→</span>
                            </button>

                            <button
                                className="startup-secondary-btn"
                                onClick={() =>
                                    navigate("/startup/profile")
                                }
                            >
                                View Profile
                            </button>

                        </div>

                    </div>

                    <div className="startup-hero-visual">

                        <div className="hero-orbit hero-orbit-one"></div>
                        <div className="hero-orbit hero-orbit-two"></div>

                        <div className="hero-center-card">

                            <div className="hero-center-icon">
                                🚀
                            </div>

                            <strong>
                                Build. Connect. Grow.
                            </strong>

                            <span>
                                Your startup journey starts here.
                            </span>

                        </div>

                        <div className="floating-card floating-card-top">
                            <span>IDEA</span>
                            <strong>→ MVP</strong>
                        </div>

                        <div className="floating-card floating-card-bottom">
                            <span>NETWORK</span>
                            <strong>∞ Connections</strong>
                        </div>

                    </div>

                </section>


                {/* =====================================================
                    STARTUP SNAPSHOT
                ===================================================== */}

                <section className="startup-content-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-label">
                                YOUR WORKSPACE
                            </span>

                            <h2>
                                Everything your startup needs
                            </h2>
                        </div>

                        <p>
                            SICR brings the people, opportunities and
                            resources around your startup journey together.
                        </p>

                    </div>

                    <div className="startup-feature-grid">

                        <div className="startup-feature-card">

                            <div className="feature-icon">
                                💡
                            </div>

                            <div>
                                <h3>
                                    Shape your idea
                                </h3>

                                <p>
                                    Turn a problem into a meaningful
                                    startup opportunity through research,
                                    validation and planning.
                                </p>
                            </div>

                        </div>

                        <div className="startup-feature-card">

                            <div className="feature-icon">
                                🧩
                            </div>

                            <div>
                                <h3>
                                    Find the right people
                                </h3>

                                <p>
                                    Discover investors, mentors,
                                    corporates, partners and other
                                    ecosystem participants.
                                </p>
                            </div>

                        </div>

                        <div className="startup-feature-card">

                            <div className="feature-icon">
                                📈
                            </div>

                            <div>
                                <h3>
                                    Grow with purpose
                                </h3>

                                <p>
                                    Move from early validation to
                                    funding, launch and sustainable
                                    startup growth.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    SECTION 1 — STARTUP JOURNEY
                ===================================================== */}

                <section className="startup-journey-section">

                    <div className="dark-section-header">

                        <div>
                            <span className="section-label light">
                                THE STARTUP JOURNEY
                            </span>

                            <h2>
                                From an idea to a growing venture.
                            </h2>
                        </div>

                        <p>
                            Every successful startup starts with a problem
                            worth solving. Follow a structured journey to
                            turn your idea into something people value.
                        </p>

                    </div>

                    <div className="journey-line"></div>

                    <div className="journey-grid">

                        <div className="journey-step">
                            <span>01</span>
                            <div className="journey-number">💡</div>
                            <h3>Idea</h3>
                            <p>
                                Identify a real problem and
                                define the opportunity.
                            </p>
                        </div>

                        <div className="journey-step">
                            <span>02</span>
                            <div className="journey-number">🔎</div>
                            <h3>Validate</h3>
                            <p>
                                Understand your market,
                                users and competition.
                            </p>
                        </div>

                        <div className="journey-step">
                            <span>03</span>
                            <div className="journey-number">🛠️</div>
                            <h3>Build</h3>
                            <p>
                                Create an MVP and turn
                                your concept into reality.
                            </p>
                        </div>

                        <div className="journey-step">
                            <span>04</span>
                            <div className="journey-number">🚀</div>
                            <h3>Launch</h3>
                            <p>
                                Reach your first users and
                                learn from the market.
                            </p>
                        </div>

                        <div className="journey-step">
                            <span>05</span>
                            <div className="journey-number">📈</div>
                            <h3>Grow</h3>
                            <p>
                                Build your team, funding
                                and long-term growth.
                            </p>
                        </div>

                    </div>

                </section>


                {/* =====================================================
                    SECTION 2 — WHAT A STARTUP NEEDS
                ===================================================== */}

                <section className="startup-needs-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-label">
                                BUILD SMARTER
                            </span>

                            <h2>
                                What does a startup really need?
                            </h2>
                        </div>

                        <p>
                            Building a startup is more than having a great
                            idea. The right combination of people, resources
                            and execution makes the difference.
                        </p>

                    </div>

                    <div className="needs-grid">

                        <div className="need-card large">
                            <span className="need-number">01</span>
                            <div className="need-icon">🎯</div>
                            <h3>Clear Problem</h3>
                            <p>
                                Start with a problem that genuinely matters
                                to a specific group of people.
                            </p>
                        </div>

                        <div className="need-card">
                            <span className="need-number">02</span>
                            <div className="need-icon">👥</div>
                            <h3>Strong Team</h3>
                            <p>
                                Find people who complement your skills
                                and share your vision.
                            </p>
                        </div>

                        <div className="need-card">
                            <span className="need-number">03</span>
                            <div className="need-icon">💰</div>
                            <h3>Resources</h3>
                            <p>
                                Access capital, technology, knowledge
                                and useful opportunities.
                            </p>
                        </div>

                        <div className="need-card">
                            <span className="need-number">04</span>
                            <div className="need-icon">🤝</div>
                            <h3>Network</h3>
                            <p>
                                Build relationships with mentors,
                                investors and ecosystem partners.
                            </p>
                        </div>

                        <div className="need-card">
                            <span className="need-number">05</span>
                            <div className="need-icon">⚡</div>
                            <h3>Execution</h3>
                            <p>
                                Consistently transform plans into
                                measurable progress.
                            </p>
                        </div>

                    </div>

                </section>


                {/* =====================================================
                    SECTION 3 — ECOSYSTEM
                ===================================================== */}

                <section className="ecosystem-section">

                    <div className="ecosystem-copy">

                        <span className="section-label">
                            YOUR ECOSYSTEM
                        </span>

                        <h2>
                            You don't have to build alone.
                        </h2>

                        <p>
                            SICR connects startups with different
                            participants of the innovation ecosystem.
                            Discover the people who can help your
                            venture move forward.
                        </p>

                        <button
                            className="dark-action-btn"
                            onClick={() =>
                                navigate("/ecosystem")
                            }
                        >
                            Explore Ecosystems
                            <span>→</span>
                        </button>

                    </div>

                    <div className="ecosystem-cards">

                        <div className="ecosystem-mini-card">
                            <span>💰</span>
                            <strong>Investors</strong>
                            <small>Funding & capital</small>
                        </div>

                        <div className="ecosystem-mini-card">
                            <span>🧠</span>
                            <strong>Mentors</strong>
                            <small>Knowledge & guidance</small>
                        </div>

                        <div className="ecosystem-mini-card">
                            <span>🏢</span>
                            <strong>Corporates</strong>
                            <small>Industry opportunities</small>
                        </div>

                        <div className="ecosystem-mini-card">
                            <span>🤝</span>
                            <strong>Partners</strong>
                            <small>Collaboration</small>
                        </div>

                        <div className="ecosystem-mini-card">
                            <span>🎯</span>
                            <strong>Sponsors</strong>
                            <small>Support & resources</small>
                        </div>

                        <div className="ecosystem-mini-card">
                            <span>🌉</span>
                            <strong>T-Bridge</strong>
                            <small>Career connections</small>
                        </div>

                    </div>

                </section>


                {/* =====================================================
                    SECTION 4 — FUNDING
                ===================================================== */}

                <section className="funding-section">

                    <div className="funding-visual">

                        <div className="funding-circle funding-circle-one">
                            <span>₹</span>
                        </div>

                        <div className="funding-circle funding-circle-two">
                            <span>+</span>
                        </div>

                        <div className="funding-center">
                            <strong>FUNDING</strong>
                            <span>Readiness</span>
                        </div>

                    </div>

                    <div className="funding-copy">

                        <span className="section-label">
                            FUNDING & INVESTMENT
                        </span>

                        <h2>
                            Turn a promising idea into an investment-ready startup.
                        </h2>

                        <p>
                            Understand what investors look for, prepare your
                            startup story and discover funding opportunities
                            that match your needs.
                        </p>

                        <div className="funding-points">

                            <div>
                                <span>✓</span>
                                <p>Prepare your startup pitch</p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>Understand investor expectations</p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>Discover relevant investors</p>
                            </div>

                        </div>

                        <button
                            className="startup-outline-btn"
                            onClick={() =>
                                navigate("/search")
                            }
                        >
                            Discover Investors
                            <span>→</span>
                        </button>

                    </div>

                </section>


                {/* =====================================================
                    SECTION 5 — DISCOVER & CONNECT
                ===================================================== */}

                <section className="connect-section">

                    <div className="connect-header">

                        <span className="section-label">
                            DISCOVER & CONNECT
                        </span>

                        <h2>
                            The right connection can change your startup.
                        </h2>

                        <p>
                            Discover people and organizations that align
                            with your startup's goals, requirements and
                            opportunities.
                        </p>

                    </div>

                    <div className="connect-grid">

                        <div className="connect-card">

                            <div className="connect-card-top">
                                <span className="connect-icon">🔍</span>
                                <span className="connect-arrow">↗</span>
                            </div>

                            <h3>
                                Discover
                            </h3>

                            <p>
                                Find relevant people and opportunities
                                across the SICR ecosystem.
                            </p>

                        </div>

                        <div className="connect-card">

                            <div className="connect-card-top">
                                <span className="connect-icon">🤝</span>
                                <span className="connect-arrow">↗</span>
                            </div>

                            <h3>
                                Connect
                            </h3>

                            <p>
                                Send connection requests and build
                                meaningful professional relationships.
                            </p>

                        </div>

                        <div className="connect-card">

                            <div className="connect-card-top">
                                <span className="connect-icon">💬</span>
                                <span className="connect-arrow">↗</span>
                            </div>

                            <h3>
                                Collaborate
                            </h3>

                            <p>
                                Communicate with your network and
                                turn connections into opportunities.
                            </p>

                        </div>

                    </div>

                    <button
                        className="startup-primary-btn centered-btn"
                        onClick={() =>
                            navigate("/search")
                        }
                    >
                        Start Discovering
                        <span>→</span>
                    </button>

                </section>


                {/* =====================================================
                    SECTION 6 — FINAL CTA
                ===================================================== */}

                <section className="startup-final-cta">

                    <div className="final-cta-content">

                        <span className="section-label light">
                            YOUR NEXT STEP
                        </span>

                        <h2>
                            Your startup journey is waiting.
                        </h2>

                        <p>
                            Explore the ecosystem, meet the right people,
                            discover opportunities and keep building.
                        </p>

                        <div className="final-cta-actions">

                            <button
                                className="white-action-btn"
                                onClick={() =>
                                    navigate("/search")
                                }
                            >
                                Explore SICR
                                <span>→</span>
                            </button>

                            <button
                                className="transparent-action-btn"
                                onClick={() =>
                                    navigate("/startup/profile")
                                }
                            >
                                Complete Profile
                            </button>

                        </div>

                    </div>

                    <div className="final-cta-decoration">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                </section>


                <Footer />

            </main>

        </div>
    );
}

export default StartupDashboard;