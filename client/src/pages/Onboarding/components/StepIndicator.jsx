function StepIndicator({ currentStep }) {
    const steps = [
        "Account",
        "Ecosystem",
        "Role",
        "Profile",
    ];

    return (
        <div className="step-indicator">
            {steps.map((step, index) => {
                const stepNumber = index + 1;

                return (
                    <div
                        className={`step-item ${currentStep >= stepNumber ? "active" : ""
                            }`}
                        key={step}
                    >
                        <div className="step-number">
                            {stepNumber}
                        </div>

                        <span>{step}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default StepIndicator;