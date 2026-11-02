
const TBridgeStats = ({
    statistics
}) => {
    return (
        <section className="tb-stats">

            <div className="tb-stat-card">
                <span>
                    🌐
                </span>

                <strong>
                    {
                        statistics.totalEcosystems
                    }
                </strong>

                <p>
                    Ecosystems Joined
                </p>
            </div>

            <div className="tb-stat-card">
                <span>
                    ✅
                </span>

                <strong>
                    {
                        statistics.completedEcosystems
                    }
                </strong>

                <p>
                    Completed
                </p>
            </div>

            <div className="tb-stat-card">
                <span>
                    ⏳
                </span>

                <strong>
                    {
                        statistics.pendingEcosystems
                    }
                </strong>

                <p>
                    Pending
                </p>
            </div>

        </section>
    );
};

export default TBridgeStats;