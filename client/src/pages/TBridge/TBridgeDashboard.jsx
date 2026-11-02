import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TBridgeNavbar from "../../components/TBridge/TBridgeNavbar";
import TBridgeEcosystemCard from "../../components/TBridge/TBridgeEcosystemCard";
import TBridgeStats from "../../components/TBridge/TBridgeStats";
import "../../styles/TBridge/TBridgeDashboard.css";

const TBridgeDashboard = () => {
    const navigate = useNavigate();

    const token =
        localStorage.getItem(
            "tBridgeToken"
        );

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/tbridge/login");
            return;
        }

        fetch(
            "http://localhost:5000/api/tbridge/dashboard",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )
            .then((response) =>
                response.json()
            )
            .then((data) => {
                if (!data.success) {
                    throw new Error(
                        data.message
                    );
                }

                setDashboard(data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem(
                    "tBridgeToken"
                );

                navigate(
                    "/tbridge/login"
                );
            });
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="tb-loading">
                Loading T-Bridge...
            </div>
        );
    }

    const user =
        dashboard.account;

    return (
        <div className="tb-dashboard">

            <TBridgeNavbar />

            <main className="tb-dashboard-main">

                <section className="tb-dashboard-hero">

                    <div>
                        <p>
                            T-BRIDGE
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {user.firstName}
                            👋
                        </h1>

                        <span>
                            One identity.
                            Multiple
                            possibilities.
                        </span>
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/tbridge/join"
                            )
                        }
                    >
                        + Join Ecosystem
                    </button>

                </section>

                <TBridgeStats
                    statistics={
                        dashboard.statistics
                    }
                />

                <section className="tb-section">

                    <div className="tb-section-header">
                        <div>
                            <h2>
                                My Ecosystems
                            </h2>

                            <p>
                                Ecosystems
                                connected to
                                your T-Bridge
                                identity.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/tbridge/ecosystems"
                                )
                            }
                        >
                            Manage
                        </button>
                    </div>

                    <div className="tb-dashboard-grid">

                        {dashboard.ecosystems
                            .length > 0 ? (
                            dashboard.ecosystems.map(
                                (ecosystem) => (
                                    <TBridgeEcosystemCard
                                        key={
                                            ecosystem._id
                                        }
                                        ecosystem={
                                            ecosystem
                                        }
                                    />
                                )
                            )
                        ) : (
                            <div className="tb-empty">
                                <h3>
                                    No ecosystems
                                    joined yet
                                </h3>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/tbridge/join"
                                        )
                                    }
                                >
                                    Explore
                                    Ecosystems
                                </button>
                            </div>
                        )}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default TBridgeDashboard;