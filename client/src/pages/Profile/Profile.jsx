
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
    getProfile,
    updateProfile,
} from "../../services/profileService";

import { getIdeas } from "../../services/ideasService";
import { getLoggedInIdentity } from "../../utils/authIdentity";
import Sidebar from "../../components/sidebar/Sidebar";
import Footer from "../../components/footer/Footer";

import "./Profile.css";

const getIdeaId = (idea) =>
    idea?._id || idea?.id || idea?.ideaId || "";

const getIdeaOwnerId = (idea) =>
    idea?.creatorId?._id ||
    idea?.creatorId ||
    idea?.authorId?._id ||
    idea?.authorId ||
    "";

const getIdeaOwnerType = (idea) =>
    String(
        idea?.creatorType ||
        idea?.authorType ||
        idea?.ecosystem ||
        ""
    ).toUpperCase();

const getIdentityType = (identity) =>
    String(
        identity?.type ||
        identity?.ecosystem ||
        identity?.role ||
        ""
    ).toUpperCase();

const getIdeaDate = (idea) => {
    const value = idea?.createdAt || idea?.updatedAt;

    if (!value) return "";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
};

const getIdeasPage = (identity) => {
    const type = getIdentityType(identity);

    if (type.includes("INVESTOR") || type.includes("FUNDER")) {
        return "/investor/ideas";
    }

    if (type.includes("MENTOR")) {
        return "/mentor/ideas";
    }

    return "/startup/ideas";
};

