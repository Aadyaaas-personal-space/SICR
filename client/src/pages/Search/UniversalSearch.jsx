
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiscoverIdeas } from "../../services/ideasService";
import { sendConnectionRequest } from "../../services/connectionService";
import { getLoggedInIdentity } from "../../utils/authIdentity";
import "./UniversalSearch.css";

const CATEGORIES = [
    "All Ideas",
    "Technology",
    "Education",
    "Sustainability",
    "Healthcare",
    "Finance",
];

const SUPPORTED_TYPES = [
    "STARTUP",
    "INVESTOR",
    "MENTOR",
    "CORPORATE",
    "PARTNERSHIP",
    "SPONSORSHIP",
    "TBRIDGE",
];

function normalizeType(value) {
    const type = String(value || "").trim().toUpperCase();

    if (["INVESTORFUNDER", "FUNDER"].includes(type)) {
        return "INVESTOR";
    }

    return type;
}

function getTags(tags) {
    if (Array.isArray(tags)) return tags;

    if (typeof tags === "string") {
        return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    }

    return [];
}

function getInitial(name) {
    return String(name || "S").trim().charAt(0).toUpperCase();
}

function UniversalSearch() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All Ideas");
    const [ideas, setIdeas] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [actionSuccess, setActionSuccess] = useState("");
    const [busyKey, setBusyKey] = useState("");
    const [selectedCreator, setSelectedCreator] = useState(null);

    const identity = getLoggedInIdentity();

    async function loadIdeas(searchText = "", selectedCategory = category) {
        setLoading(true);
        setError("");
        setActionError("");
        setActionSuccess("");
        setSearched(true);

        try {
            const response = await getDiscoverIdeas({
                search: searchText,
                category: selectedCategory,
            });

            setIdeas(Array.isArray(response?.ideas) ? response.ideas : []);
        } catch (err) {
            console.error("SICR Discover Ideas Error:", err);
            setIdeas([]);
            setError(err.message || "Unable to load ideas.");
        } finally {
            setLoading(false);
        }
    }

    async function performSearch(event) {
        event?.preventDefault();

        const searchText = query.trim();

        if (!searchText) {
            setError("Enter a topic to search for ideas.");
            setIdeas([]);
            setSearched(false);
            return;
        }

        await loadIdeas(searchText, category);
    }

    function clearSearch() {
        setQuery("");
        setCategory("All Ideas");
        setIdeas([]);
        setSearched(false);
        setError("");
        setActionError("");
        setActionSuccess("");
        setSelectedCreator(null);
    }

    function getCreator(idea) {
        const creator = idea?.creator || {};
        const id = creator.id || creator._id;
        const type = normalizeType(creator.type);

        return {
            ...creator,
            id: id ? String(id) : "",
            type,
            name: creator.name || "SICR Member",
            photo: creator.photo || "",
            headline: creator.headline || "",
        };
    }

    function isOwnCreator(creator) {
        return Boolean(
            identity?.id &&
            creator?.id &&
            String(identity.id) === String(creator.id) &&
            normalizeType(identity.type) === normalizeType(creator.type)
        );
    }

    async function handleConnection(idea) {
        setActionError("");
        setActionSuccess("");

        if (!identity?.id) {
            setActionError("Please log in before sending a connection request.");
            return;
        }

        const creator = getCreator(idea);

        if (!creator.id || !SUPPORTED_TYPES.includes(creator.type)) {
            setActionError(
                "This idea does not have a complete creator identity. The connection request cannot be sent."
            );
            return;
        }

        if (isOwnCreator(creator)) {
            setActionError("You cannot send a connection request to yourself.");
            return;
        }

        const key = `connect:${idea.id || idea._id}`;

        try {
            setBusyKey(key);

            const result = await sendConnectionRequest({
                senderType: normalizeType(identity.type),
                senderId: identity.id,
                receiverType: creator.type,
                receiverId: creator.id,
                message: `Hi ${creator.name}, I discovered your idea "${idea.title || "your idea"}" on SICR and would like to connect.`,
            });

            setActionSuccess(
                result?.message || `Connection request sent to ${creator.name}.`
            );
        } catch (err) {
            setActionError(
                err.message || "Unable to send the connection request."
            );
        } finally {
            setBusyKey("");
        }
    }


    function handleMessage(idea) {
        setActionError("");
    setActionSuccess("");

    if (!identity?.id) {
        setActionError("Please log in before using SICR Messenger.");
        return;
    }

    const creator = getCreator(idea);

    if (!creator.id || !SUPPORTED_TYPES.includes(creator.type)) {
        setActionError("The creator's identity is unavailable.");
        return;
    }

    if (isOwnCreator(creator)) {
        setActionError("You cannot message yourself.");
        return;
    }

    const currentType = normalizeType(identity.type);

    if (!["STARTUP", "INVESTOR"].includes(currentType)) {
        setActionError(
            "Messenger is currently available for Startup and Investor accounts."
        );
        return;
    }

    const messengerPath =
        currentType === "INVESTOR"
            ? "/investor/messenger"
            : "/startup/messenger";

    navigate(messengerPath, {
        state: {
            peer: {
                id: creator.id,
                type: creator.type,
                name: creator.name,
                },
            },
        });
    }


    return (
        <main className="universal-search-page">
            <section className="search-hero">
                <div className="search-container">
                    <div className="search-eyebrow">SICR COMMUNITY IDEAS</div>

                    <h1>
                        Discover ideas.<span> Build what's next.</span>
                    </h1>

                    <p className="search-subtitle">
                        Explore ideas shared by startups, investors, mentors,
                        corporates and innovators across SICR.
                    </p>

                    <form className="universal-search-box" onSubmit={performSearch}>
                        <div className="search-input-wrapper">
                            <span className="search-icon">⌕</span>

                            <input
                                type="search"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    if (error) setError("");
                                }}
                                placeholder="Search ideas, problems, solutions or topics..."
                                aria-label="Search SICR ideas"
                            />

                            {query && (
                                <button
                                    type="button"
                                    className="clear-button"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            aria-label="Filter ideas by category"
                        >
                            {CATEGORIES.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="search-submit"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search →"}
                        </button>
                    </form>

                    <div className="search-hints">
                        <span>Explore:</span>

                        {["AI", "Education", "Sustainability", "Healthcare"].map(
                            (term) => (
                                <button
                                    type="button"
                                    key={term}
                                    onClick={() => {
                                        setQuery(term);
                                        loadIdeas(term, category);
                                    }}
                                >
                                    {term}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section className="search-results-section">
                <div className="search-container">
                    {actionError && (
                        <div className="discover-feedback discover-feedback-error" role="alert">
                            {actionError}
                            <button type="button" onClick={() => setActionError("")}>
                                Dismiss
                            </button>
                        </div>
                    )}

                    {actionSuccess && (
                        <div className="discover-feedback discover-feedback-success" role="status">
                            {actionSuccess}
                            <button type="button" onClick={() => setActionSuccess("")}>
                                Dismiss
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="search-state-card">
                            <h3>Discovering ideas...</h3>
                            <p>Searching ideas shared across the SICR community.</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="search-error-card" role="alert">
                            <h3>Unable to load ideas</h3>
                            <p>{error}</p>
                            <button
                                type="button"
                                className="retry-button"
                                onClick={() => loadIdeas(query.trim(), category)}
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading && !error && searched && (
                        <>
                            <div className="results-header">
                                <div>
                                    <div className="results-label">SICR IDEA EXPLORER</div>
                                    <h2>
                                        {ideas.length} {ideas.length === 1 ? "idea" : "ideas"} found
                                    </h2>
                                </div>
                            </div>

                            {ideas.length > 0 ? (
                                <div className="results-grid">
                                    {ideas.map((idea) => {
                                        const creator = getCreator(idea);
                                        const tags = getTags(idea.tags);
                                        const ideaKey = idea.id || idea._id;
                                        const ownIdea =
                                            idea.isOwnIdea || isOwnCreator(creator);

                                        return (
                                            <article
                                                className="profile-result-card"
                                                key={ideaKey}
                                            >
                                                <div className="card-top">
                                                    <span className="ecosystem-badge">
                                                        {idea.category || "General"}
                                                    </span>

                                                    {ownIdea && (
                                                        <span className="rank-number">
                                                            Your idea
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="profile-heading">
                                                    <h3>{idea.title || "Untitled idea"}</h3>
                                                </div>

                                                <p className="profile-description">
                                                    {idea.description || "No description provided."}
                                                </p>

                                                {tags.length > 0 && (
                                                    <div className="profile-tags">
                                                        {tags.map((tag, index) => (
                                                            <span key={`${tag}-${index}`}>
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="idea-discover-author">
                                                    {creator.photo ? (
                                                        <img
                                                            className="idea-discover-avatar"
                                                            src={creator.photo}
                                                            alt={`${creator.name} profile`}
                                                        />
                                                    ) : (
                                                        <div className="idea-discover-avatar idea-discover-avatar-fallback">
                                                            {getInitial(creator.name)}
                                                        </div>
                                                    )}

                                                    <div className="idea-discover-author-info">
                                                        <strong>{creator.name}</strong>
                                                        <span>
                                                            {creator.headline ||
                                                                creator.type ||
                                                                "SICR Community"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="idea-discover-footer">
                                                    <span>
                                                        {idea.createdAt
                                                            ? new Date(idea.createdAt).toLocaleDateString()
                                                            : "Community idea"}
                                                    </span>
                                                    <span>{creator.type}</span>
                                                </div>

                                                <div className="idea-discover-actions">
                                                    <button
                                                        type="button"
                                                        className="discover-button discover-button-profile"
                                                        onClick={() => setSelectedCreator({
                                                            creator,
                                                            ideaTitle: idea.title || "Untitled idea",
                                                        })}
                                                    >
                                                        View Profile
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="discover-button discover-button-connection"
                                                        disabled={
                                                            Boolean(busyKey) ||
                                                            ownIdea ||
                                                            !creator.id ||
                                                            !SUPPORTED_TYPES.includes(creator.type)
                                                        }
                                                        onClick={() => handleConnection(idea)}
                                                    >
                                                        {busyKey === `connect:${ideaKey}`
                                                            ? "Sending..."
                                                            : "Send Connection"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="discover-button discover-button-message"
                                                        disabled={
                                                            ownIdea ||
                                                            !creator.id ||
                                                            !SUPPORTED_TYPES.includes(creator.type)
                                                        }
                                                        onClick={() => handleMessage(idea)}
                                                    >
                                                        Send Message
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">⌕</div>
                                    <h3>No ideas found</h3>
                                    <p>
                                        Try another topic or select a different category.
                                        Only published community ideas appear here.
                                    </p>
                                    <button
                                        type="button"
                                        className="retry-button"
                                        onClick={clearSearch}
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {!loading && !searched && !error && (
                        <div className="initial-search-state">
                            <h2>Great ideas start with a search.</h2>
                            <p>
                                Search for a topic to discover ideas published by
                                members across SICR.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {selectedCreator && (
                <div
                    className="creator-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedCreator(null);
                        }
                    }}
                >
                    <section
                        className="creator-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="creator-modal-title"
                    >
                        <button
                            type="button"
                            className="creator-modal-close"
                            onClick={() => setSelectedCreator(null)}
                            aria-label="Close creator profile"
                        >
                            ×
                        </button>

                        <div className="creator-modal-avatar">
                            {selectedCreator.creator.photo ? (
                                <img
                                    src={selectedCreator.creator.photo}
                                    alt=""
                                />
                            ) : (
                                getInitial(selectedCreator.creator.name)
                            )}
                        </div>

                        <span className="results-label">SICR COMMUNITY MEMBER</span>
                        <h2 id="creator-modal-title">
                            {selectedCreator.creator.name}
                        </h2>

                        <p className="creator-modal-headline">
                            {selectedCreator.creator.headline ||
                                selectedCreator.creator.type ||
                                "SICR Community"}
                        </p>

                        <div className="creator-modal-detail">
                            <span>Ecosystem</span>
                            <strong>
                                {selectedCreator.creator.type || "Not specified"}
                            </strong>
                        </div>

                        <div className="creator-modal-detail">
                            <span>Discovered through idea</span>
                            <strong>{selectedCreator.ideaTitle}</strong>
                        </div>

                        <p className="creator-modal-note">
                            This preview uses the public creator details returned by
                            Discover. Full public profiles are not available through
                            the current profile API.
                        </p>

                        <button
                            type="button"
                            className="discover-button discover-button-profile"
                            onClick={() => {
                                setSelectedCreator(null);
                                const idea = ideas.find(
                                    (item) =>
                                        String(item.title || "Untitled idea") ===
                                        String(selectedCreator.ideaTitle)
                                );
                                if (idea) handleMessage(idea);
                            }}
                        >
                            Contact this member
                        </button>
                    </section>
                </div>
            )}
        </main>
    );
}

export default UniversalSearch;
