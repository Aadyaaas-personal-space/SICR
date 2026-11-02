const TBridgeProfileCard = ({
    profile
}) => {
    if (!profile) {
        return null;
    }

    return (
        <div className="tb-profile-mini-card">

            <h3>
                Your Profile
            </h3>

            <p>
                {profile.bio ||
                    "Complete your profile"}
            </p>

            <strong>
                {profile.profileCompletion}%
                complete
            </strong>

        </div>
    );
};

export default TBridgeProfileCard;