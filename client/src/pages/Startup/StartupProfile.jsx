import { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import "./StartupProfile.css";

const questions = [
    {
        id: 1,
        title: "Describe your current position",
        shortTitle: "Current Position",
        description:
            "Tell us about your current role, stage, or position in your startup journey.",
        placeholder:
            "Example: I am a final-year student working on my startup idea...",
        icon: "bi-person-workspace",
    },
    {
        id: 2,
        title: "What are you currently planning to build?",
        shortTitle: "What I Want to Build",
        description:
            "Describe the product, service, platform, technology, or business you are planning to build.",
        placeholder:
            "Example: I am planning to build an AI-powered platform for...",
        icon: "bi-lightbulb",
    },
    {
        id: 3,
        title: "What do you currently have?",
        shortTitle: "What I Have",
        description:
            "Tell us about the existing resources you already have for your idea.",
        placeholder:
            "Example: I have a prototype, technical knowledge, two team members...",
        icon: "bi-box-seam",
    },
    {
        id: 4,
        title: "What do you currently need?",
        shortTitle: "What I Need",
        description:
            "Tell us what resources, funding, people, technology, knowledge, or support you need.",
        placeholder:
            "Example: I need funding, a technical mentor, cloud resources...",
        icon: "bi-clipboard-check",
    },
    {
        id: 5,
        title:
            "What type of people or organizations do you want to connect with?",
        shortTitle: "Connections",
        description:
            "Tell us who could help your startup grow.",
        placeholder:
            "Example: Investors, mentors, technology companies, universities...",
        icon: "bi-people",
    },
    {
        id: 6,
        title:
            "What kind of opportunities are you willing to consider?",
        shortTitle: "Opportunities",
        description:
            "Tell us what opportunities you are open to.",
        placeholder:
            "Example: Investment, partnership, incubation, employment, mentorship...",
        icon: "bi-stars",
    },
];

function StartupProfile() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const role =
        searchParams.get("role") ||
        "founder";

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    const [profile, setProfile] = useState(null);

    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    const [deleteConfirm, setDeleteConfirm] =
        useState(false);


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {
        const token =
            localStorage.getItem("startupToken");

        if (!token) {
            navigate("/startup/login");
            return;
        }

        const loadProfile = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/api/startup/profile`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem(
                        "startupToken"
                    );

                    localStorage.removeItem(
                        "startupUser"
                    );

                    navigate("/startup/login");

                    return;
                }

                if (response.ok) {
                    const data =
                        await response.json();

                    console.log(
                        "STARTUP PROFILE:",
                        data
                    );

                    const loadedProfile =
                        data.profile ||
                        data;

                    setProfile(
                        loadedProfile
                    );

                    const loadedAnswers =
                        loadedProfile.answers ||
                        {};

                    setAnswers(
                        loadedAnswers
                    );
                } else if (
                    response.status === 404
                ) {
                    setProfile(null);
                    setAnswers({});
                }

            } catch (error) {
                console.error(
                    "PROFILE LOAD ERROR:",
                    error
                );

                setError(
                    "Unable to load startup idea."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();

    }, [API_URL, navigate]);


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {
        setError("");
        setEditing(true);
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancel = () => {
        if (profile?.answers) {
            setAnswers(profile.answers);
        }

        setError("");
        setEditing(false);
    };


    // =====================================================
    // ANSWER CHANGE
    // =====================================================

    const handleAnswerChange = (
        questionId,
        value
    ) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: value,
        }));
    };


    // =====================================================
    // SAVE / UPDATE
    // =====================================================

    const handleSave = async () => {

        const hasEmptyAnswer =
            questions.some(
                (question) =>
                    !answers[
                        question.id
                    ]?.trim()
            );

        if (hasEmptyAnswer) {
            setError(
                "Please complete all sections before saving."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");

            const token =
                localStorage.getItem(
                    "startupToken"
                );

            if (!token) {
                navigate("/startup/login");
                return;
            }

            const response =
                await fetch(
                    `${API_URL}/api/startup/profile`,
                    {
                        method: profile
                            ? "PUT"
                            : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({
                            role,
                            answers,
                        }),
                    }
                );

            const data =
                await response.json();

            console.log(
                "PROFILE SAVE RESPONSE:",
                response.status,
                data
            );

            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "startupToken"
                );

                localStorage.removeItem(
                    "startupUser"
                );

                navigate(
                    "/startup/login"
                );

                return;
            }

            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to save startup idea."
                );

                return;
            }

            const savedProfile =
                data.profile ||
                data;

            setProfile(
                savedProfile
            );

            setAnswers(
                savedProfile.answers ||
                answers
            );

            setEditing(false);

        } catch (error) {

            console.error(
                "PROFILE SAVE ERROR:",
                error
            );

            setError(
                error.message ||
                "Unable to connect to the server."
            );

        } finally {
            setSaving(false);
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {

        try {

            setDeleting(true);
            setError("");

            const token =
                localStorage.getItem(
                    "startupToken"
                );

            if (!token) {
                navigate("/startup/login");
                return;
            }

            const response =
                await fetch(
                    `${API_URL}/api/startup/profile`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            console.log(
                "PROFILE DELETE RESPONSE:",
                response.status,
                data
            );

            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "startupToken"
                );

                localStorage.removeItem(
                    "startupUser"
                );

                navigate(
                    "/startup/login"
                );

                return;
            }

            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to delete startup idea."
                );

                return;
            }

            setProfile(null);
            setAnswers({});
            setEditing(false);
            setDeleteConfirm(false);

        } catch (error) {

            console.error(
                "PROFILE DELETE ERROR:",
                error
            );

            setError(
                error.message ||
                "Unable to connect to the server."
            );

        } finally {
            setDeleting(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="startup-profile-loading">

                <div className="spinner-border spinner-border-sm"></div>

                <span>
                    Loading startup idea...
                </span>

            </div>
        );
    }


    // =====================================================
    // CREATE MODE
    // =====================================================

    if (!profile && !editing) {

        return (
            <div className="startup-profile-page">

                <div className="startup-empty-state">

                    <div className="empty-icon">
                        <i className="bi bi-lightbulb"></i>
                    </div>

                    <span className="empty-label">
                        SICR • STARTUP
                    </span>

                    <h1>
                        Create your startup idea
                    </h1>

                    <p>
                        Tell us about the idea you are
                        building, what you have, what you
                        need and the opportunities you are
                        looking for.
                    </p>

                    <button
                        className="create-idea-btn"
                        onClick={() =>
                            setEditing(true)
                        }
                    >
                        <i className="bi bi-plus-lg"></i>
                        Create Startup Idea
                    </button>

                    <button
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate(
                                "/startup/dashboard"
                            )
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // EDIT / CREATE FORM
    // =====================================================

    if (editing) {

        return (
            <div className="startup-profile-page">

                <div className="startup-form-container">

                    {/* HEADER */}

                    <div className="idea-page-header">

                        <div>

                            <button
                                className="back-link"
                                onClick={
                                    handleCancel
                                }
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back
                            </button>

                            <span className="page-label">
                                SICR • STARTUP IDEA
                            </span>

                            <h1>
                                {profile
                                    ? "Update your startup idea"
                                    : "Create your startup idea"}
                            </h1>

                            <p>
                                Keep your startup information
                                clear and up to date.
                            </p>

                        </div>

                        <div className="form-progress">
                            <span>
                                {Object.values(
                                    answers
                                ).filter(
                                    (value) =>
                                        value?.trim()
                                ).length}
                                /6
                            </span>

                            <small>
                                sections completed
                            </small>
                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="profile-error">

                            <i className="bi bi-exclamation-circle"></i>

                            {error}

                        </div>
                    )}


                    {/* QUESTIONS */}

                    <div className="idea-form-list">

                        {questions.map(
                            (question) => (

                                <div
                                    className="idea-question"
                                    key={question.id}
                                >

                                    <div className="question-icon">
                                        <i
                                            className={`bi ${question.icon}`}
                                        ></i>
                                    </div>

                                    <div className="question-content">

                                        <div className="question-title-row">

                                            <div>

                                                <span>
                                                    {String(
                                                        question.id
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                                <h3>
                                                    {
                                                        question.title
                                                    }
                                                </h3>

                                            </div>

                                        </div>

                                        <p>
                                            {
                                                question.description
                                            }
                                        </p>

                                        <textarea
                                            value={
                                                answers[
                                                    question.id
                                                ] || ""
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                handleAnswerChange(
                                                    question.id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={
                                                question.placeholder
                                            }
                                            rows={4}
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* ACTIONS */}

                    <div className="idea-form-actions">

                        <button
                            className="cancel-btn"
                            onClick={
                                handleCancel
                            }
                            disabled={
                                saving
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className="save-idea-btn"
                            onClick={
                                handleSave
                            }
                            disabled={
                                saving
                            }
                        >

                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg"></i>
                                    {profile
                                        ? "Save Changes"
                                        : "Create Idea"}
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // PROFILE / IDEA VIEW
    // =====================================================

    return (
        <div className="startup-profile-page">

            <div className="startup-idea-container">

                {/* HEADER */}

                <div className="idea-view-header">

                    <div>

                        <button
                            className="back-link"
                            onClick={() =>
                                navigate(
                                    "/startup/dashboard"
                                )
                            }
                        >
                            <i className="bi bi-arrow-left"></i>
                            Dashboard
                        </button>

                        <span className="page-label">
                            SICR • MY STARTUP IDEA
                        </span>

                        <h1>
                            My Startup Idea
                        </h1>

                        <p>
                            Manage the information behind
                            your startup journey.
                        </p>

                    </div>

                    <div className="idea-header-actions">

                        <button
                            className="edit-idea-btn"
                            onClick={
                                handleEdit
                            }
                        >
                            <i className="bi bi-pencil"></i>
                            Edit
                        </button>

                        <button
                            className="delete-idea-btn"
                            onClick={() =>
                                setDeleteConfirm(
                                    true
                                )
                            }
                        >
                            <i className="bi bi-trash3"></i>
                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="profile-error">

                        <i className="bi bi-exclamation-circle"></i>

                        {error}

                    </div>
                )}


                {/* IDEA INTRO */}

                <div className="idea-summary">

                    <div className="idea-summary-icon">
                        <i className="bi bi-lightbulb"></i>
                    </div>

                    <div>

                        <span>
                            STARTUP IDEA
                        </span>

                        <h2>
                            {answers[2] ||
                                "Your startup idea"}
                        </h2>

                        <p>
                            Your current startup concept
                            and product direction.
                        </p>

                    </div>

                </div>


                {/* INFORMATION GRID */}

                <div className="idea-info-grid">

                    {questions
                        .map((question) => {

                            const value =
                                answers[
                                    question.id
                                ];

                            return (
                                <div
                                    className={
                                        question.id === 2
                                            ? "idea-info-card idea-info-large"
                                            : "idea-info-card"
                                    }
                                    key={
                                        question.id
                                    }
                                >

                                    <div className="info-card-top">

                                        <div className="info-icon">
                                            <i
                                                className={`bi ${question.icon}`}
                                            ></i>
                                        </div>

                                        <span>
                                            {
                                                question.shortTitle
                                            }
                                        </span>

                                    </div>

                                    <p>
                                        {value ||
                                            "No information added yet."}
                                    </p>

                                </div>
                            );
                        })}

                </div>


                {/* BOTTOM ACTION */}

                <div className="idea-bottom-card">

                    <div>

                        <i className="bi bi-rocket-takeoff"></i>

                        <div>

                            <strong>
                                Ready for the next step?
                            </strong>

                            <span>
                                Keep your startup idea updated
                                as it develops.
                            </span>

                        </div>

                    </div>

                    <button
                        onClick={
                            handleEdit
                        }
                    >
                        Update Idea
                    </button>

                </div>


                {/* DELETE MODAL */}

                {deleteConfirm && (

                    <div className="delete-overlay">

                        <div className="delete-modal">

                            <div className="delete-modal-icon">
                                <i className="bi bi-trash3"></i>
                            </div>

                            <h3>
                                Delete startup idea?
                            </h3>

                            <p>
                                This will remove your current
                                startup idea information.
                            </p>

                            <div className="delete-actions">

                                <button
                                    className="cancel-delete-btn"
                                    onClick={() =>
                                        setDeleteConfirm(
                                            false
                                        )
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="confirm-delete-btn"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Idea"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default StartupProfile;