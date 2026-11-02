
import { useCallback, useEffect, useMemo, useState } from "react";
import { getLoggedInIdentity } from "../../utils/authIdentity";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../services/notificationService";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Notifications.css";

const getKind = (type = "") => {
    if (type.startsWith("CONNECTION_")) return "connections";
    if (type.startsWith("MESSAGE_") || type === "MESSAGE") return "messages";
    return "other";
};

const getVisual = (type = "") => {
    switch (type) {
        case "CONNECTION_REQUEST":
            return { icon: "🤝", label: "Connection request", color: "connection" };
        case "CONNECTION_ACCEPTED":
            return { icon: "✅", label: "Connection accepted", color: "success" };
        case "CONNECTION_REJECTED":
            return { icon: "🚫", label: "Connection update", color: "warning" };
        case "CONNECTION_CANCELLED":
            return { icon: "🔄", label: "Connection cancelled", color: "neutral" };
        case "CONNECTION_REMOVED":
            return { icon: "🔗", label: "Connection removed", color: "neutral" };
        case "MESSAGE_RECEIVED":
        case "MESSAGE":
            return { icon: "💬", label: "New message", color: "message" };
        default:
            return { icon: "🔔", label: "SICR update", color: "neutral" };
    }
};

const formatDate = (date) => {
    if (!date) return "";

    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return "";

    const elapsed = Math.max(0, Date.now() - value.getTime());
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(elapsed / 3600000);
    const days = Math.floor(elapsed / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const FILTERS = [
    { id: "all", label: "All activity", icon: "📋" },
    { id: "unread", label: "Unread", icon: "🔵" },
    { id: "read", label: "Read", icon: "✓" },
    { id: "connections", label: "Connections", icon: "🤝" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "other", label: "Other", icon: "🔔" },
];

function Notifications() {
    const identity = getLoggedInIdentity();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [busy, setBusy] = useState(false);

    const loadNotifications = useCallback(async (showLoader = false) => {
        if (!identity) {
            setError("Please log in to view your notifications.");
            setNotifications([]);
            setLoading(false);
            return;
        }

        try {
            if (showLoader) setLoading(true);
            setError("");

            const result = await getNotifications(identity.type);
            setNotifications(result.notifications || []);
        } catch (err) {
            setError(err.message || "Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    }, [identity?.type]);

    useEffect(() => {
        loadNotifications(true);

        const interval = setInterval(() => {
            loadNotifications(false);
        }, 30000);

        return () => clearInterval(interval);
    }, [loadNotifications]);

    const unreadCount = notifications.filter((item) => !item.isRead).length;
    const readCount = notifications.length - unreadCount;

    const counts = useMemo(() => {
        const result = {
            all: notifications.length,
            unread: 0,
            read: 0,
            connections: 0,
            messages: 0,
            other: 0,
        };

        notifications.forEach((item) => {
            if (item.isRead) result.read += 1;
            else result.unread += 1;

            result[getKind(item.type)] += 1;
        });

        return result;
    }, [notifications]);

    const visibleNotifications = useMemo(() => {
        switch (filter) {
            case "unread":
                return notifications.filter((item) => !item.isRead);
            case "read":
                return notifications.filter((item) => item.isRead);
            case "connections":
                return notifications.filter(
                    (item) => getKind(item.type) === "connections"
                );
            case "messages":
                return notifications.filter(
                    (item) => getKind(item.type) === "messages"
                );
            case "other":
                return notifications.filter(
                    (item) => getKind(item.type) === "other"
                );
            default:
                return notifications;
        }
    }, [notifications, filter]);

    const handleRead = async (notification) => {
        if (notification.isRead || !identity) return;

        try {
            await markNotificationAsRead(notification._id, identity.type);

            setNotifications((current) =>
                current.map((item) =>
                    item._id === notification._id
                        ? { ...item, isRead: true, readAt: new Date() }
                        : item
                )
            );
        } catch (err) {
            setError(err.message || "Could not update notification.");
        }
    };

    const handleMarkAllRead = async () => {
        if (!identity || unreadCount === 0 || busy) return;

        try {
            setBusy(true);
            await markAllNotificationsAsRead(identity.type);

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    isRead: true,
                    readAt: item.readAt || new Date(),
                }))
            );
        } catch (err) {
            setError(err.message || "Could not mark notifications as read.");
        } finally {
            setBusy(false);
        }
    };

    const activeFilter = FILTERS.find((item) => item.id === filter);

    return (
        <div className="notifications-layout">
            <Sidebar />

            <main className="notifications-page">
                <div className="notifications-container">
                    <header className="notifications-header">
                        <div>
                            <span className="notifications-eyebrow">
                                SICR WORKSPACE
                            </span>
                            <h1>Notifications</h1>
                            <p>
                                Stay updated with your connections, messages and activity.
                            </p>
                        </div>

                        
<div className="notifications-header-actions">
    <span className="notifications-live">
        <span className="live-dot" />
        Auto-refresh: 30 sec
    </span>

    <button
        type="button"
        className="refresh-notifications"
        onClick={() => loadNotifications(true)}
        disabled={loading}
    >
        ↻ Refresh
    </button>

    <label className="notification-filter-control">
        <span>Filter</span>
        <select
            className="notification-filter-select"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter notifications"
        >
            {FILTERS.map((item) => (
                <option key={item.id} value={item.id}>
                    {item.label} ({counts[item.id]})
                </option>
            ))}
        </select>
    </label>
</div>

                    </header>

                    {error && (
                        <div className="notification-error" role="alert">
                            <span>{error}</span>
                            <button
                                type="button"
                                onClick={() => loadNotifications(true)}
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    <section className="notification-overview">
                        <article className="overview-card overview-total">
                            <span className="overview-icon">📋</span>
                            <div>
                                <span>Total activity</span>
                                <strong>{notifications.length}</strong>
                                <small>All notifications</small>
                            </div>
                        </article>

                        <article className="overview-card overview-unread">
                            <span className="overview-icon">🔵</span>
                            <div>
                                <span>Unread</span>
                                <strong>{unreadCount}</strong>
                                <small>Needs your attention</small>
                            </div>
                        </article>

                        <article className="overview-card overview-read">
                            <span className="overview-icon">✓</span>
                            <div>
                                <span>Read</span>
                                <strong>{readCount}</strong>
                                <small>Already viewed</small>
                            </div>
                        </article>

                        <article className="overview-card overview-connections">
                            <span className="overview-icon">🤝</span>
                            <div>
                                <span>Connections</span>
                                <strong>{counts.connections}</strong>
                                <small>Network updates</small>
                            </div>
                        </article>
                    </section>

                    <section className="notifications-workspace">

                        <section className="notifications-feed">
                            <div className="feed-header">
                                <div>
                                    <span className="feed-eyebrow">
                                        YOUR ACTIVITY
                                    </span>
                                    <h2>{activeFilter?.label || "All activity"}</h2>
                                    <p>
                                        {filter === "unread"
                                            ? "Notifications you haven't read yet."
                                            : filter === "read"
                                            ? "Notifications you've already viewed."
                                            : filter === "connections"
                                            ? "Requests and updates from your network."
                                            : filter === "messages"
                                            ? "Updates related to your conversations."
                                            : filter === "other"
                                            ? "Other updates from SICR."
                                            : "Your latest notifications in one place."}
                                    </p>
                                </div>

                                <span className="feed-total">
                                    {visibleNotifications.length}{" "}
                                    {visibleNotifications.length === 1
                                        ? "notification"
                                        : "notifications"}
                                </span>
                            </div>

                            {loading ? (
                                <div className="notification-empty">
                                    <div className="notification-loader" />
                                    <h3>Loading activity</h3>
                                    <p>Getting your latest notifications.</p>
                                </div>
                            ) : visibleNotifications.length === 0 ? (
                                <div className="notification-empty">
                                    <div className="empty-icon">
                                        {activeFilter?.icon || "🔔"}
                                    </div>
                                    <h3>
                                        {filter === "unread"
                                            ? "You're all caught up!"
                                            : filter === "read"
                                            ? "No read notifications"
                                            : filter === "connections"
                                            ? "No connection updates yet"
                                            : filter === "messages"
                                            ? "No message notifications yet"
                                            : filter === "other"
                                            ? "No other notifications"
                                            : "No notifications yet"}
                                    </h3>
                                    <p>
                                        {filter === "unread"
                                            ? "New unread activity will appear here."
                                            : "When activity arrives, it will appear here."}
                                    </p>
                                    {filter !== "all" && (
                                        <button
                                            type="button"
                                            className="empty-reset-btn"
                                            onClick={() => setFilter("all")}
                                        >
                                            View all activity
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="notification-list">
                                    {visibleNotifications.map((notification) => {
                                        const visual = getVisual(notification.type);

                                        return (
                                            <article
                                                key={notification._id}
                                                className={`notification-card ${
                                                    notification.isRead ? "read" : "unread"
                                                }`}
                                            >
                                                <div
                                                    className={`notification-icon ${visual.color}`}
                                                >
                                                    {visual.icon}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="notification-card-main"
                                                    onClick={() => handleRead(notification)}
                                                    aria-label={`Mark ${
                                                        notification.title || visual.label
                                                    } as read`}
                                                >
                                                    <div className="notification-title-row">
                                                        <span className="notification-category">
                                                            {visual.label}
                                                        </span>

                                                        {!notification.isRead && (
                                                            <span
                                                                className="unread-dot"
                                                                title="Unread"
                                                            />
                                                        )}
                                                    </div>

                                                    <h3>
                                                        {notification.title || visual.label}
                                                    </h3>

                                                    <p>
                                                        {notification.message ||
                                                            "You have a new update."}
                                                    </p>

                                                    <span className="notification-time">
                                                        {formatDate(notification.createdAt)}
                                                    </span>
                                                </button>

                                                <div className="notification-card-actions">
                                                    {!notification.isRead ? (
                                                        <button
                                                            type="button"
                                                            className="notification-read-action"
                                                            onClick={() =>
                                                                handleRead(notification)
                                                            }
                                                        >
                                                            Mark read
                                                        </button>
                                                    ) : (
                                                        <span className="read-status">
                                                            ✓ Read
                                                        </span>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </section>

                    <footer className="notifications-footer">
                        <span>🔒 Your SICR activity is private to your account.</span>
                        <span>Updates automatically every 30 seconds.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default Notifications;
