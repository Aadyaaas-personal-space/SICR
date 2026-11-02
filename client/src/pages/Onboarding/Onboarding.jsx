import { useState } from "react";
import { Link } from "react-router-dom";

import StepIndicator from "./components/StepIndicator";
import EcosystemSelector from "./components/EcosystemSelector";
import RoleSelector from "./components/RoleSelector";

import "./Onboarding.css";

function Onboarding() {
    const [currentStep, setCurrentStep] =
        useState(1);

    const [selectedEcosystems, setSelectedEcosystems] =
        useState([]);

    const [selectedRoles, setSelectedRoles] =
        useState([]);

    const [account, setAccount] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const updateAccount = (event) => {
        setAccount({
            ...account,
            [event.target.name]:
                event.target.value,
        });
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="onboarding-page">

            {/* HEADER */}

            <header className="onboarding-header">

                <Link
                    to="/"
                    className="onboarding-logo"
                >
                    <span>S</span>
                    SICR
                </Link>

                <div>
                    Already have an account?
                    {" "}
                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </header>

            {/* MAIN */}

            <main className="onboarding-main">

                <div className="onboarding-container">

                    <div className="onboarding-heading">

                        <span>
                            SICR ONBOARDING
                        </span>

                        <h1>
                            Build your SICR journey.
                        </h1>

                        <p>
                            Tell us who you are and what you want
                            to accomplish. SICR will personalize
                            your ecosystem experience.
                        </p>

                    </div>

                    <StepIndicator
                        currentStep={currentStep}
                    />

                    <section className="onboarding-card">

                        {/* STEP 1 */}

                        {currentStep === 1 && (
                            <div className="onboarding-step">

                                <div className="step-heading">
                                    <span>01</span>

                                    <h2>
                                        Create your account
                                    </h2>

                                    <p>
                                        Start with your basic account
                                        information.
                                    </p>
                                </div>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={account.firstName}
                                            onChange={updateAccount}
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={account.lastName}
                                            onChange={updateAccount}
                                            placeholder="Enter last name"
                                        />
                                    </div>

                                    <div className="form-group full">
                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={account.email}
                                            onChange={updateAccount}
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={account.password}
                                            onChange={updateAccount}
                                            placeholder="Create password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={
                                                account.confirmPassword
                                            }
                                            onChange={updateAccount}
                                            placeholder="Confirm password"
                                        />
                                    </div>

                                </div>

                            </div>
                        )}

                        {/* STEP 2 */}

                        {currentStep === 2 && (
                            <div className="onboarding-step">

                                <div className="step-heading">
                                    <span>02</span>

                                    <h2>
                                        Choose your ecosystem
                                    </h2>

                                    <p>
                                        You can participate in multiple
                                        SICR ecosystems.
                                    </p>
                                </div>

                                <EcosystemSelector
                                    selectedEcosystems={
                                        selectedEcosystems
                                    }
                                    setSelectedEcosystems={
                                        setSelectedEcosystems
                                    }
                                />

                            </div>
                        )}

                        {/* STEP 3 */}

                        {currentStep === 3 && (
                            <div className="onboarding-step">

                                <div className="step-heading">
                                    <span>03</span>

                                    <h2>
                                        Choose your role
                                    </h2>

                                    <p>
                                        Select the roles that best
                                        represent you.
                                    </p>
                                </div>

                                <RoleSelector
                                    selectedEcosystems={
                                        selectedEcosystems
                                    }
                                    selectedRoles={
                                        selectedRoles
                                    }
                                    setSelectedRoles={
                                        setSelectedRoles
                                    }
                                />

                            </div>
                        )}

                        {/* STEP 4 */}

                        {currentStep === 4 && (
                            <div className="onboarding-step">

                                <div className="step-heading">
                                    <span>04</span>

                                    <h2>
                                        Complete your profile
                                    </h2>

                                    <p>
                                        Additional profile information
                                        will be collected based on your
                                        selected ecosystem.
                                    </p>
                                </div>

                                <div className="profile-placeholder">

                                    <div>
                                        ✓
                                    </div>

                                    <h3>
                                        Ecosystem configuration ready
                                    </h3>

                                    <p>
                                        Your selected ecosystems and
                                        roles will determine the profile
                                        questions you receive.
                                    </p>

                                </div>

                            </div>
                        )}

                        {/* FOOTER */}

                        <div className="onboarding-actions">

                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    className="secondary-action"
                                    onClick={previousStep}
                                >
                                    ← Back
                                </button>
                            ) : (
                                <Link
                                    to="/"
                                    className="secondary-action"
                                >
                                    Cancel
                                </Link>
                            )}

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    className="primary-action"
                                    onClick={nextStep}
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="primary-action"
                                >
                                    Complete Setup →
                                </button>
                            )}

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Onboarding;