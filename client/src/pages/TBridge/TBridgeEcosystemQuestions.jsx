import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TBridge/TBridgeEcosystem.css";

const TBridgeEcosystemQuestions = () => {
    const navigate = useNavigate();

    const token =
        localStorage.getItem(
            "tBridgeToken"
        );

    const selected =
        JSON.parse(
            localStorage.getItem(
                "tBridgeSelectedEcosystems"
            ) || "[]"
        );

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [answers, setAnswers] =
        useState({});

    const [error, setError] =
        useState("");

    const questions = [
        {
            id: "purpose",
            question:
                "What are you looking to achieve through SICR?",
            placeholder:
                "Tell us what you want to achieve..."
        },

        {
            id: "experience",
            question:
                "What experience do you bring?",
            placeholder:
                "Your experience, skills or background..."
        },

        {
            id: "requirements",
            question:
                "What are you currently looking for?",
            placeholder:
                "Funding, mentorship, partnerships..."
        },

        {
            id: "interests",
            question:
                "Which areas are you interested in?",
            placeholder:
                "AI, technology, finance..."
        },

        {
            id: "collaboration",
            question:
                "How would you like to collaborate?",
            placeholder:
                "Collaboration preferences..."
        },

        {
            id: "expectations",
            question:
                "What do you expect from the SICR ecosystem?",
            placeholder:
                "Your expectations..."
        }
    ];

    const current =
        questions[currentIndex];

    const handleChange = (e) => {
        setAnswers({
            ...answers,
            [current.id]:
                e.target.value
        });
    };

    const next = () => {
        if (
            !answers[current.id] ||
            !answers[current.id].trim()
        ) {
            setError(
                "Please answer this question"
            );
            return;
        }

        setError("");

        if (
            currentIndex <
            questions.length - 1
        ) {
            setCurrentIndex(
                currentIndex + 1
            );
        } else {
            completeEcosystems();
        }
    };

    const completeEcosystems =
        async () => {
            try {
                for (
                    const ecosystem
                    of selected
                ) {
                    await fetch(
                        "http://localhost:5000/api/tbridge/ecosystems/join",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                                Authorization:
                                    `Bearer ${token}`
                            },
                            body: JSON.stringify(
                                {
                                    ecosystem
                                }
                            )
                        }
                    );

                    await fetch(
                        "http://localhost:5000/api/tbridge/ecosystems/completion",
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type":
                                    "application/json",
                                Authorization:
                                    `Bearer ${token}`
                            },
                            body: JSON.stringify(
                                {
                                    ecosystem,
                                    profileCompletion: 100
                                }
                            )
                        }
                    );
                }

                localStorage.removeItem(
                    "tBridgeSelectedEcosystems"
                );

                navigate(
                    "/tbridge/dashboard"
                );
            } catch (error) {
                setError(
                    "Failed to activate ecosystems"
                );
            }
        };

    return (
        <div className="tb-question-page">

            <div className="tb-question-card">

                <div className="tb-question-top">
                    <span>
                        Question{" "}
                        {currentIndex + 1}{" "}
                        of {questions.length}
                    </span>

                    <div className="tb-question-progress">
                        <div
                            style={{
                                width: `${((currentIndex +
                                        1) /
                                        questions.length) *
                                    100
                                    }%`
                            }}
                        />
                    </div>
                </div>

                <h1>
                    {current.question}
                </h1>

                <p>
                    Your response helps
                    personalize your
                    ecosystem experience.
                </p>

                {error && (
                    <div className="tb-error">
                        {error}
                    </div>
                )}

                <textarea
                    value={
                        answers[current.id] ||
                        ""
                    }
                    onChange={
                        handleChange
                    }
                    placeholder={
                        current.placeholder
                    }
                    rows="7"
                />

                <button
                    className="tb-primary-btn"
                    onClick={next}
                >
                    {currentIndex ===
                        questions.length - 1
                        ? "Complete Profile"
                        : "Next"}
                </button>

            </div>

        </div>
    );
};

export default TBridgeEcosystemQuestions;