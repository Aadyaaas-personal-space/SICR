const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/ideas`;

const ECOSYSTEM_TOKEN_KEYS = {
    STARTUP: "startupToken",
    INVESTOR: "investorFunderToken",
    MENTOR: "mentorToken",
    CORPORATE: "corporateToken",
    PARTNERSHIP: "partnershipToken",
    SPONSORSHIP: "sponsorshipToken",
    TBRIDGE: "tBridgeToken",
};

function getIdeasToken() {
    const activeEcosystem = (
        localStorage.getItem("activeEcosystem") || ""
    ).toUpperCase();

    const tokenKey = ECOSYSTEM_TOKEN_KEYS[activeEcosystem];

    if (tokenKey) {
        const token = localStorage.getItem(tokenKey);

        if (token) {
            return token;
        }
    }

    // Fallback for SICR sessions that have only one ecosystem token.
    for (const key of Object.values(ECOSYSTEM_TOKEN_KEYS)) {
        const token = localStorage.getItem(key);

        if (token) {
            return token;
        }
    }

    return (
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        null
    );
}

async function requestIdeas(endpoint = "", options = {}) {
    const token = getIdeasToken();

    if (!token) {
        throw new Error("Please log in to access SICR Ideas.");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message || "The ideas request could not be completed."
        );
    }

    return data;
}

export async function getIdeas({ search = "", category = "", mine = false } = {}) {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category && category !== "All Ideas") {
        params.set("category", category);
    }
    if (mine) params.set("mine", "true");

    const queryString = params.toString();

    return requestIdeas(
        queryString ? `?${queryString}` : ""
    );
}

export async function createIdea(ideaData) {
    return requestIdeas("", {
        method: "POST",
        body: JSON.stringify(ideaData),
    });
}

export async function updateIdea(ideaId, ideaData) {
    return requestIdeas(`/${encodeURIComponent(ideaId)}`, {
        method: "PATCH",
        body: JSON.stringify(ideaData),
    });
}

export async function deleteIdea(ideaId) {
    return requestIdeas(`/${encodeURIComponent(ideaId)}`, {
        method: "DELETE",
    });
}

export async function getIdeaById(ideaId) {
    return requestIdeas(`/${encodeURIComponent(ideaId)}`);
}

// Search public ideas across all SICR ecosystems.
// The existing getIdeas() function remains unchanged and owner-scoped.
export async function getDiscoverIdeas({
    search = "",
    category = "",
} = {}) {
    const params = new URLSearchParams();

    if (search.trim()) {
        params.set("search", search.trim());
    }

    if (category && category !== "All Ideas") {
        params.set("category", category);
    }

    const queryString = params.toString();

    return requestIdeas(
        `/discover${queryString ? `?${queryString}` : ""}`
    );
}
