const roles = {
    startup: [
        "Founder",
        "Co-Founder",
        "Entrepreneur",
        "Startup Team",
    ],

    investor: [
        "Angel Investor",
        "Venture Capital",
        "Fund Manager",
        "Institutional Investor",
    ],

    mentor: [
        "Mentor",
        "Industry Expert",
        "Advisor",
        "Consultant",
    ],

    corporate: [
        "Corporate",
        "Industry",
        "Enterprise",
        "Hiring Organization",
    ],

    partnership: [
        "Strategic Partner",
        "Technology Partner",
        "Academic Partner",
        "Business Partner",
    ],

    sponsorship: [
        "Corporate Sponsor",
        "Event Sponsor",
        "Program Sponsor",
        "Institutional Sponsor",
    ],

    tbridge: [
        "Technology Provider",
        "Developer",
        "Talent",
        "Opportunity Provider",
    ],

    career: [
        "Student",
        "Professional",
        "Job Seeker",
        "Future Entrepreneur",
    ],
};

function RoleSelector({
    selectedEcosystems,
    selectedRoles,
    setSelectedRoles,
}) {
    const availableRoles = selectedEcosystems.flatMap(
        (ecosystem) =>
            roles[ecosystem]?.map((role) => ({
                ecosystem,
                role,
            })) || []
    );

    const toggleRole = (ecosystem, role) => {
        const roleKey = `${ecosystem}:${role}`;

        setSelectedRoles((previous) => {
            if (previous.includes(roleKey)) {
                return previous.filter(
                    (item) => item !== roleKey
                );
            }

            return [...previous, roleKey];
        });
    };

    return (
        <div className="role-selector">

            {selectedEcosystems.map((ecosystem) => (
                <div
                    className="role-group"
                    key={ecosystem}
                >
                    <h3>
                        {ecosystem
                            .charAt(0)
                            .toUpperCase() +
                            ecosystem.slice(1)}
                    </h3>

                    <div className="role-options">

                        {roles[ecosystem]?.map((role) => {
                            const roleKey = `${ecosystem}:${role}`;

                            const selected =
                                selectedRoles.includes(roleKey);

                            return (
                                <button
                                    type="button"
                                    key={role}
                                    className={`role-option ${selected ? "selected" : ""
                                        }`}
                                    onClick={() =>
                                        toggleRole(
                                            ecosystem,
                                            role
                                        )
                                    }
                                >
                                    <span>
                                        {selected ? "✓" : "+"}
                                    </span>

                                    {role}
                                </button>
                            );
                        })}

                    </div>
                </div>
            ))}

            {availableRoles.length === 0 && (
                <div className="empty-role">
                    Select an ecosystem first.
                </div>
            )}

        </div>
    );
}

export default RoleSelector;