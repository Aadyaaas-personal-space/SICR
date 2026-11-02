const ecosystems = [
    {
        id: "startup",
        icon: "🚀",
        title: "Startup",
        description: "Build, launch and scale your startup.",
    },
    {
        id: "investor",
        icon: "💰",
        title: "Investor & Funding",
        description: "Discover investment and funding opportunities.",
    },
    {
        id: "mentor",
        icon: "🧠",
        title: "Mentor & Expertise",
        description: "Share knowledge and guide entrepreneurs.",
    },
    {
        id: "corporate",
        icon: "🏢",
        title: "Corporate & Industry",
        description: "Connect business, industry and innovation.",
    },
    {
        id: "partnership",
        icon: "🤝",
        title: "Partnership & Collaboration",
        description: "Build strategic ecosystem partnerships.",
    },
    {
        id: "sponsorship",
        icon: "🌐",
        title: "Sponsorship",
        description: "Support innovation and entrepreneurship.",
    },
    {
        id: "tbridge",
        icon: "🌉",
        title: "T-Bridge",
        description: "Connect technology, talent and opportunity.",
    },
    {
        id: "career",
        icon: "🎯",
        title: "Career & Entrepreneurship",
        description: "Build skills and your professional journey.",
    },
];

function EcosystemSelector({
    selectedEcosystems,
    setSelectedEcosystems,
}) {
    const toggleEcosystem = (id) => {
        setSelectedEcosystems((previous) => {
            if (previous.includes(id)) {
                return previous.filter((item) => item !== id);
            }

            return [...previous, id];
        });
    };

    return (
        <div className="selector-grid">

            {ecosystems.map((ecosystem) => {
                const selected = selectedEcosystems.includes(
                    ecosystem.id
                );

                return (
                    <button
                        type="button"
                        key={ecosystem.id}
                        className={`selector-card ${selected ? "selected" : ""
                            }`}
                        onClick={() =>
                            toggleEcosystem(ecosystem.id)
                        }
                    >
                        <div className="selector-icon">
                            {ecosystem.icon}
                        </div>

                        <div className="selector-content">
                            <h3>{ecosystem.title}</h3>

                            <p>
                                {ecosystem.description}
                            </p>
                        </div>

                        <div className="selector-check">
                            {selected ? "✓" : ""}
                        </div>
                    </button>
                );
            })}

        </div>
    );
}

export default EcosystemSelector;