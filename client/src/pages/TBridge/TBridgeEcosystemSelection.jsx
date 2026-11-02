import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeEcosystem.css";

const TBridgeEcosystemSelection = () => {
    const navigate = useNavigate();

    const token =
        localStorage.getItem(
            "tBridgeToken"
        );

    const [ecosystems, setEcosystems] =
        useState([]);

    const [selected, setSelected] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!token) {
            navigate("/tbridge/login");
            return;
        }

        fetch(
            "http://localhost:5000/api/tbridge/ecosystems",
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

                setEcosystems(
                    data.ecosystems
                );

                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [token, navigate]);

    const toggleSelection = (key) => {
        setSelected((current) =>
            current.includes(key)
                ? current.filter(
                    (item) =>
                        item !== key
                )
                : [...current, key]
        );
    };

    const continueSelection = () => {
        if (selected.length === 0) {
            setError(
                "Select at least one ecosystem"
            );
            return;
        }

        localStorage.setItem(
            "tBridgeSelectedEcosystems",
            JSON.stringify(selected)
        );

        navigate(
            "/tbridge/ecosystem-questions"
        );
    };

    if (loading) {
        return (
            <div className="tb-loading">
                Loading ecosystems...
            </div>
        );
    }

    return (
        <div className="tb-ecosystem-page">

            <div className="tb-ecosystem-header">
                <span className="tb-logo">
                    T
                </span>

                <h1>
                    Choose Your Ecosystems
                </h1>

                <p>
                    You can join multiple
                    ecosystems with one
                    T-Bridge account.
                </p>
            </div>

            {error && (
                <div className="tb-error">
                    {error}
                </div>
            )}

            <div className="tb-ecosystem-grid">

                {ecosystems.map(
                    (ecosystem) => (
                        <div
                            key={
                                ecosystem.key
                            }
                            className={`tb-ecosystem-card ${selected.includes(
                                ecosystem.key
                            )
                                    ? "selected"
                                    : ""
                                } ${ecosystem.joined
                                    ? "joined"
                                    : ""
                                }`}
                            onClick={() => {
                                if (
                                    !ecosystem.joined
                                ) {
                                    toggleSelection(
                                        ecosystem.key
                                    );
                                }
                            }}
                        >
                            <div className="tb-eco-icon">
                                {
                                    ecosystem.icon
                                }
                            </div>

                            <h2>
                                {
                                    ecosystem.name
                                }
                            </h2>

                            <p>
                                {
                                    ecosystem.description
                                }
                            </p>

                            {ecosystem.joined ? (
                                <span className="tb-joined">
                                    Already Joined
                                </span>
                            ) : (
                                <span>
                                    {selected.includes(
                                        ecosystem.key
                                    )
                                        ? "Selected"
                                        : "Select"}
                                </span>
                            )}
                        </div>
                    )
                )}

            </div>

            <button
                className="tb-primary-btn"
                onClick={
                    continueSelection
                }
            >
                Continue
            </button>

        </div>
    );
};

export default TBridgeEcosystemSelection;