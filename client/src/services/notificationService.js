import { getAuthToken } from "../utils/authIdentity";

const API_BASE_URL =
    "http://localhost:5000/api/notifications";

const getAuthHeaders = (type) => {
    const token = getAuthToken(type);

    return {
        "Content-Type": "application/json",
        ...(token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {}),
    };
};

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

export const getNotifications = async (type) => {
    const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: getAuthHeaders(type),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to fetch notifications"
        );
    }

    return result;
};

// =====================================================
// GET MY NOTIFICATIONS
// Used by StartupNotifications.jsx
// =====================================================

export const getMyNotifications = async (type) => {
    return getNotifications(type);
};

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// Used by NotificationBell.jsx
// =====================================================

export const getUnreadNotificationCount = async (
    type
) => {
    const result = await getNotifications(type);

    return result.unreadCount || 0;
};

// =====================================================
// MARK SINGLE NOTIFICATION AS READ
// =====================================================

export const markNotificationAsRead = async (
    notificationId,
    type
) => {
    const response = await fetch(
        `${API_BASE_URL}/${notificationId}/read`,
        {
            method: "PATCH",
            headers: getAuthHeaders(type),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to mark notification as read"
        );
    }

    return result;
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

export const markAllNotificationsAsRead = async (
    type
) => {
    const response = await fetch(
        `${API_BASE_URL}/read-all`,
        {
            method: "PATCH",
            headers: getAuthHeaders(type),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Failed to mark all notifications as read"
        );
    }

    return result;
};