import { useNavigate } from "react-router-dom";

const TBridgeNotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                textAlign: "center"
            }}
        >
            <div>
                <h1>
                    404
                </h1>

                <h2>
                    T-Bridge Page Not Found
                </h2>

                <button
                    onClick={() =>
                        navigate(
                            "/tbridge/dashboard"
                        )
                    }
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default TBridgeNotFound;