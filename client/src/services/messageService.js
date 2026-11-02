import { getAuthToken } from "../utils/authIdentity";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

// =====================================================
// GET AUTH HEADERS
// =====================================================

function getAuthHeaders(type) {
    const token = getAuthToken(type);

    return {
        "Content-Type": "application/json",

        ...(token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {}),
    };
}

// =====================================================
// HANDLE API RESPONSE
// =====================================================

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            `Request failed (${response.status})`
        );
    }

    return data;
}

// =====================================================
// GET CONVERSATIONS
// GET /api/messages/conversations
// =====================================================

export const getConversations = async (type) => {
    const response = await fetch(
        `${API_BASE_URL}/api/messages/conversations`,
        {
            method: "GET",
            headers: getAuthHeaders(type),
        }
    );

    return handleResponse(response);
};

// =====================================================
// GET CONVERSATION MESSAGES
// GET /api/messages/:peerType/:peerId
// =====================================================

export const getMessages = async (
    peerType,
    peerId,
    type
) => {
    const response = await fetch(
        `${API_BASE_URL}/api/messages/${encodeURIComponent(
            peerType
        )}/${encodeURIComponent(peerId)}`,
        {
            method: "GET",
            headers: getAuthHeaders(type),
        }
    );

    return handleResponse(response);
};

// =====================================================
// SEND MESSAGE
// POST /api/messages/:peerType/:peerId
// =====================================================

export const sendMessage = async (
    peerType,
    peerId,
    content,
    type
) => {
    const response = await fetch(
        `${API_BASE_URL}/api/messages/${encodeURIComponent(
            peerType
        )}/${encodeURIComponent(peerId)}`,
        {
            method: "POST",
            headers: getAuthHeaders(type),

            body: JSON.stringify({
                content,
            }),
        }
    );

    return handleResponse(response);
};