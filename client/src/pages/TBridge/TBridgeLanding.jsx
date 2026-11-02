import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeLanding.css";

const TBridgeLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="tb-landing">

            <nav className="tb-landing-nav">
                <div className="tb-brand">
                    <span>
                        T
                    </span>

                    <strong>
                        T-Bridge
                    </strong>
                </div>

                <div>
                    <button
                        onClick={() =>
                            navigate(
                                "/tbridge/login"
                            )
                        }
                    >
                        Login
                    </button>

                    <button
                        className="tb-nav-primary"
                        onClick={() =>
                            navigate(
                                "/tbridge/register"
                            )
                        }
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            <section className="tb-hero">

                <div className="tb-hero-content">

                    <span className="tb-badge">
                        SICR T-BRIDGE
                    </span>

                    <h1>
                        One Identity.
                        <br />
                        <span>
                            Multiple Ecosystems.
                        </span>
                    </h1>

                    <p>
                        Connect with multiple
                        SICR ecosystems
                        through one account.
                        No repeated
                        registrations.
                    </p>

                    <div className="tb-hero-actions">
                        <button
                            onClick={() =>
                                navigate(
                                    "/tbridge/register"
                                )
                            }
                        >
                            Create T-Bridge
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/tbridge/login"
                                )
                            }
                        >
                            I already have
                            an account
                        </button>
                    </div>

                </div>

                <div className="tb-hero-visual">

                    <div className="tb-orbit-main">
                        T
                    </div>

                    <div className="tb-orbit-card card-one">
                        🚀 Startup
                    </div>

                    <div className="tb-orbit-card card-two">
                        💰 Investor
                    </div>

                    <div className="tb-orbit-card card-three">
                        🧑‍🏫 Mentor
                    </div>

                    <div className="tb-orbit-card card-four">
                        🤝 Partner
                    </div>

                </div>

            </section>

            <section className="tb-features">

                <div>
                    <h3>
                        One Account
                    </h3>

                    <p>
                        Register once and
                        maintain one central
                        identity.
                    </p>
                </div>

                <div>
                    <h3>
                        Multiple Ecosystems
                    </h3>

                    <p>
                        Join as many SICR
                        ecosystems as
                        relevant to you.
                    </p>
                </div>

                <div>
                    <h3>
                        One Gateway
                    </h3>

                    <p>
                        Switch between your
                        ecosystems from
                        T-Bridge.
                    </p>
                </div>

            </section>

        </div>
    );
};

export default TBridgeLanding;