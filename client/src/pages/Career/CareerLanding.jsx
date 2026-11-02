
import { useNavigate } from "react-router-dom";
import "./CareerLanding.css";

function CareerLanding() {
    const navigate = useNavigate();

    const features = [
        {
            number: "01",
            icon: "◎",
            title: "Discover Your Interests",
            description:
                "Understand your interests, strengths, hobbies and academic preferences through guided assessments.",
        },
        {
            number: "02",
            icon: "✦",
            title: "AI Career Recommendations",
            description:
                "Explore career options based on your education, interests, abilities and personal goals.",
        },
        {
            number: "03",
            icon: "⌘",
            title: "Personalized Career Roadmaps",
            description:
                "Get structured learning paths with milestones, skills and actionable steps towards your goals.",
        },
        {
            number: "04",
            icon: "▤",
            title: "Learning & Skill Development",
            description:
                "Discover relevant courses, develop practical skills and monitor your learning progress.",
        },
        {
            number: "05",
            icon: "◷",
            title: "Academic Performance",
            description:
                "Maintain academic records, track attendance, attempt quizzes and understand your progress.",
        },
        {
            number: "06",
            icon: "▥",
            title: "Performance Analytics",
            description:
                "Visualize your achievements, identify improvement areas and generate progress reports.",
        },
    ];

    const educationLevels = [
        "Class 10",
        "Class 12",
        "Diploma",
        "Undergraduate",
        "Postgraduate",
    ];

    return (
        <main className="career-landing">

            {/* NAVBAR */}

            <nav className="career-landing-nav">
                <div
                    className="career-landing-brand"
                    onClick={() => navigate("/career")}
                >
                    <span className="career-brand-mark">S</span>
                    <span>SICR</span>
                    <small>CAREER INTELLIGENCE</small>
                </div>

                <div className="career-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How it works</a>
                    <a href="#education">Students</a>
                </div>

                <div className="career-nav-actions">
                    <button
                        className="career-nav-signin"
                        onClick={() => navigate("/student/login")}
                    >
                        Sign In
                    </button>

                    <button
                        className="career-nav-signup"
                        onClick={() => navigate("/student/register")}
                    >
                        Get Started <span>→</span>
                    </button>
                </div>
            </nav>

            {/* HERO */}

            <section className="career-landing-hero">

                <div className="career-hero-content">

                    <div className="career-hero-label">
                        <span></span>
                        YOUR FUTURE, YOUR DIRECTION
                    </div>

                    <h1>
                        Your career journey
                        <br />
                        deserves a <span>clear direction.</span>
                    </h1>

                    <p>
                        Not sure what to become? That's okay.
                        Discover your interests, explore career possibilities
                        and build a personalized roadmap to achieve your goals.
                    </p>

                    <div className="career-hero-actions">
                        <button
                            className="career-hero-primary"
                            onClick={() => navigate("/student/register")}
                        >
                            Create Free Student Account
                            <span>→</span>
                        </button>

                        <button
                            className="career-hero-secondary"
                            onClick={() => navigate("/student/login")}
                        >
                            Student Sign In
                        </button>
                    </div>

                    <div className="career-hero-trust">
                        <span>✓</span>
                        Personalized guidance
                        <span className="career-trust-divider">·</span>
                        <span>✓</span>
                        Student-focused platform
                    </div>

                </div>

                {/* RIGHT VISUAL */}

                <div className="career-hero-visual">

                    <div className="career-visual-glow"></div>

                    <div className="career-preview-card">

                        <div className="career-preview-top">
                            <div>
                                <span className="career-preview-label">
                                    CAREER INTELLIGENCE
                                </span>
                                <h3>Your future starts here</h3>
                            </div>

                            <span className="career-preview-status">
                                <i></i> Personal journey
                            </span>
                        </div>

                        <div className="career-preview-profile">
                            <div className="career-preview-avatar">S</div>
                            <div>
                                <strong>Student Profile</strong>
                                <span>Discover your potential</span>
                            </div>
                        </div>

                        <div className="career-preview-divider"></div>

                        <span className="career-preview-section-title">
                            YOUR CAREER JOURNEY
                        </span>

                        <div className="career-preview-step">
                            <div className="career-step-icon purple">01</div>
                            <div>
                                <strong>Discover yourself</strong>
                                <span>Interests and strengths</span>
                            </div>
                            <span className="career-step-arrow">↗</span>
                        </div>

                        <div className="career-preview-step">
                            <div className="career-step-icon blue">02</div>
                            <div>
                                <strong>Explore careers</strong>
                                <span>Find your possibilities</span>
                            </div>
                            <span className="career-step-arrow">↗</span>
                        </div>

                        <div className="career-preview-step">
                            <div className="career-step-icon green">03</div>
                            <div>
                                <strong>Build your roadmap</strong>
                                <span>Skills and learning goals</span>
                            </div>
                            <span className="career-step-arrow">↗</span>
                        </div>

                        <div className="career-preview-step">
                            <div className="career-step-icon orange">04</div>
                            <div>
                                <strong>Track your progress</strong>
                                <span>Performance and growth</span>
                            </div>
                            <span className="career-step-arrow">↗</span>
                        </div>

                        <div className="career-preview-bottom">
                            <span>One journey.</span>
                            <strong>Unlimited possibilities.</strong>
                        </div>

                    </div>

                    <div className="career-floating-tag career-floating-one">
                        <span>✦</span>
                        AI-powered guidance
                    </div>

                    <div className="career-floating-tag career-floating-two">
                        <span>✓</span>
                        Built around you
                    </div>

                </div>

            </section>

            {/* EDUCATION LEVELS */}

            <section className="career-education-section" id="education">
                <div>
                    <span className="career-section-eyebrow">
                        FOR EVERY LEARNING STAGE
                    </span>

                    <h2>
                        Wherever you are in your education.
                    </h2>

                    <p>
                        Start exploring your future at any stage of your
                        academic journey.
                    </p>
                </div>

                <div className="career-education-list">
                    {educationLevels.map((level, index) => (
                        <div className="career-education-item" key={level}>
                            <span>0{index + 1}</span>
                            <strong>{level}</strong>
                            <span className="career-education-arrow">↗</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}

            <section className="career-features-section" id="features">

                <div className="career-section-heading">
                    <span className="career-section-eyebrow">
                        ONE PLATFORM, COMPLETE GUIDANCE
                    </span>

                    <h2>
                        Everything you need to
                        <br />
                        move forward.
                    </h2>

                    <p>
                        From discovering your interests to tracking your
                        academic performance, manage your career development
                        in one place.
                    </p>
                </div>

                <div className="career-features-grid">
                    {features.map((feature) => (
                        <article
                            className="career-feature-card"
                            key={feature.number}
                        >
                            <div className="career-feature-top">
                                <div className="career-feature-icon">
                                    {feature.icon}
                                </div>

                                <span>{feature.number}</span>
                            </div>

                            <h3>{feature.title}</h3>

                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>

            </section>

            {/* HOW IT WORKS */}

            <section className="career-how-section" id="how-it-works">

                <div className="career-how-heading">
                    <span className="career-section-eyebrow">
                        SIMPLE. STRUCTURED. PERSONALIZED.
                    </span>

                    <h2>
                        Your journey begins
                        <br />
                        with four simple steps.
                    </h2>
                </div>

                <div className="career-how-grid">

                    <div className="career-how-step">
                        <span>01</span>
                        <h3>Create your account</h3>
                        <p>
                            Join SICR and set up your student profile.
                        </p>
                    </div>

                    <div className="career-how-step">
                        <span>02</span>
                        <h3>Discover yourself</h3>
                        <p>
                            Share your interests, strengths and academic details.
                        </p>
                    </div>

                    <div className="career-how-step">
                        <span>03</span>
                        <h3>Explore your future</h3>
                        <p>
                            Discover suitable careers and personalized roadmaps.
                        </p>
                    </div>

                    <div className="career-how-step">
                        <span>04</span>
                        <h3>Learn and grow</h3>
                        <p>
                            Develop skills and track your academic progress.
                        </p>
                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="career-final-cta">
                <span>YOUR FUTURE DOESN'T HAVE TO BE A GUESS.</span>

                <h2>
                    Start discovering
                    <br />
                    what you can become.
                </h2>

                <p>
                    Take the first step towards a more informed
                    and confident career journey.
                </p>

                <button
                    onClick={() => navigate("/student/register")}
                >
                    Get Started with SICR <span>→</span>
                </button>
            </section>

            {/* FOOTER */}

            <footer className="career-landing-footer">
                <div className="career-footer-brand">
                    <span className="career-brand-mark">S</span>
                    <strong>SICR</strong>
                    <span>Career Intelligence</span>
                </div>

                <p>
                    Helping students discover their potential
                    and build their future.
                </p>

                <span className="career-footer-copy">
                    © {new Date().getFullYear()} SICR. All rights reserved.
                </span>
            </footer>

        </main>
    );
}

export default CareerLanding;
