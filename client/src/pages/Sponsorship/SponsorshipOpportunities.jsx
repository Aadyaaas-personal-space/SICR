import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Sponsorship/SponsorshipOpportunities.css";

function SponsorshipOpportunities() {
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

    const [requests, setRequests] =
        useState([]);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        if (!token) {
            navigate(
                "/sponsorship/login"
            );
            return;
        }

        loadRequests();
    }, []);

    const loadRequests =
        async () => {
            try {
                const response =
                    await fetch(
                        `${API_URL}/api/sponsorship/requests`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                setRequests(
                    data.requests || []
                );
            } catch (error) {
                setMessage(
                    "Failed to load opportunities."
                );
            }
        };

    const apply =
        async (requestId) => {
            const amount =
                window.prompt(
                    "Enter your proposed sponsorship amount:"
                );

            if (!amount) return;

            try {
                const response =
                    await fetch(
                        `${API_URL}/api/sponsorship/applications`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                                Authorization:
                                    `Bearer ${token}`,
                            },
                            body: JSON.stringify(
                                {
                                    requestId,
                                    proposedAmount:
                                        Number(
                                            amount
                                        ),
                                    message:
                                        "I am interested in sponsoring this opportunity.",
                                }
                            ),
                        }
                    );

                const data =
                    await response.json();

                setMessage(
                    data.message
                );
            } catch (error) {
                setMessage(
                    "Application failed."
                );
            }
        };

    return (
        <div className="opportunity-page">

            <header className="opportunity-navbar">
                <div>
                    <strong>
                        SICR
                    </strong>

                    <span>
                        Sponsorship
                    </span>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/sponsorship/dashboard"
                        )
                    }
                >
                    Dashboard
                </button>
            </header>

            <main className="opportunity-main">

                <div className="opportunity-heading">
                    <div>
                        <span>
                            DISCOVER
                        </span>

                        <h1>
                            Sponsorship
                            Opportunities
                        </h1>

                        <p>
                            Find projects,
                            events and
                            organizations
                            looking for
                            meaningful
                            sponsorship.
                        </p>
                    </div>

                    {accountType ===
                        "seeker" && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/sponsorship/create-request"
                                    )
                                }
                            >
                                + Create Request
                            </button>
                        )}
                </div>

                {message && (
                    <div className="opportunity-message">
                        {message}
                    </div>
                )}

                <div className="opportunity-grid">

                    {requests.map(
                        (request) => (
                            <article
                                className="opportunity-card"
                                key={
                                    request._id
                                }
                            >
                                <div className="opportunity-status">
                                    OPEN
                                </div>

                                <h2>
                                    {
                                        request.title
                                    }
                                </h2>

                                <p>
                                    {
                                        request.description
                                    }
                                </p>

                                <div className="opportunity-meta">
                                    <span>
                                        {
                                            request.category
                                        }
                                    </span>

                                    <span>
                                        {
                                            request.location ||
                                            "Remote"
                                        }
                                    </span>
                                </div>

                                <div className="amount">
                                    ₹
                                    {Number(
                                        request.requiredAmount
                                    ).toLocaleString()}
                                </div>

                                {request
                                    .seekerId && (
                                        <small>
                                            Posted by{" "}
                                            {
                                                request
                                                    .seekerId
                                                    .organizationName
                                            }
                                        </small>
                                    )}

                                {accountType ===
                                    "sponsor" && (
                                        <button
                                            onClick={() =>
                                                apply(
                                                    request._id
                                                )
                                            }
                                        >
                                            Apply for
                                            Sponsorship
                                        </button>
                                    )}
                            </article>
                        )
                    )}

                    {!requests.length && (
                        <div className="empty-state">
                            <h2>
                                No opportunities
                                yet
                            </h2>

                            <p>
                                New sponsorship
                                opportunities
                                will appear
                                here.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SponsorshipOpportunities;