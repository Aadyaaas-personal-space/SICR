import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StartupSidebar.css";

import { getLoggedInIdentity } from "../../utils/authIdentity";
import { getMyNotifications } from "../../services/notificationService";

function StartupSidebar() {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [unreadNotifications, setUnreadNotifications] =
        useState(0);

    const goTo = (path) => {
        navigate(path);
    };

    // =====================================================
    // LOAD UNREAD NOTIFICATION COUNT
    // =====================================================

    useEffect(() => {
        const loadNotificationCount = async () => {
            try {
                const identity = getLoggedInIdentity();

                if (!identity?.type) {
                    return;
                }

                const result = await getMyNotifications(
                    identity.type
                );

                setUnreadNotifications(
                    result.unreadCount || 0
                );
            } catch (error) {
                console.error(
                    "Notification Count Error:",
                    error
                );
            }
        };

        loadNotificationCount();

        // Refresh notification count every 30 seconds
        const interval = setInterval(
            loadNotificationCount,
            30000
        );

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* =================================================
                SIDEBAR TOGGLE
            ================================================= */}

            <button
                className="sidebar-toggle"
                onClick={() =>
                    setCollapsed(!collapsed)
                }
                title={
                    collapsed
                        ? "Open Menu"
                        : "Close Menu"
                }
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`startup-sidebar ${
                    collapsed
                        ? "sidebar-collapsed"
                        : ""
                }`}
            >
                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        S
                    </div>

                    <div className="sidebar-brand-text">
                        <strong>SICR</strong>

                        <span>
                            Startup Ecosystem
                        </span>
                    </div>
                </div>

                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <div className="sidebar-navigation">

                    <div className="sidebar-section-label">
                        MAIN
                    </div>

                    {/* Dashboard */}

                    <button
                        className="sidebar-link active"
                        onClick={() =>
                            goTo(
                                "/startup/dashboard"
                            )
                        }
                        title="Dashboard"
                    >
                        <span className="sidebar-icon">
                            ▦
                        </span>

                        <span className="sidebar-link-text">
                            Dashboard
                        </span>
                    </button>

                    {/* My Profile */}

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            goTo(
                                "/startup/profile"
                            )
                        }
                        title="My Profile"
                    >
                        <span className="sidebar-icon">
                            ◯
                        </span>

                        <span className="sidebar-link-text">
                            My Profile
                        </span>
                    </button>

                    {/* Notifications */}

                    <button
                        className="sidebar-link notification-sidebar-link"
                        onClick={() =>
                            goTo(
                                "/startup/notifications"
                            )
                        }
                        title="Notifications"
                    >
                        <span className="sidebar-icon">
                            ♧
                        </span>

                        <span className="sidebar-link-text">
                            Notifications
                        </span>

                        {unreadNotifications > 0 && (
                            <span className="notification-badge">
                                {unreadNotifications > 99
                                    ? "99+"
                                    : unreadNotifications}
                            </span>
                        )}
                    </button>

                    {/* Ecosystem */}

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            goTo("/ecosystem")
                        }
                        title="Ecosystem"
                    >
                        <span className="sidebar-icon">
                            ◎
                        </span>

                        <span className="sidebar-link-text">
                            Ecosystem
                        </span>
                    </button>

                    {/* Career Roadmap */}

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            goTo("/career")
                        }
                        title="Career Roadmap"
                    >
                        <span className="sidebar-icon">
                            ◇
                        </span>

                        <span className="sidebar-link-text">
                            Career Roadmap
                        </span>
                    </button>

                    {/* Discover */}

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            goTo("/search")
                        }
                        title="Discover"
                    >
                        <span className="sidebar-icon">
                            ⌕
                        </span>

                        <span className="sidebar-link-text">
                            Discover
                        </span>
                    </button>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="sidebar-footer">

                    <div className="sidebar-footer-line"></div>

                    <div className="sidebar-profile">

                        <div className="sidebar-avatar">
                            S
                        </div>

                        <div className="sidebar-profile-info">

                            <strong>
                                Startup Account
                            </strong>

                            <span>
                                Founder
                            </span>

                        </div>

                    </div>

                </div>
            </aside>
        </>
    );
}

export default StartupSidebar;