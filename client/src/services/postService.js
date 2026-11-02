
const API_BASE_URL = "http://localhost:5000/api/posts";

const TOKEN_KEYS = {
    STARTUP: "startupToken",
    INVESTOR: "investorFunderToken",
    MENTOR: "mentorToken",
    CORPORATE: "corporateToken",
    PARTNERSHIP: "partnershipToken",
    SPONSORSHIP: "sponsorshipToken",
    TBRIDGE: "tBridgeToken",
};

const getToken = () => {
    const ecosystem = (
        localStorage.getItem("activeEcosystem") || ""
    ).trim().toUpperCase();

    const tokenKey = TOKEN_KEYS[ecosystem];

    if (!tokenKey) {
        throw new Error(
            "Your active SICR ecosystem is missing. Please log in again."
        );
    }

    const token = localStorage.getItem(tokenKey);

    if (!token) {
        throw new Error(
            `Your ${ecosystem} session is missing. Please log in again.`
        );
    }

    return token;
};


const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
};

export const getPosts = () => request(API_BASE_URL);

export const createPost = (postData) =>
    request(API_BASE_URL, {
        method: "POST",
        body: JSON.stringify(postData),
    });

export const editPost = (postId, postData) =>
    request(`${API_BASE_URL}/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(postData),
    });

export const deletePost = (postId) =>
    request(`${API_BASE_URL}/${postId}`, {
        method: "DELETE",
    });

export const toggleLike = (postId) =>
    request(`${API_BASE_URL}/${postId}/like`, {
        method: "PATCH",
    });

export const addComment = (postId, text) =>
    request(`${API_BASE_URL}/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
    });