const Profile = () => {
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profilePhoto: null,
    });

    const [identity, setIdentity] = useState(null);
    const [myIdeas, setMyIdeas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [ideasLoading, setIdeasLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [ideasError, setIdeasError] = useState("");

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProfile();
            const currentProfile = data?.profile || {};

            setProfile({
                firstName: currentProfile.firstName || "",
                lastName: currentProfile.lastName || "",
                email: currentProfile.email || "",
                phone: currentProfile.phone || "",
                profilePhoto: currentProfile.profilePhoto || null,
            });
        } catch (err) {
            console.error("Profile loading error:", err);
            setError(err.message || "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }, []);

    
const loadMyIdeas = useCallback(async () => {
    try {
        setIdeasLoading(true);
        setIdeasError("");

        const currentIdentity = getLoggedInIdentity();
        setIdentity(currentIdentity || null);

        if (!currentIdentity?.id) {
            setMyIdeas([]);
            setIdeasError("Please log in again to view your ideas.");
            return;
        }

        // Ask the existing backend for the current user's ideas.
        const response = await getIdeas({ mine: true });

        const ideas = Array.isArray(response)
            ? response
            : Array.isArray(response?.ideas)
                ? response.ideas
                : Array.isArray(response?.data?.ideas)
                    ? response.data.ideas
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

        setMyIdeas(ideas);
    } catch (err) {
        console.error("Ideas loading error:", err);
        setIdeasError(
            err.message || "Unable to load your ideas right now."
        );
    } finally {
        setIdeasLoading(false);
    }
}, []);


    useEffect(() => {
        loadProfile();
        loadMyIdeas();
    }, [loadProfile, loadMyIdeas]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Profile photo must be less than 5 MB.");
            return;
        }

        setError("");
        setMessage("");

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfile((current) => ({
                ...current,
                profilePhoto: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setProfile((current) => ({
            ...current,
            profilePhoto: null,
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const data = await updateProfile(profile);
            const updatedProfile = data?.profile || {};

            setProfile({
                firstName: updatedProfile.firstName || "",
                lastName: updatedProfile.lastName || "",
                email: updatedProfile.email || "",
                phone: updatedProfile.phone || "",
                profilePhoto: updatedProfile.profilePhoto || null,
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Profile update error:", err);
            setError(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const ideasPage = getIdeasPage(identity);

    return (
        <div className="profile-app-layout">
            <Sidebar />

            <div className="profile-main-shell">
                <main className="profile-page">
                    <div className="profile-container">
                        <div className="profile-header">
                            <div>
                                <span className="profile-eyebrow">
                                    YOUR ACCOUNT
                                </span>

                                <h1>My Profile</h1>

                                <p>
                                    Manage your personal information and
                                    explore the ideas you have shared on SICR.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="profile-alert error">
                                <span>{error}</span>

                                <button
                                    type="button"
                                    onClick={() => setError("")}
                                    aria-label="Dismiss error"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {message && (
                            <div className="profile-alert success">
                                {message}
                            </div>
                        )}

                        {loading ? (
                            <div className="profile-loading">
                                Loading profile...
                            </div>
                        ) : (
                            <form
                                className="profile-card"
                                onSubmit={handleSubmit}
                            >
                                <div className="profile-section-heading">
                                    <div>
                                        <h2>Personal information</h2>
                                        <p>
                                            Keep your account details up to date.
                                        </p>
                                    </div>
                                </div>

                                <div className="profile-photo-section">
                                    <div className="profile-photo-wrapper">
                                        {profile.profilePhoto ? (
                                            <img
                                                src={profile.profilePhoto}
                                                alt="Profile"
                                                className="profile-photo"
                                            />
                                        ) : (
                                            <div className="profile-photo-placeholder">
                                                {profile.firstName
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="photo-actions">
                                        <strong>Profile photo</strong>

                                        <span>
                                            JPG, PNG or WEBP · Maximum 5 MB
                                        </span>

                                        <div className="photo-buttons">
                                            <button
                                                type="button"
                                                className="photo-button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                {profile.profilePhoto
                                                    ? "Change photo"
                                                    : "Upload photo"}
                                            </button>

                                            {profile.profilePhoto && (
                                                <button
                                                    type="button"
                                                    className="remove-photo-button"
                                                    onClick={removePhoto}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            hidden
                                        />
                                    </div>
                                </div>

                                <div className="profile-divider" />

                                <div className="profile-row">
                                    <div className="profile-field">
                                        <label htmlFor="firstName">
                                            First name
                                        </label>

                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="profile-field">
                                        <label htmlFor="lastName">
                                            Last name
                                        </label>

                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <label htmlFor="email">
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="profile-field">
                                    <label htmlFor="phone">
                                        Phone number
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="profile-footer">
                                    <button
                                        type="submit"
                                        className="update-profile-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving changes..."
                                            : "Save changes"}
                                    </button>
                                </div>
                            </form>
                        )}

                        <section className="my-ideas-section">
                            <div className="my-ideas-heading">
                                <div>
                                    <span className="profile-eyebrow">
                                        YOUR CONTRIBUTIONS
                                    </span>

                                    <h2>My Ideas</h2>

                                    <p>
                                        Ideas you have shared with the SICR
                                        community.
                                    </p>
                                </div>

                                <Link
                                    to={ideasPage}
                                    className="create-idea-button"
                                >
                                    + Create idea
                                </Link>
                            </div>

                            <div className="my-ideas-stats">
                                <div>
                                    <span className="my-ideas-stat-number">
                                        {ideasLoading ? "—" : myIdeas.length}
                                    </span>

                                    <span className="my-ideas-stat-label">
                                        {myIdeas.length === 1
                                            ? "Idea shared"
                                            : "Ideas shared"}
                                    </span>
                                </div>

                                <Link
                                    to={ideasPage}
                                    className="manage-ideas-link"
                                >
                                    Manage all ideas →
                                </Link>
                            </div>

                            {ideasLoading ? (
                                <div className="ideas-state-card">
                                    <div className="ideas-loading-indicator" />
                                    <p>Loading your ideas...</p>
                                </div>
                            ) : ideasError ? (
                                <div className="ideas-state-card ideas-state-error">
                                    <h3>Ideas could not be loaded</h3>
                                    <p>{ideasError}</p>

                                    <button
                                        type="button"
                                        className="ideas-retry-button"
                                        onClick={loadMyIdeas}
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : myIdeas.length === 0 ? (
                                <div className="ideas-state-card">
                                    <div className="empty-ideas-icon">✦</div>
                                    <h3>Your ideas start here</h3>
                                    <p>
                                        Share a concept, solve a problem, or
                                        introduce your next big idea to the SICR
                                        community.
                                    </p>

                                    <Link
                                        to={ideasPage}
                                        className="create-first-idea-button"
                                    >
                                        Create your first idea
                                    </Link>
                                </div>
                            ) : (
                                <div className="profile-ideas-grid">
                                    {myIdeas.map((idea) => (
                                        <article
                                            className="profile-idea-card"
                                            key={getIdeaId(idea)}
                                        >
                                            <div className="profile-idea-card-top">
                                                <span className="profile-idea-category">
                                                    {idea.category || "General"}
                                                </span>

                                                <span className="profile-idea-date">
                                                    {getIdeaDate(idea)}
                                                </span>
                                            </div>

                                            <h3>
                                                {idea.title || "Untitled idea"}
                                            </h3>

                                            <p className="profile-idea-description">
                                                {idea.description ||
                                                    "No description provided."}
                                            </p>

                                            {Array.isArray(idea.tags) &&
                                                idea.tags.length > 0 && (
                                                    <div className="profile-idea-tags">
                                                        {idea.tags
                                                            .slice(0, 4)
                                                            .map((tag, index) => (
                                                                <span
                                                                    key={`${tag}-${index}`}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                    </div>
                                                )}

                                            <div className="profile-idea-card-footer">
                                                <span>Created by you</span>

                                                <Link to={ideasPage}>
                                                    View / manage →
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Profile;
