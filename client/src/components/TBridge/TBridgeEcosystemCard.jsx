import { useNavigate } from "react-router-dom";

const TBridgeEcosystemCard = ({
    ecosystem
}) => {
    const navigate = useNavigate();

    const openEcosystem = () => {
        if (ecosystem.route) {
            navigate(
                ecosystem.route
            );
        }
    };

    return (
        <div className="tb-eco-dashboard-card">

            <div className="tb-eco-card-icon">
                {ecosystem.icon}
            </div>

            <div className="tb-eco-card-content">

                <span className="tb-eco-status">
                    {ecosystem.profileCompleted
                        ? "Profile Complete"
                        : "Profile Incomplete"}
                </span>

                <h3>
                    {ecosystem.name}
                </h3>

                <p>
                    {ecosystem.description}
                </p>

                <div className="tb-progress">
                    <div
                        style={{
                            width: `${ecosystem.profileCompletion}%`
                        }}
                    />
                </div>

                <small>
                    {
                        ecosystem.profileCompletion
                    }
                    % complete
                </small>

            </div>

            <button
                onClick={
                    openEcosystem
                }
            >
                Open
            </button>

        </div>
    );
};

export default TBridgeEcosystemCard;