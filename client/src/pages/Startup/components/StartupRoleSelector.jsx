import { useState } from "react";

const startupRoles = [
    {
        id: "founder",
        icon: "🚀",
        title: "Founder",
        description:
            "You are building or leading your own startup.",
    },

    {
        id: "cofounder",
        icon: "🤝",
        title: "Co-Founder",
        description:
            "You are part of the founding team of a startup.",
    },

    {
        id: "entrepreneur",
        icon: "💡",
        title: "Entrepreneur",
        description:
            "You are exploring, developing or validating a business idea.",
    },

    {
        id: "startup-team",
        icon: "👥",
        title: "Startup Team",
        description:
            "You are working as a member of a startup team.",
    },

    {
        id: "startup-employee",
        icon: "💼",
        title: "Startup Professional",
        description:
            "You work professionally within the startup ecosystem.",
    },

    {
        id: "aspiring-founder",
        icon: "🎯",
        title: "Aspiring Founder",
        description:
            "You want to start a company or explore entrepreneurship.",
    },

    {
        id: "student-founder",
        icon: "🎓",
        title: "Student Entrepreneur",
        description:
            "You are a student developing a startup or business idea.",
    },

    {
        id: "other",
        icon: "＋",
        title: "Other",
        description:
            "Your role does not fit the options above.",
    },
];

function StartupRoleSelector({
    selectedRole,
    setSelectedRole,
}) {
    const handleSelect = (roleId) => {
        setSelectedRole(roleId);
    };

    return (
        <div className="startup-role-grid">

            {startupRoles.map((role) => {
                const selected =
                    selectedRole === role.id;

                return (
                    <button
                        type="button"
                        key={role.id}
                        className={`startup-role-card ${selected ? "selected" : ""
                            }`}
                        onClick={() =>
                            handleSelect(role.id)
                        }
                    >

                        <div className="startup-role-icon">
                            {role.icon}
                        </div>

                        <div className="startup-role-content">

                            <h3>
                                {role.title}
                            </h3>

                            <p>
                                {role.description}
                            </p>

                        </div>

                        <div className="startup-role-check">
                            {selected ? "✓" : ""}
                        </div>

                    </button>
                );
            })}

        </div>
    );
}

export default StartupRoleSelector;