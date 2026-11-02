import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import NotificationBell from "../notifications/NotificationBell";

const SIDEBAR_CONFIG = {
    startup: {
        name: "Startup Ecosystem",
        workspace: "Startup Workspace",
        footer: "SICR • Startup Network",
        links: [
            { label: "Dashboard", path: "/startup/dashboard", icon: "⌂", end: true },
            { label: "Ideas", path: "/startup/ideas", icon: "✧" },
            { label: "Post", path: "/startup/post", icon: "✎" },
            { label: "Discover", path: "/search", icon: "⌕" },
            { label: "Ecosystems", path: "/ecosystem", icon: "◈" },
            {
                label: "Notifications",
                path: "/startup/notifications",
                icon: "♢",
                section: "NETWORK",
            },
            { label: "Connections", path: "/connections", icon: "◎" },
            { label: "Messenger", path: "/startup/messenger", icon: "◌" },
            {
                label: "Profile",
                path: "/startup/profile",
                icon: "○",
                section: "ACCOUNT",
            },
        ],
    },

    investor: {
        name: "Investor Ecosystem",
        workspace: "Investor Workspace",
        footer: "SICR • Investor Network",
        links: [
            { label: "Dashboard", path: "/investor/dashboard", icon: "⌂", end: true },
            { label: "Ideas", path: "/investor/ideas", icon: "✧" },
            { label: "Post", path: "/startup/post", icon: "✎" },
            { label: "Discover", path: "/search", icon: "⌕" },
            { label: "Ecosystems", path: "/ecosystem", icon: "◈" },
            {
                label: "Notifications",
                path: "/investor/notifications",
                icon: "♢",
                section: "NETWORK",
            },
            { label: "Connections", path: "/connections", icon: "◎" },
            { label: "Messenger", path: "/investor/messenger", icon: "◌" },
            {
                label: "Profile",
                path: "/investor/profile",
                icon: "○",
                section: "ACCOUNT",
            },
        ],
    },

    mentor: {
        name: "Mentor Ecosystem",
        workspace: "Mentor Workspace",
        footer: "SICR • Mentor Network",
        links: [
            { label: "Dashboard", path: "/mentor/dashboard", icon: "⌂", end: true },
            { label: "Ideas", path: "/mentor/ideas", icon: "✧" },
            { label: "Post", path: "/startup/post", icon: "✎" },
            { label: "Discover", path: "/search", icon: "⌕" },
            { label: "Ecosystems", path: "/ecosystem", icon: "◈" },
            {
                label: "Notifications",
                path: "/mentor/notifications",
                icon: "♢",
                section: "NETWORK",
            },
            { label: "Connections", path: "/connections", icon: "◎" },
            { label: "Messenger", path: "/mentor/messenger", icon: "◌" },
            {
                label: "Profile",
                path: "/mentor/profile",
                icon: "○",
                section: "ACCOUNT",
            },
        ],
    },

    // =====================================================
    // CORPORATE
    // =====================================================

    corporate: {
        name: "Corporate Ecosystem",
        workspace: "Corporate Workspace",
        footer: "SICR • Corporate Network",
        links: [
            {
                label: "Dashboard",
                path: "/corporate/dashboard",
                icon: "⌂",
                end: true,
            },
            {
                label: "Ideas",
                path: "/corporate/ideas",
                icon: "✧",
            },
            {
                label: "Post",
                path: "/startup/post",
                icon: "✎",
            },
            {
                label: "Discover",
                path: "/search",
                icon: "⌕",
            },
            {
                label: "Ecosystems",
                path: "/ecosystem",
                icon: "◈",
            },
            {
                label: "Notifications",
                path: "/corporate/notifications",
                icon: "♢",
                section: "NETWORK",
            },
            {
                label: "Connections",
                path: "/connections",
                icon: "◎",
            },
            {
                label: "Messenger",
                path: "/corporate/messenger",
                icon: "◌",
            },
            {
                label: "Profile",
                path: "/corporate/profile",
                icon: "○",
                section: "ACCOUNT",
            },
        ],
    },
};

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname.toLowerCase();

    // =====================================================
    // SET ACTIVE ECOSYSTEM
    // =====================================================

    useEffect(() => {
        if (pathname.startsWith("/startup")) {
            sessionStorage.setItem(
                "sicrActiveEcosystem",
                "startup"
            );

            localStorage.setItem(
                "activeEcosystem",
                "STARTUP"
            );
        } else if (pathname.startsWith("/investor")) {
            sessionStorage.setItem(
                "sicrActiveEcosystem",
                "investor"
            );

            localStorage.setItem(
                "activeEcosystem",
                "INVESTOR"
            );
        } else if (pathname.startsWith("/mentor")) {
            sessionStorage.setItem(
                "sicrActiveEcosystem",
                "mentor"
            );

            localStorage.setItem(
                "activeEcosystem",
                "MENTOR"
            );
        } else if (pathname.startsWith("/corporate")) {
            sessionStorage.setItem(
                "sicrActiveEcosystem",
                "corporate"
            );

            localStorage.setItem(
                "activeEcosystem",
                "CORPORATE"
            );
        }
    }, [pathname]);

    // =====================================================
    // DETECT ACTIVE ECOSYSTEM
    // =====================================================

    const getEcosystem = () => {
        if (pathname.startsWith("/startup")) {
            return "startup";
        }

        if (pathname.startsWith("/investor")) {
            return "investor";
        }

        if (pathname.startsWith("/mentor")) {
            return "mentor";
        }

        if (pathname.startsWith("/corporate")) {
            return "corporate";
        }

        const active = sessionStorage.getItem(
            "sicrActiveEcosystem"
        );

        if (active && SIDEBAR_CONFIG[active]) {
            return active;
        }

        if (localStorage.getItem("corporateToken")) {
            return "corporate";
        }

        if (localStorage.getItem("investorFunderToken")) {
            return "investor";
        }

        if (localStorage.getItem("mentorToken")) {
            return "mentor";
        }

        return "startup";
    };

    const ecosystem = getEcosystem();
    const config = SIDEBAR_CONFIG[ecosystem];

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        const confirmed = window.confirm(
            "Are you sure you want to logout from your ecosystem?"
        );

        if (!confirmed) return;

        if (ecosystem === "startup") {
            localStorage.removeItem("startupToken");
        }

        if (ecosystem === "investor") {
            localStorage.removeItem(
                "investorFunderToken"
            );
        }

        if (ecosystem === "mentor") {
            localStorage.removeItem("mentorToken");
        }

        if (ecosystem === "corporate") {
            localStorage.removeItem(
                "corporateToken"
            );

            localStorage.removeItem(
                "corporateCompany"
            );
        }

        sessionStorage.removeItem(
            "sicrActiveEcosystem"
        );

        localStorage.removeItem(
            "activeEcosystem"
        );

        navigate("/ecosystem", {
            replace: true,
        });
    };

    let currentSection = "";

    return (
        <aside className="sicr-sidebar">

            {/* BRAND */}

            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <img
                        src="/logo.png"
                        alt="SICR Logo"
                        onError={(e) => {
                            e.currentTarget.style.display =
                                "none";

                            e.currentTarget.parentElement.classList.add(
                                "sidebar-logo-fallback"
                            );
                        }}
                    />

                    <span className="sidebar-logo-text">
                        S
                    </span>
                </div>

                <div className="sidebar-brand-info">
                    <h2>SICR</h2>
                    <span>{config.name}</span>
                </div>
            </div>

            {/* NAVIGATION */}

            <nav className="sidebar-navigation">

                <p className="sidebar-section-title">
                    WORKSPACE
                </p>

                {config.links.map((link) => {
                    const sectionHeading =
                        link.section;

                    const showSection =
                        sectionHeading &&
                        sectionHeading !==
                            currentSection;

                    if (sectionHeading) {
                        currentSection =
                            sectionHeading;
                    }

                    return (
                        <div key={link.label}>

                            {showSection && (
                                <p className="sidebar-section-title sidebar-section-spaced">
                                    {sectionHeading}
                                </p>
                            )}

                            <NavLink
                                to={link.path}
                                end={link.end}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >
                                <span className="sidebar-icon">
                                    {link.icon}
                                </span>

                                <span>
                                    {link.label}
                                </span>

                                {link.label ===
                                    "Notifications" && (
                                    <NotificationBell
                                        compact
                                    />
                                )}
                            </NavLink>

                        </div>
                    );
                })}

            </nav>

            {/* LOGOUT */}

            <div className="sidebar-logout-wrapper">
                <button
                    type="button"
                    className="sidebar-logout"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <span className="sidebar-logout-icon">
                        ↪
                    </span>

                    <span className="sidebar-logout-label">
                        Logout
                    </span>
                </button>
            </div>

            {/* BOTTOM */}

            <div className="sidebar-bottom">

                <div className="sidebar-ecosystem-card">

                    <div className="sidebar-ecosystem-dot" />

                    <div>
                        <strong>
                            {config.workspace}
                        </strong>

                        <span>
                            Active ecosystem
                        </span>
                    </div>

                </div>

                <div className="sidebar-version">
                    {config.footer}
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;