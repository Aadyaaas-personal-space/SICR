const TBridgeWelcome = ({
    firstName
}) => {
    return (
        <div className="tb-welcome">

            <span>
                T-BRIDGE
            </span>

            <h1>
                Welcome,
                {" "}
                {firstName}
            </h1>

            <p>
                Your gateway to the
                SICR ecosystem.
            </p>

        </div>
    );
};

export default TBridgeWelcome;