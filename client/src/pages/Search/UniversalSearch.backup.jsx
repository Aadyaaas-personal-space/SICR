import { useState } from "react";
import { getLoggedInIdentity } from "../../utils/authIdentity";
import "./UniversalSearch.css";

const API_URL = "http://localhost:5000/api/matching/search";

const ECOSYSTEMS = [
    { value: "ALL", label: "All Ecosystems" },
    { value: "STARTUP", label: "Startup" },
    { value: "INVESTOR", label: "Investor / Funder" },
    { value: "MENTOR", label: "Mentor" },
    { value: "CORPORATE", label: "Corporate" },
    { value: "PARTNERSHIP", label: "Partnership" },
    { value: "SPONSORSHIP", label: "Sponsorship" },
    { value: "TBRIDGE", label: "T-Bridge" }
];

const ecosystemIcons = {
    STARTUP: "🚀",
    INVESTOR: "💰",
    MENTOR: "🧠",
    CORPORATE: "🏢",
    PARTNERSHIP: "🤝",
    SPONSORSHIP: "🎯",
    TBRIDGE: "🌉"
};

function formatScore(score) {
    const number = Number(score);

    if (Number.isNaN(number)) {
        return "0.0";
    }

    return number.toFixed(1);
}

function getResultName(profile) {
    return (
        profile.name ||
        profile.title ||
        profile.organization ||
        "SICR Member"
    );
}

function getResultDescription(profile) {
    return (
        profile.bio ||
        profile.description ||
        profile.searchText ||
        "SICR ecosystem participant"
    );
}

function getArrayValues(...values) {
    const result = [];

    values.forEach((value) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item && String(item).trim()) {
                    result.push(String(item).trim());
                }
            });
        } else if (value && typeof value === "string") {
            value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => result.push(item));
        }
    });

    return [...new Set(result)];
}

