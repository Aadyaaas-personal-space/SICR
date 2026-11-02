import { Link } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import "./Ecosystem.css";

const ecosystems = [
    {
        id: "startup",
        number: "01",
        icon: "🚀",
        title: "Startup",
        subtitle: "Build • Validate • Launch • Scale",
        description:
            "A complete environment for entrepreneurs and startups to develop ideas, validate products, build teams, find resources and scale their businesses.",
        roles: [
            "Founder",
            "Co-Founder",
            "Entrepreneur",
            "Startup Team",
            "Startup Organization",
        ],
        path: "/startup",
    },

    {
        id: "investor",
        number: "02",
        icon: "💰",
        title: "Investor & Funding",
        subtitle: "Capital • Investment • Growth",
        description:
            "Connect startups with investors, funding opportunities, investment networks and financial resources required to grow innovative businesses.",
        roles: [
            "Angel Investor",
            "Venture Capital",
            "Institutional Investor",
            "Fund Manager",
            "Funding Organization",
        ],
        path: "/investor",
    },

    {
        id: "mentor",
        number: "03",
        icon: "🧠",
        title: "Mentor & Expertise",
        subtitle: "Knowledge • Guidance • Expertise",
        description:
            "A professional network where entrepreneurs and individuals can connect with experienced mentors, advisors, consultants and domain experts.",
        roles: [
            "Mentor",
            "Industry Expert",
            "Advisor",
            "Consultant",
            "Subject Matter Expert",
        ],
        path: "/mentor/register",
    },

    {
        id: "corporate",
        number: "04",
        icon: "🏢",
        title: "Corporate & Industry",
        subtitle: "Business • Innovation • Industry",
        description:
            "Connect startups, professionals and innovators with corporations and industries for partnerships, employment, innovation and business opportunities.",
        roles: [
            "Corporate",
            "Industry",
            "Enterprise",
            "Hiring Organization",
            "Innovation Team",
        ],
        path: "/corporate/register",
    },

    {
        id: "partnership",
        number: "05",
        icon: "🤝",
        title: "Partnership & Collaboration",
        subtitle: "Connect • Collaborate • Create",
        description:
            "Build strategic relationships between startups, organizations, educational institutions, technology companies and ecosystem partners.",
        roles: [
            "Strategic Partner",
            "Technology Partner",
            "Academic Partner",
            "Business Partner",
            "Community Partner",
        ],
        path: "/partnership/register",
    },

    {
        id: "sponsorship",
        number: "06",
        icon: "🌐",
        title: "Sponsorship",
        subtitle: "Support • Enable • Accelerate",
        description:
            "Enable organizations and individuals to support startups, entrepreneurship programs, events, innovation initiatives and ecosystem development.",
        roles: [
            "Corporate Sponsor",
            "Event Sponsor",
            "Program Sponsor",
            "Institutional Sponsor",
            "Individual Sponsor",
        ],
        path: "/sponsorship/register",
    },

    {
        id: "tbridge",
        number: "07",
        icon: "🌉",
        title: "T-Bridge",
        subtitle: "Technology • Talent • Opportunity",
        description:
            "A bridge connecting technology, talent, startups, institutions, industry and opportunities across the SICR ecosystem.",
        roles: [
            "Technology Provider",
            "Talent",
            "Developer",
            "Technology Organization",
            "Opportunity Provider",
        ],
        path: "/tbridge/register",
    },

    {
        id: "career",
        number: "08",
        icon: "🎯",
        title: "Career & Entrepreneurship",
        subtitle: "Learn • Build • Achieve",
        description:
            "A structured career and entrepreneurship journey that helps individuals discover skills, build capabilities, find opportunities and create their own path.",
        roles: [
            "Student",
            "Professional",
            "Job Seeker",
            "Career Builder",
            "Future Entrepreneur",
        ],
        path: "/career",
    },
];

