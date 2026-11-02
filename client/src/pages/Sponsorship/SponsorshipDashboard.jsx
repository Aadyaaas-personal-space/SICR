import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipDashboard.css";

function SponsorshipDashboard() {
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const token =
        localStorage.getItem(
            "sponsorshipToken"
        );

    const accountType =
        localStorage.getItem(
            "sponsorshipAccountType"
        );

    const [data, setData] =
        useState(null);

    useEffect(() => {
        if (!token) {
            navigate(
                "/sponsorship/login"
            );
            return;
        }

        fetch(
            `${API_URL}/api/sponsorship/dashboard`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        )
            .then((response) =>
                response.json()
            )
            .then((result) =>
                setData(result)
            );
    }, []);

    const logout = () => {
        localStorage.removeItem(
            "sponsorshipToken"
        );

        localStorage.removeItem(
            "sponsorshipAccountType"
        );

        navigate(
            "/sponsorship/login"
        );
    };

    if (!data) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    const stats =
        accountType === "sponsor"
            ? [
                {
                    label:
                        "Opportunities",
                    value:
                        data.stats
                            ?.availableOpportunities ||
                        0,
                },
                {
                    label:
                        "Applications Sent",
                    value:
                        data.stats
                            ?.applicationsSent ||
                        0,
                },
                {
                    label:
                        "Shortlisted",
                    value:
                        data.stats
                            ?.shortlisted ||
                        0,
                },
                {
                    label:
                        "Active Sponsorships",
                    value:
                        data.stats
                            ?.activeSponsorships ||
                        0,
                },
                {
                    label:
                        "Total Proposed",
                    value:
                        `₹${(
                            data.stats
                                ?.totalProposed ||
                            0
                        ).toLocaleString()}`,
                },
            ]
            : [
                {
                    label:
                        "Active Requests",
                    value:
                        data.stats
                            ?.activeRequests ||
                        0,
                },
                {
                    label:
                        "Applications",
                    value:
                        data.stats
                            ?.applicationsReceived ||
                        0,
                },
                {
                    label:
                        "Shortlisted",
                    value:
                        data.stats
                            ?.shortlisted ||
                        0,
                },
                {
                    label:
                        "Active Sponsorships",
                    value:
                        data.stats
                            ?.activeSponsorships ||
                        0,
                },
            ];

    return (
        <div className="sponsor-dashboard">

            <header className="dashboard-navbar">
                <div className="brand">
                    <strong>
                        SICR
                    </strong>

                    <span>
                        Sponsorship
                    </span>
                </div>

                <nav>
                    <button
                        onClick={() =>
                            navigate(
                                "/sponsorship/profile"
                            )
                        }
                    >
                        Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/sponsorship/opportunities"
                            )
                        }
                    >
                        Opportunities
                    </button>

                    <button
                        onClick={
                            logout
                        }
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="dashboard-main">

                <section className="dashboard-hero">
                    <div>
                        <span>
                            SPONSORSHIP
                            ECOSYSTEM
                        </span>

                        <h1>
                            Welcome,
                            {" "}
                            {
                                data.account
                                    .firstName
                            }
                            👋
                        </h1>

                        <p>
                            {accountType ===
                                "sponsor"
                                ? "Discover meaningful projects and opportunities to sponsor."
                                : "Find the right sponsor and turn your opportunity into reality."}
                        </p>
                    </div>

                    <div className="profile-progress">
                        <strong>
                            {
                                data.profile
                                    ?.profileCompletion ||
                                0
                            }%
                        </strong>

                        <span>
                            Profile
                        </span>
                    </div>
                </section>

                <section className="stat-grid">
                    {stats.map(
                        (stat) => (
                            <div
                                className="stat-card"
                                key={
                                    stat.label
                                }
                            >
                                <span>
                                    {
                                        stat.label
                                    }
                                </span>

                                <strong>
                                    {
                                        stat.value
                                    }
                                </strong>
                            </div>
                        )
                    )}
                </section>

                <section className="dashboard-actions">

                    {accountType ===
                        "seeker" && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/sponsorship/create-request"
                                    )
                                }
                            >
                                <span>
                                    +
                                </span>

                                Create
                                Sponsorship
                                Request
                            </button>
                        )}

                    <button
                        onClick={() =>
                            navigate(
                                "/sponsorship/opportunities"
                            )
                        }
                    >
                        Explore
                        Opportunities →
                    </button>

                </section>
            </main>
        </div>
    );
}

export default SponsorshipDashboard;