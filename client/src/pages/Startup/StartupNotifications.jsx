import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../services/notificationService";

import {
    acceptConnectionRequest,
    rejectConnectionRequest,
} from "../../services/connectionService";

import { getLoggedInIdentity } from "../../utils/authIdentity";

import "./StartupNotifications.css";

function StartupNotifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState("");

    const identity = getLoggedInIdentity();

    const userType = identity?.type;

    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            if (!userType) {
                setError("Unable to identify your account.");
                return;
            }

            const result = await getMyNotifications(userType);

            setNotifications(result.notifications || []);
        } catch (error) {
            console.error("Notifications Error:", error);
            setError(
                error.message ||
                "Failed to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [userType]);

    // =====================================================
    // MARK SINGLE NOTIFICATION READ
    // =====================================================

    const handleMarkRead = async (notification) => {
        try {
            if (
                notification.isRead ||
                !userType
            ) {
                return;
            }

            await markNotificationAsRead(
                notification._id,
                userType
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? {
                            ...item,
                            isRead: true,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Mark Read Error:",
                error
            );
        }
    };

    // =====================================================
    // MARK ALL READ
    // =====================================================

    const handleMarkAllRead = async () => {
        try {
            if (!userType) {
                return;
            }

            await markAllNotificationsAsRead(
                userType
            );

            setNotifications((previous) =>
                previous.map((item) => ({
                    ...item,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error(
                "Mark All Read Error:",
                error
            );
        }
    };

    // =====================================================
    // ACCEPT CONNECTION
    // =====================================================

    const handleAccept = async (notification) => {
        if (!notification.connectionId) {
            return;
        }

        try {
            setProcessingId(notification._id);
            setError("");

            await acceptConnectionRequest(
                notification.connectionId,
                userType
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? {
                            ...item,
                            type: "CONNECTION_ACCEPTED",
                            title: "Connection Request Accepted",
                            message:
                                "You accepted this connection request.",
                            isRead: true,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Accept Connection Error:",
                error
            );

            setError(
                error.message ||
                "Failed to accept connection request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // =====================================================
    // REJECT CONNECTION
    // =====================================================

    const handleReject = async (notification) => {
        if (!notification.connectionId) {
            return;
        }

        try {
            setProcessingId(notification._id);
            setError("");

            await rejectConnectionRequest(
                notification.connectionId,
                userType
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? {
                            ...item,
                            type: "CONNECTION_REJECTED",
                            title: "Connection Request Rejected",
                            message:
                                "You rejected this connection request.",
                            isRead: true,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Reject Connection Error:",
                error
            );

            setError(
                error.message ||
                "Failed to reject connection request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // =====================================================
    // HELPERS
    // =====================================================

    const getInitial = (type) => {
        if (!type) return "?";

        return type
            .replace("_", " ")
            .charAt(0);
    };

    const getTypeLabel = (type) => {
        if (!type) {
            return "SICR User";
        }

        return type
            .replace("_", " ")
            .replace(
                /\b\w/g,
                (letter) => letter.toUpperCase()
            );
    };

    const formatTime = (date) => {
        if (!date) return "";

        const notificationDate =
            new Date(date);

        if (
            Number.isNaN(
                notificationDate.getTime()
            )
        ) {
            return "";
        }

        const now = new Date();

        const difference =
            now.getTime() -
            notificationDate.getTime();

        const minutes =
            Math.floor(
                difference / 60000
            );

        if (minutes < 1) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes} min ago`;
        }

        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} hr ago`;
        }

        const days =
            Math.floor(hours / 24);

        if (days < 7) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        return notificationDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const unreadCount =
        notifications.filter(
            (item) => !item.isRead
        ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="startup-notifications-page">

            {/* HEADER */}

            <div className="notifications-header">

                <div>
                    <div className="notifications-eyebrow">
                        SICR NETWORK
                    </div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Manage connection requests
                        and stay updated with your
                        ecosystem network.
                    </p>
                </div>

                <div className="notifications-header-actions">

                    {unreadCount > 0 && (
                        <button
                            className="mark-all-btn"
                            onClick={handleMarkAllRead}
                        >
                            Mark all as read
                        </button>
                    )}

                    <button
                        className="refresh-btn"
                        onClick={loadNotifications}
                    >
                        ↻
                    </button>

                </div>

            </div>

            {/* SUMMARY */}

            <div className="notification-summary">

                <div className="summary-card">

                    <div className="summary-icon">
                        ♧
                    </div>

                    <div>
                        <span>
                            Total
                        </span>

                        <strong>
                            {notifications.length}
                        </strong>
                    </div>

                </div>

                <div className="summary-card">

                    <div className="summary-icon unread">
                        ●
                    </div>

                    <div>
                        <span>
                            Unread
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>
                    </div>

                </div>

                <div className="summary-card">

                    <div className="summary-icon connection">
                        ↗
                    </div>

                    <div>
                        <span>
                            Connection Requests
                        </span>

                        <strong>
                            {
                                notifications.filter(
                                    (item) =>
                                        item.type ===
                                        "CONNECTION_REQUEST"
                                ).length
                            }
                        </strong>
                    </div>

                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="notification-error">
                    <span>!</span>
                    {error}
                </div>
            )}

            {/* CONTENT */}

            <div className="notifications-card">

                <div className="notifications-card-header">

                    <div>
                        <h2>
                            Recent Activity
                        </h2>

                        <p>
                            Connection activity from
                            across SICR ecosystems
                        </p>
                    </div>

                    {notifications.length > 0 && (
                        <span className="notification-count">
                            {notifications.length}{" "}
                            notification
                            {notifications.length !== 1
                                ? "s"
                                : ""}
                        </span>
                    )}

                </div>

                {/* LOADING */}

                {loading ? (
                    <div className="notifications-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading notifications...
                        </p>

                    </div>
                ) : notifications.length === 0 ? (

                    /* EMPTY */

                    <div className="notifications-empty">

                        <div className="empty-icon">
                            ♢
                        </div>

                        <h3>
                            No notifications yet
                        </h3>

                        <p>
                            Connection requests and
                            network activity will
                            appear here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/search")
                            }
                        >
                            Discover People
                        </button>

                    </div>

                ) : (

                    /* LIST */

                    <div className="notification-list">

                        {notifications.map(
                            (notification) => {

                                const isRequest =
                                    notification.type ===
                                    "CONNECTION_REQUEST";

                                const isAccepted =
                                    notification.type ===
                                    "CONNECTION_ACCEPTED";

                                const isRejected =
                                    notification.type ===
                                    "CONNECTION_REJECTED";

                                const isProcessing =
                                    processingId ===
                                    notification._id;

                                return (
                                    <div
                                        key={
                                            notification._id
                                        }
                                        className={`notification-item ${
                                            !notification.isRead
                                                ? "unread"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleMarkRead(
                                                notification
                                            )
                                        }
                                    >

                                        {/* AVATAR */}

                                        <div
                                            className={`notification-avatar ${
                                                isRequest
                                                    ? "request"
                                                    : ""
                                            }`}
                                        >
                                            {getInitial(
                                                notification.senderType
                                            )}
                                        </div>

                                        {/* CONTENT */}

                                        <div className="notification-content">

                                            <div className="notification-top">

                                                <div className="notification-title-row">

                                                    <h3>
                                                        {
                                                            notification.title
                                                        }
                                                    </h3>

                                                    {!notification.isRead && (
                                                        <span className="unread-dot"></span>
                                                    )}

                                                </div>

                                                <span className="notification-time">
                                                    {formatTime(
                                                        notification.createdAt
                                                    )}
                                                </span>

                                            </div>

                                            <div className="notification-source">

                                                <span className="source-badge">
                                                    {
                                                        getTypeLabel(
                                                            notification.senderType
                                                        )
                                                    }
                                                </span>

                                            </div>

                                            <p>
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            {/* ACTIONS */}

                                            {isRequest && (
                                                <div
                                                    className="notification-actions"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >

                                                    <button
                                                        className="accept-btn"
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        onClick={() =>
                                                            handleAccept(
                                                                notification
                                                            )
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? "Processing..."
                                                            : "Accept"}
                                                    </button>

                                                    <button
                                                        className="reject-btn"
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        onClick={() =>
                                                            handleReject(
                                                                notification
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                </div>
                                            )}

                                            {isAccepted && (
                                                <div className="status-message accepted">
                                                    ✓ You are now connected
                                                </div>
                                            )}

                                            {isRejected && (
                                                <div className="status-message rejected">
                                                    Connection request was rejected
                                                </div>
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default StartupNotifications;