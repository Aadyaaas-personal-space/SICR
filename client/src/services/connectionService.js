import { getAuthToken } from "../utils/authIdentity";

const API_BASE_URL = "http://localhost:5000/api/connections";

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
// SEND CONNECTION REQUEST
// =====================================================

export const sendConnectionRequest = async ({
    senderType,
    senderId,
    receiverType,
    receiverId,
    message = "",
}) => {
    const response = await fetch(
        `${API_BASE_URL}/send`,
        {
            method: "POST",
            headers: getAuthHeaders(senderType),
            body: JSON.stringify({
                receiverType,
                receiverId,
                message,
            }),
        }
    );

    const responseText = await response.text();

    console.log("Connection API status:", response.status);
    console.log("Connection API response:", responseText);

    let result = {};

    try {
        result = responseText ? JSON.parse(responseText) : {};
    } catch {
        result = { message: responseText };
    }

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            `Failed to send connection request (${response.status})`
        );
    }

    return result;
};

// =====================================================
// GET RECEIVED REQUESTS
// =====================================================

export const getReceivedRequests = async (type) => {
    const response = await fetch(
        `${API_BASE_URL}/received`,
        {
            headers: getAuthHeaders(type),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to fetch received requests"
        );
    }

    return result;
};

// =====================================================
// GET SENT REQUESTS
// =====================================================

export const getSentRequests = async (type) => {
    const response = await fetch(
        `${API_BASE_URL}/sent`,
        {
            headers: getAuthHeaders(type),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to fetch sent requests"
        );
    }

    return result;
};

// =====================================================
// GET MY CONNECTIONS
// =====================================================

export const getMyConnections = async (type) => {
    const response = await fetch(
        `${API_BASE_URL}/my`,
        {
            headers: getAuthHeaders(type),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to fetch connections"
        );
    }

    return result;
};

// =====================================================
// ACCEPT REQUEST
// =====================================================

export const acceptConnectionRequest = async (
    connectionId,
    receiverType
) => {
    const response = await fetch(
        `${API_BASE_URL}/${connectionId}/accept`,
        {
            method: "PATCH",
            headers: getAuthHeaders(receiverType),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to accept request"
        );
    }

    return result;
};

// =====================================================
// REJECT REQUEST
// =====================================================

export const rejectConnectionRequest = async (
    connectionId,
    receiverType
) => {
    const response = await fetch(
        `${API_BASE_URL}/${connectionId}/reject`,
        {
            method: "PATCH",
            headers: getAuthHeaders(receiverType),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to reject request"
        );
    }

    return result;
};

// =====================================================
// CANCEL REQUEST
// =====================================================

export const cancelConnectionRequest = async (
    connectionId,
    senderType
) => {
    const response = await fetch(
        `${API_BASE_URL}/${connectionId}/cancel`,
        {
            method: "PATCH",
            headers: getAuthHeaders(senderType),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to cancel request"
        );
    }

    return result;
};

// =====================================================
// REMOVE CONNECTION
// =====================================================

export const removeConnection = async (
    connectionId,
    userType
) => {
    const response = await fetch(
        `${API_BASE_URL}/${connectionId}/remove`,
        {
            method: "PATCH",
            headers: getAuthHeaders(userType),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to remove connection"
        );
    }

    return result;
};
