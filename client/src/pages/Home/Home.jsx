import PublicLayout from "../../layouts/PublicLayout";
import "./Home.css";

const ecosystems = [
    {
        title: "Startup",
        description: "Build, validate, launch and scale your startup.",
        icon: "🚀",
    },
    {
        title: "Investor & Funding",
        description: "Discover startups, funding opportunities and investments.",
        icon: "💰",
    },
    {
        title: "Mentor & Expertise",
        description: "Connect with experienced mentors and domain experts.",
        icon: "🧠",
    },
    {
        title: "Corporate & Industry",
        description: "Connect businesses with startups, talent and innovation.",
        icon: "🏢",
    },
    {
        title: "Partnership & Collaboration",
        description: "Create strategic partnerships and collaborative opportunities.",
        icon: "🤝",
    },
    {
        title: "Sponsorship",
        description: "Support innovation, programs, events and entrepreneurs.",
        icon: "🌐",
    },
];

function Home() {
    return (
        <PublicLayout>
            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        Global Startup & Career Ecosystem
                    </div>

                    <h1>
                        Build.
                        <span> Connect.</span>
                        <br />
                        Grow.
                    </h1>

                    <p>
                        SICR brings startups, entrepreneurs, investors, mentors,
                        corporates, partners and career opportunities into one
                        connected ecosystem.
                    </p>

                    <div className="hero-actions">
                        <a href="/register" className="hero-primary">
                            Join SICR
                        </a>

                        <a href="/ecosystem" className="hero-secondary">
                            Explore Ecosystem →
                        </a>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>01</strong>
                            <span>Connected Ecosystem</span>
                        </div>

                        <div>
                            <strong>06+</strong>
                            <span>Core Ecosystems</span>
                        </div>

                        <div>
                            <strong>∞</strong>
                            <span>Opportunities</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ECOSYSTEM */}
            <section className="ecosystem-section">
                <div className="section-heading">
                    <span>THE SICR ECOSYSTEM</span>

                    <h2>
                        Everything connected.
                        <br />
                        One ecosystem.
                    </h2>

                    <p>
                        SICR is designed to connect every major participant
                        involved in entrepreneurship, innovation, business and
                        career development.
                    </p>
                </div>

                <div className="ecosystem-grid">
                    {ecosystems.map((item) => (
                        <div className="ecosystem-card" key={item.title}>
                            <div className="ecosystem-icon">
                                {item.icon}
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.description}</p>

                            <a href="/ecosystem">
                                Explore →
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="process-section">
                <div className="section-heading">
                    <span>HOW SICR WORKS</span>

                    <h2>
                        From idea to opportunity.
                    </h2>

                    <p>
                        SICR creates a structured journey for people and
                        organizations at every stage.
                    </p>
                </div>

                <div className="process-grid">
                    <div className="process-card">
                        <span>01</span>
                        <h3>Discover</h3>
                        <p>
                            Find startups, investors, mentors, companies,
                            opportunities and resources.
                        </p>
                    </div>

                    <div className="process-card">
                        <span>02</span>
                        <h3>Connect</h3>
                        <p>
                            Build meaningful connections with the right people
                            and organizations.
                        </p>
                    </div>

                    <div className="process-card">
                        <span>03</span>
                        <h3>Collaborate</h3>
                        <p>
                            Work together through funding, mentorship,
                            partnerships and innovation.
                        </p>
                    </div>

                    <div className="process-card">
                        <span>04</span>
                        <h3>Grow</h3>
                        <p>
                            Track your journey, develop skills and unlock new
                            opportunities.
                        </p>
                    </div>
                </div>
            </section>

            {/* CAREER ROADMAP */}
            <section className="roadmap-section">
                <div className="roadmap-content">
                    <span>CAREER ROADMAP</span>

                    <h2>
                        Your career is a journey.
                        <br />
                        SICR helps you navigate it.
                    </h2>

                    <p>
                        Build your skills, identify opportunities, connect
                        with experts and follow a structured roadmap toward
                        your career goals.
                    </p>

                    <a href="/dashboard">
                        Explore Career Roadmap →
                    </a>
                </div>

                <div className="roadmap-visual">
                    <div className="roadmap-line"></div>

                    <div className="roadmap-node">
                        <span>01</span>
                        <strong>Discover</strong>
                    </div>

                    <div className="roadmap-node">
                        <span>02</span>
                        <strong>Learn</strong>
                    </div>

                    <div className="roadmap-node">
                        <span>03</span>
                        <strong>Build</strong>
                    </div>

                    <div className="roadmap-node">
                        <span>04</span>
                        <strong>Grow</strong>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div>
                    <span>JOIN THE ECOSYSTEM</span>

                    <h2>
                        Your next opportunity
                        <br />
                        starts here.
                    </h2>

                    <p>
                        Whether you're building a startup, investing,
                        mentoring, hiring, partnering or building your career,
                        SICR connects you with the ecosystem.
                    </p>

                    <a href="/register">
                        Get Started →
                    </a>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-logo">
                    <span>S</span>
                    SICR
                </div>

                <p>
                    Startup Incubator & Career Roadmap
                </p>

                <div className="footer-links">
                    <a href="/">Home</a>
                    <a href="/ecosystem">Ecosystem</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>

                <div className="footer-bottom">
                    © 2026 SICR. All rights reserved.
                </div>
            </footer>
        </PublicLayout>
    );
}

export default Home;