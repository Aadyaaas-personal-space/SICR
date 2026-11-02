import { useNavigate, useParams } from "react-router-dom";

const TBridgeEcosystemDetails = () => {
    const { ecosystem } =
        useParams();

    const navigate = useNavigate();

    const routes = {
        startup:
            "/startup/dashboard",

        investor:
            "/investor/dashboard",

        mentor:
            "/mentor/dashboard",

        partnership:
            "/partnership/dashboard",

        sponsorship:
            "/sponsorship/dashboard",

        funder:
            "/funder/dashboard"
    };

    const openEcosystem = () => {
        const route =
            routes[ecosystem];

        if (route) {
            navigate(route);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center"
            }}
        >
            <div>
                <h1>
                    {ecosystem}
                </h1>

                <button
                    onClick={
                        openEcosystem
                    }
                >
                    Open Ecosystem
                </button>
            </div>
        </div>
    );
};

export default TBridgeEcosystemDetails;