function UniversalSearch() {
    const identity = getLoggedInIdentity();

console.log(
    "SICR CURRENT IDENTITY:",
    identity
);
    const [query, setQuery] = useState("");
    const [ecosystem, setEcosystem] = useState("ALL");

    const [results, setResults] = useState([]);
    const [searchInfo, setSearchInfo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const performSearch = async (event) => {
        event?.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setError("Enter something to search.");
            setResults([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setError("");
        setSearched(false);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: trimmedQuery,
                    ecosystem,
                    topN: 10
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data?.message ||
                    "Unable to complete the semantic search."
                );
            }

            setResults(Array.isArray(data.results) ? data.results : []);

            setSearchInfo({
                query: data.search?.query || trimmedQuery,
                requestedEcosystem:
                    data.search?.requestedEcosystem || ecosystem,
                detectedEcosystem:
                    data.search?.detectedEcosystem || "ALL",
                totalResults: data.totalResults || 0,
                matchingEngine:
                    data.matchingEngine || "SICR Semantic Engine"
            });

            setSearched(true);
        } catch (err) {
            console.error("SICR Universal Search Error:", err);

            setResults([]);
            setSearchInfo(null);
            setSearched(true);

            setError(
                err?.message ||
                "Unable to connect to the SICR matching service."
            );
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setSearchInfo(null);
        setError("");
        setSearched(false);
    };

    return (
        <main className="universal-search-page">

            {/* HERO */}
            <section className="search-hero">

                <div className="search-hero-glow search-glow-one"></div>
                <div className="search-hero-glow search-glow-two"></div>

                <div className="search-container">

                    <div className="search-eyebrow">
                        <span className="eyebrow-dot"></span>
                        SICR ECOSYSTEM INTELLIGENCE
                    </div>

                    <h1>
                        Discover the right
                        <span> ecosystem connection.</span>
                    </h1>

                    <p className="search-subtitle">
                        Search across startups, investors, mentors, corporates,
                        partnerships, sponsors and T-Bridge using AI-powered
                        semantic matching.
                    </p>

                    {/* SEARCH BOX */}
                    <form
                        className="universal-search-box"
                        onSubmit={performSearch}
                    >
                        <div className="search-input-wrapper">

                            <span className="search-icon">
                                ⌕
                            </span>

                            <input
                                type="text"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    if (error) {
                                        setError("");
                                    }
                                }}
                                placeholder="Try “automobile investor”, “AI mentor”, “funding for fintech”..."
                                aria-label="Search SICR ecosystem"
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
                            value={ecosystem}
                            onChange={(event) =>
                                setEcosystem(event.target.value)
                            }
                            aria-label="Select ecosystem"
                        >
                            {ECOSYSTEMS.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="search-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Matching
                                </>
                            ) : (
                                <>
                                    Search
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="search-hints">
                        <span>Try:</span>

                        <button
                            type="button"
                            onClick={() => {
                                setQuery("automobile investor");
                                setEcosystem("ALL");
                            }}
                        >
                            automobile investor
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setQuery("AI mentor");
                                setEcosystem("MENTOR");
                            }}
                        >
                            AI mentor
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setQuery("startup funding");
                                setEcosystem("INVESTOR");
                            }}
                        >
                            startup funding
                        </button>
                    </div>

                </div>
            </section>

            {/* RESULTS */}
            <section className="search-results-section">

                <div className="search-container">

                    {loading && (
                        <div className="search-state-card">

                            <div className="ai-loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <h3>Finding meaningful connections...</h3>

                            <p>
                                SICR is comparing your search with ecosystem
                                profiles using semantic AI.
                            </p>

                            <div className="loading-line">
                                <div></div>
                            </div>

                        </div>
                    )}

                    {!loading && error && (
                        <div className="search-error-card">

                            <div className="error-symbol">!</div>

                            <div>
                                <h3>Search could not be completed</h3>
                                <p>{error}</p>

                                <button
                                    type="button"
                                    onClick={performSearch}
                                    className="retry-button"
                                >
                                    Try Again
                                </button>
                            </div>

                        </div>
                    )}

                    {!loading &&
                        !error &&
                        searched &&
                        searchInfo && (
                            <>
                                <div className="results-header">

                                    <div>
                                        <div className="results-label">
                                            SEARCH RESULTS
                                        </div>

                                        <h2>
                                            Connections for{" "}
                                            <span>
                                                “{searchInfo.query}”
                                            </span>
                                        </h2>
                                    </div>

                                    <div className="results-meta">
                                        <strong>
                                            {searchInfo.totalResults}
                                        </strong>
                                        <span>matches found</span>
                                    </div>

                                </div>

                                <div className="ai-status-bar">

                                    <div className="ai-status-left">
                                        <span className="ai-pulse"></span>

                                        <div>
                                            <strong>
                                                AI Semantic Matching
                                            </strong>

                                            <span>
                                                Powered by SICR Universal
                                                Matching Engine
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detected-ecosystem">
                                        Detected:
                                        <strong>
                                            {searchInfo.detectedEcosystem ||
                                                "ALL"}
                                        </strong>
                                    </div>

                                </div>

                                {results.length === 0 ? (
                                    <div className="empty-state">

                                        <div className="empty-icon">
                                            ⌕
                                        </div>

                                        <h3>
                                            No matching profiles found
                                        </h3>

                                        <p>
                                            Try a broader search phrase or
                                            choose “All Ecosystems”.
                                        </p>

                                    </div>
                                ) : (
                                    <div className="results-grid">

                                        {results.map((profile, index) => {

                                            const ecosystemName =
                                                String(
                                                    profile.ecosystem ||
                                                    "OTHER"
                                                ).toUpperCase();

                                            const score = formatScore(
                                                profile.matchScore ??
                                                Number(profile.semanticSimilarity || 0) * 100
                                            );

                                            const tags = getArrayValues(
                                                profile.industries,
                                                profile.industry,
                                                profile.domain,
                                                profile.skills,
                                                profile.expertise,
                                                profile.offers,
                                                profile.offering
                                            ).slice(0, 4);

                                            const reasons =
                                                Array.isArray(
                                                    profile.matchReasons
                                                )
                                                    ? profile.matchReasons
                                                    : [];

                                            return (
                                                <article
                                                    className="profile-result-card"
                                                    key={
                                                        profile.id ||
                                                        `${ecosystemName}-${index}`
                                                    }
                                                >

                                                    <div className="card-top">

                                                        <div className="ecosystem-badge">
                                                            <span>
                                                                {ecosystemIcons[
                                                                    ecosystemName
                                                                ] || "◎"}
                                                            </span>

                                                            {ecosystemName}
                                                        </div>

                                                        <div className="rank-number">
                                                            #{index + 1}
                                                        </div>

                                                    </div>

                                                    <div className="profile-main">

                                                        <div className="profile-avatar">
                                                            {getResultName(
                                                                profile
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="profile-heading">
                                                            <h3>
                                                                {getResultName(
                                                                    profile
                                                                )}
                                                            </h3>

                                                            <p>
                                                                {profile.title ||
                                                                    profile.role ||
                                                                    ecosystemName}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <p className="profile-description">
                                                        {getResultDescription(
                                                            profile
                                                        ).slice(0, 190)}
                                                        {getResultDescription(
                                                            profile
                                                        ).length > 190
                                                            ? "..."
                                                            : ""}
                                                    </p>

                                                    {tags.length > 0 && (
                                                        <div className="profile-tags">
                                                            {tags.map(
                                                                (tag, tagIndex) => (
                                                                    <span
                                                                        key={`${tag}-${tagIndex}`}
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="match-section">

                                                        <div className="match-heading">
                                                            <span>
                                                                Semantic Match
                                                            </span>

                                                            <strong>
                                                                {score}%
                                                            </strong>
                                                        </div>

                                                        <div className="match-track">
                                                            <div
                                                                className="match-fill"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        Math.max(
                                                                            Number(
                                                                                score
                                                                            ) || 0,
                                                                            0
                                                                        ),
                                                                        100
                                                                    )}%`
                                                                }}
                                                            ></div>
                                                        </div>

                                                    </div>

                                                    {reasons.length > 0 && (
                                                        <div className="match-reasons">

                                                            <span className="reason-label">
                                                                WHY THIS MATCH
                                                            </span>

                                                            {reasons
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        reason,
                                                                        reasonIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                reasonIndex
                                                                            }
                                                                            className="reason-item"
                                                                        >
                                                                            <span>
                                                                                ✓
                                                                            </span>
                                                                            {
                                                                                reason
                                                                            }
                                                                        </div>
                                                                    )
                                                                )}

                                                        </div>
                                                    )}

                                                    <div className="card-footer">

                                                        <button
                                                            type="button"
                                                            className="view-profile-button"
                                                        >
                                                            View Profile
                                                            <span>→</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="connect-button"
                                                        >
                                                            Connect
                                                        </button>

                                                    </div>

                                                </article>
                                            );
                                        })}

                                    </div>
                                )}
                            </>
                        )}

                    {!loading && !searched && !error && (
                        <div className="initial-search-state">

                            <div className="initial-orbit">
                                <div className="orbit-core">
                                    SICR
                                </div>
                            </div>

                            <h2>
                                One search.
                                <span> Every ecosystem.</span>
                            </h2>

                            <p>
                                Describe what you are looking for and SICR
                                will discover semantically relevant profiles
                                across the entire ecosystem.
                            </p>

                            <div className="ecosystem-pills">

                                {ECOSYSTEMS.slice(1).map((item) => (
                                    <button
                                        type="button"
                                        key={item.value}
                                        onClick={() => {
                                            setEcosystem(item.value);
                                            setQuery(
                                                item.value === "INVESTOR"
                                                    ? "startup funding investor"
                                                    : `${item.label} opportunities`
                                            );
                                        }}
                                    >
                                        <span>
                                            {ecosystemIcons[item.value]}
                                        </span>
                                        {item.label}
                                    </button>
                                ))}

                            </div>

                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}

export default UniversalSearch;