function Ecosystem() {
    return (
        <PublicLayout>
            <div className="ecosystem-page">

                {/* HERO */}
                <section className="ecosystem-hero">

                    <Link to="/" className="back-home">
                        ← Back to SICR
                    </Link>

                    <div className="ecosystem-hero-content">

                        <span className="eyebrow">
                            THE SICR ECOSYSTEM
                        </span>

                        <h1>
                            One ecosystem.
                            <br />
                            <span>Every opportunity.</span>
                        </h1>

                        <p>
                            SICR connects the complete entrepreneurship,
                            innovation, business and career ecosystem into
                            one collaborative platform.
                        </p>

                    </div>

                    {/* STATS */}
                    <div className="ecosystem-stats">

                        <div className="ecosystem-stat">
                            <strong>08+</strong>
                            <span>Core Domains</span>
                        </div>

                        <div className="ecosystem-stat">
                            <strong>40+</strong>
                            <span>Participant Roles</span>
                        </div>

                        <div className="ecosystem-stat">
                            <strong>∞</strong>
                            <span>Connections</span>
                        </div>

                        <div className="ecosystem-stat">
                            <strong>01</strong>
                            <span>Unified Platform</span>
                        </div>

                    </div>

                </section>

                {/* INTRODUCTION */}
                <section className="ecosystem-intro">

                    <div className="intro-label">
                        HOW SICR IS STRUCTURED
                    </div>

                    <div className="intro-content">

                        <h2>
                            Different participants.
                            <br />
                            One connected ecosystem.
                        </h2>

                        <p>
                            SICR is not limited to a single type of user.
                            Startups need funding, investors need opportunities,
                            entrepreneurs need mentorship, companies need talent
                            and organizations need strategic partners.
                        </p>

                        <p>
                            SICR brings these participants together through
                            specialized ecosystem domains while allowing them
                            to interact and collaborate across the platform.
                        </p>

                    </div>

                </section>

                {/* ECOSYSTEM CARDS */}
                <section className="ecosystem-domains">

                    <div className="domains-heading">

                        <span className="eyebrow">
                            ECOSYSTEM DOMAINS
                        </span>

                        <h2>
                            Explore the SICR ecosystem
                        </h2>

                        <p>
                            Choose an ecosystem to discover its participants,
                            opportunities, services and collaboration possibilities.
                        </p>

                    </div>

                    <div className="domain-grid">

                        {ecosystems.map((ecosystem) => (

                            <article
                                className="domain-card"
                                key={ecosystem.id}
                            >

                                <div className="domain-top">

                                    <span className="domain-number">
                                        {ecosystem.number}
                                    </span>

                                    <span className="domain-icon">
                                        {ecosystem.icon}
                                    </span>

                                </div>

                                <h3>
                                    {ecosystem.title}
                                </h3>

                                <div className="domain-subtitle">
                                    {ecosystem.subtitle}
                                </div>

                                <p>
                                    {ecosystem.description}
                                </p>

                                {/* ROLES */}
                                <div className="role-section">

                                    <span className="role-title">
                                        PARTICIPANT ROLES
                                    </span>

                                    <div className="role-list">

                                        {ecosystem.roles.map((role) => (
                                            <span
                                                className="role-tag"
                                                key={role}
                                            >
                                                {role}
                                            </span>
                                        ))}

                                    </div>

                                </div>

                                <Link
                                    to={ecosystem.path}
                                    className="domain-explore"
                                >
                                    Explore Ecosystem
                                    <span>→</span>
                                </Link>

                            </article>

                        ))}

                    </div>

                </section>

                {/* CROSS ECOSYSTEM */}
                <section className="cross-ecosystem">

                    <div className="cross-content">

                        <span className="eyebrow">
                            CROSS-ECOSYSTEM CONNECTIONS
                        </span>

                        <h2>
                            The real power is
                            <br />
                            in the connections.
                        </h2>

                        <p>
                            SICR ecosystems are not isolated. A startup can
                            connect with an investor, find a mentor, collaborate
                            with a corporate, receive sponsorship and access
                            technology through T-Bridge.
                        </p>

                        <Link to="/register" className="cross-button">
                            Join the Ecosystem →
                        </Link>

                    </div>

                    <div className="connection-map">

                        <div className="connection-node main-node">
                            SICR
                        </div>

                        <div className="connection-line line-one"></div>
                        <div className="connection-line line-two"></div>
                        <div className="connection-line line-three"></div>
                        <div className="connection-line line-four"></div>

                        <div className="connection-node node-one">
                            Startup
                        </div>

                        <div className="connection-node node-two">
                            Investor
                        </div>

                        <div className="connection-node node-three">
                            Mentor
                        </div>

                        <div className="connection-node node-four">
                            Corporate
                        </div>

                    </div>

                </section>

                {/* CTA */}
                <section className="ecosystem-cta">

                    <span className="eyebrow">
                        YOUR PLACE IN SICR
                    </span>

                    <h2>
                        Find your role.
                        <br />
                        Start your journey.
                    </h2>

                    <p>
                        Join SICR and become part of a connected global
                        ecosystem of entrepreneurs, organizations,
                        professionals and innovators.
                    </p>

                    <div className="cta-actions">

                        <Link to="/register" className="cta-primary">
                            Create Account
                        </Link>

                        <Link to="/login" className="cta-secondary">
                            Already a member? Login
                        </Link>

                    </div>

                </section>

            </div>
        </PublicLayout>
    );
}

export default Ecosystem;