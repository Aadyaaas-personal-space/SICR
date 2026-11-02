import { useNavigate } from "react-router-dom";

const TBridgeNavbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem(
            "tBridgeToken"
        );

        localStorage.removeItem(
            "tBridgeUser"
        );

        navigate(
            "/tbridge/login"
        );
    };

    return (
        <nav className="tb-dashboard-nav">

            <div
                className="tb-dashboard-brand"
                onClick={() =>
                    navigate(
                        "/tbridge/dashboard"
                    )
                }
            >
                <span>
                    T
                </span>

                <strong>
                    T-Bridge
                </strong>
            </div>

            <div className="tb-dashboard-links">

                <button
                    onClick={() =>
                        navigate(
                            "/tbridge/dashboard"
                        )
                    }
                >
                    Dashboard
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/tbridge/join"
                        )
                    }
                >
                    Join Ecosystem
                </button>

                <button
                    onClick={() =>
                        navigate(
                            "/tbridge/settings"
                        )
                    }
                >
                    Settings
                </button>

                <button
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
};

export default TBridgeNavbar;