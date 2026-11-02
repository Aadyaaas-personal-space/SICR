
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getLoggedInIdentity } from "../../utils/authIdentity";
import {
    getNotifications,
    markNotificationAsRead,
} from "../../services/notificationService";

import "./NotificationBell.css";

function NotificationBell({ compact = false }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const identity = getLoggedInIdentity();
    const identityType = identity?.type;

    const loadNotifications = useCallback(async () => {
        if (!identityType) return;

        try {
            const result = await getNotifications(identityType);

            setNotifications(result.notifications || []);
            setUnreadCount(result.unreadCount || 0);
        } catch (error) {
            console.error("Notification bell error:", error);
        }
    }, [identityType]);

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(
                    notification._id,
                    identityType
                );

                setNotifications((current) =>
                    current.map((item) =>
                        item._id === notification._id
                            ? { ...item, isRead: true }
                            : item
                    )
                );

                setUnreadCount((count) => Math.max(0, count - 1));
            }
        } catch (error) {
            console.error("Notification read error:", error);
        }
    };

    const getIcon = (type) => {
        if (type?.startsWith("CONNECTION_")) return "\u{1F91D}";
        if (type?.startsWith("MESSAGE_")) return "\u{1F4AC}";
        return "\u{1F514}";
    };

    const formatTime = (date) => {
        const timestamp = new Date(date).getTime();

        if (Number.isNaN(timestamp)) return "";

        const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return new Date(date).toLocaleDateString("en-IN");
    };

    if (compact) {
        return (
            <span
                className="sidebar-notification-indicator"
                title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
                aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
            >
                <span className="sidebar-notification-bell">
                    {"\u{1F514}"}
                </span>

                {unreadCount > 0 && (
                    <span className="sidebar-notification-count">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </span>
        );
    }

    return (
        <div className="notification-bell-wrapper">
            <button
                type="button"
                className={`notification-bell ${open ? "active" : ""}`}
                onClick={() => setOpen((current) => !current)}
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                aria-expanded={open}
            >
                <span className="bell-icon">{"\u{1F514}"}</span>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <button
                        type="button"
                        className="notification-backdrop"
                        aria-label="Close notifications"
                        onClick={() => setOpen(false)}
                    />

                    <div className="notification-dropdown">
                        <div className="notification-dropdown-header">
                            <div>
                                <span>SICR</span>
                                <h3>Notifications</h3>
                            </div>

                            {unreadCount > 0 && (
                                <strong>{unreadCount} new</strong>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="notification-dropdown-empty">
                                <div>{"\u{1F514}"}</div>
                                <p>No notifications yet</p>
                                <span>New activity will appear here.</span>
                            </div>
                        ) : (
                            <div className="notification-dropdown-list">
                                {notifications.slice(0, 5).map((notification) => (
                                    <button
                                        type="button"
                                        key={notification._id}
                                        className={`notification-preview ${
                                            notification.isRead ? "read" : "unread"
                                        }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <span className="preview-icon">
                                            {getIcon(notification.type)}
                                        </span>

                                        <span className="preview-content">
                                            <strong>{notification.title}</strong>
                                            <span>{notification.message}</span>
                                            <small>{formatTime(notification.createdAt)}</small>
                                        </span>

                                        {!notification.isRead && (
                                            <span className="preview-dot" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Link
                            to="/startup/notifications"
                            className="view-all-notifications"
                            onClick={() => setOpen(false)}
                        >
                            View all notifications
                            <span>→</span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationBell;
