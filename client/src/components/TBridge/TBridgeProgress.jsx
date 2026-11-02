const TBridgeProgress = ({
    value = 0
}) => {
    return (
        <div className="tb-component-progress">

            <div className="tb-component-progress-header">
                <span>
                    Profile Completion
                </span>

                <strong>
                    {value}%
                </strong>
            </div>

            <div className="tb-component-progress-bar">
                <div
                    style={{
                        width: `${value}%`
                    }}
                />
            </div>

        </div>
    );
};

export default TBridgeProgress;