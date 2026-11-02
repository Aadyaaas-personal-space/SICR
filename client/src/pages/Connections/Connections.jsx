
import { useEffect, useState } from "react";
import { getLoggedInIdentity } from "../../utils/authIdentity";

import Sidebar from "../../components/sidebar/Sidebar";

import {
    getReceivedRequests,
    getSentRequests,
    getMyConnections,
    acceptConnectionRequest,
    rejectConnectionRequest,
    cancelConnectionRequest,
    removeConnection,
} from "../../services/connectionService";

import "./Connections.css";

// =====================================================
// ECOSYSTEM ICONS
// =====================================================

const ecosystemIcons = {
    STARTUP: "S",
    INVESTOR: "I",
    MENTOR: "M",
    CORPORATE: "C",
    PARTNERSHIP: "P",
    SPONSORSHIP: "SP",
    TBRIDGE: "T",
};

// =====================================================
// GET PROFILE NAME
// =====================================================

function getName(item, side) {
    const profile =
        side === "sender"
            ? item.senderProfile || item.sender
            : item.receiverProfile || item.receiver;

    return (
        profile?.name ||
        profile?.title ||
        profile?.organization ||
        item.name ||
        item.organization ||
        "SICR Member"
    );
}

// =====================================================
// GET ECOSYSTEM TYPE
// =====================================================

function getType(item, side) {
    const value =
        side === "sender"
            ? item.senderType || item.sender?.ecosystem
            : item.receiverType || item.receiver?.ecosystem;

    return String(value || "").toUpperCase();
}

// =====================================================
// CONNECTION CARD
// =====================================================

function ConnectionCard({
    item,
    type,
    onAccept,
    onReject,
    onCancel,
    onRemove,
    actionId,
}) {
    const side =
        type === "received"
            ? "sender"
            : type === "sent"
                ? "receiver"
                : null;

    const ecosystem =
        side
            ? getType(item, side)
            : item.senderType === item.receiverType
                ? item.senderType
                : "SICR";

    const name =
        side
            ? getName(item, side)
            : getName(
                item,
                item.senderType === getLoggedInIdentity()?.type
                    ? "receiver"
                    : "sender"
            );

    const icon = ecosystemIcons[ecosystem] || "S";

    return (
        <article className="connection-card">

            <div className="connection-card-top">
                <div className="connection-ecosystem">
                    <span className="ecosystem-icon">
                        {icon}
                    </span>

                    <span>{ecosystem || "SICR"}</span>
                </div>

                <span className={`connection-status ${type}`}>
                    {type === "received"
                        ? "Pending"
                        : type === "sent"
                            ? "Request Sent"
                            : "Connected"}
                </span>
            </div>

            <div className="connection-profile">
                <div className="connection-avatar">
                    {name.charAt(0).toUpperCase()}
                </div>

                <div className="connection-profile-info">
                    <h3>{name}</h3>
                    <p>{ecosystem || "SICR"} profile</p>
                </div>
            </div>

            {item.message && (
                <div className="connection-message">
                    <span className="message-quote">"</span>
                    <span>{item.message}</span>
                    <span className="message-quote">"</span>
                </div>
            )}

            <div className="connection-card-footer">

                {type === "received" && (
                    <>
                        <button
                            type="button"
                            className="connection-action accept"
                            disabled={actionId === item._id}
                            onClick={() => onAccept(item._id)}
                        >
                            {actionId === item._id
                                ? "Processing..."
                                : "Accept"}
                        </button>

                        <button
                            type="button"
                            className="connection-action reject"
                            disabled={actionId === item._id}
                            onClick={() => onReject(item._id)}
                        >
                            Reject
                        </button>
                    </>
                )}

                {type === "sent" && (
                    <button
                        type="button"
                        className="connection-action cancel"
                        disabled={actionId === item._id}
                        onClick={() => onCancel(item._id)}
                    >
                        {actionId === item._id
                            ? "Cancelling..."
                            : "Cancel Request"}
                    </button>
                )}

                {type === "connections" && (
                    <button
                        type="button"
                        className="connection-action remove"
                        disabled={actionId === item._id}
                        onClick={() => onRemove(item._id)}
                    >
                        {actionId === item._id
                            ? "Removing..."
                            : "Remove"}
                    </button>
                )}

            </div>
        </article>
    );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

function Connections() {

    const identity = getLoggedInIdentity();

    const [activeTab, setActiveTab] = useState("received");

    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [connections, setConnections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");

    // =================================================
    // LOAD CONNECTIONS
    // =================================================

    const loadConnections = async () => {

        if (!identity) {
            setError("Please login before viewing your connections.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [
                receivedData,
                sentData,
                connectionData,
            ] = await Promise.all([
                getReceivedRequests(identity.type),
                getSentRequests(identity.type),
                getMyConnections(identity.type),
            ]);

            setReceived(
                Array.isArray(receivedData)
                    ? receivedData
                    : receivedData?.requests ||
                    receivedData?.connections ||
                    []
            );

            setSent(
                Array.isArray(sentData)
                    ? sentData
                    : sentData?.requests ||
                    sentData?.connections ||
                    []
            );

            setConnections(
                Array.isArray(connectionData)
                    ? connectionData
                    : connectionData?.connections ||
                    []
            );

        } catch (err) {

            console.error("SICR Connections Error:", err);

            setError(
                err?.message || "Unable to load connections."
            );

        } finally {
            setLoading(false);
        }
    };

    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {
        loadConnections();
    }, []);

    // =================================================
    // PERFORM ACTION
    // =================================================

    const performAction = async (id, action) => {

        if (!identity) return;

        try {
            setActionId(id);
            setError("");

            if (action === "accept") {
                await acceptConnectionRequest(id, identity.type);
            }

            if (action === "reject") {
                await rejectConnectionRequest(id, identity.type);
            }

            if (action === "cancel") {
                await cancelConnectionRequest(id, identity.type);
            }

            if (action === "remove") {
                await removeConnection(id, identity.type);
            }

            await loadConnections();

        } catch (err) {

            console.error(`SICR ${action} error:`, err);

            setError(
                err?.message ||
                `Unable to ${action} connection.`
            );

        } finally {
            setActionId(null);
        }
    };

    // =================================================
    // CURRENT ITEMS
    // =================================================

    const currentItems =
        activeTab === "received"
            ? received
            : activeTab === "sent"
                ? sent
                : connections;

    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="connections-layout">

            {/* EXISTING SICR SIDEBAR */}
            <Sidebar />

            <main className="connections-page">

                {/* PAGE HEADER */}

                <section className="connections-hero">

                    <div className="connections-container">

                        <div className="connections-eyebrow">
                            <span></span>
                            SICR NETWORK
                        </div>

                        <div className="connections-heading-row">

                            <div>
                                <h1>
                                    My <span>Connections</span>
                                </h1>

                                <p>
                                    Build meaningful professional
                                    relationships across the SICR
                                    ecosystem. Manage your requests
                                    and grow your network.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="connections-refresh"
                                onClick={loadConnections}
                                disabled={loading}
                            >
                                <span className={loading ? "refresh-spinning" : ""}>
                                    ↻
                                </span>
                                Refresh
                            </button>

                        </div>

                        {/* STATISTICS */}

                        <div className="connection-stats">

                            <div className="stat-card received-stat">
                                <div className="stat-card-icon">↓</div>
                                <div>
                                    <strong>{received.length}</strong>
                                    <span>Received Requests</span>
                                </div>
                            </div>

                            <div className="stat-card sent-stat">
                                <div className="stat-card-icon">↑</div>
                                <div>
                                    <strong>{sent.length}</strong>
                                    <span>Sent Requests</span>
                                </div>
                            </div>

                            <div className="stat-card network-stat">
                                <div className="stat-card-icon">◎</div>
                                <div>
                                    <strong>{connections.length}</strong>
                                    <span>My Connections</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>

                {/* CONNECTION CONTENT */}

                <section className="connections-content">

                    <div className="connections-container">

                        <div className="connections-section-heading">
                            <div>
                                <h2>Your Network</h2>
                                <p>Manage and organize your connections.</p>
                            </div>

                            <span className="network-total">
                                {connections.length} Connected
                            </span>
                        </div>

                        {/* TABS */}

                        <div className="connections-tabs">

                            <button
                                type="button"
                                className={activeTab === "received" ? "active" : ""}
                                onClick={() => setActiveTab("received")}
                            >
                                <span>↓</span>
                                Inbox
                                {received.length > 0 && (
                                    <b>{received.length}</b>
                                )}
                            </button>

                            <button
                                type="button"
                                className={activeTab === "sent" ? "active" : ""}
                                onClick={() => setActiveTab("sent")}
                            >
                                <span>↑</span>
                                Outbox
                                {sent.length > 0 && (
                                    <b>{sent.length}</b>
                                )}
                            </button>

                            <button
                                type="button"
                                className={activeTab === "connections" ? "active" : ""}
                                onClick={() => setActiveTab("connections")}
                            >
                                <span>◎</span>
                                My Network
                                {connections.length > 0 && (
                                    <b>{connections.length}</b>
                                )}
                            </button>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="connections-error">
                                <strong>!</strong>
                                <span>{error}</span>

                                <button
                                    type="button"
                                    onClick={loadConnections}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* LOADING */}

                        {loading ? (

                            <div className="connections-loading">

                                <div className="connection-loader">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <h3>Loading your network...</h3>

                                <p>
                                    SICR is retrieving your ecosystem
                                    connections.
                                </p>

                            </div>

                        ) : currentItems.length === 0 ? (

                            <div className="connections-empty">

                                <div className="empty-network-icon">
                                    {activeTab === "received"
                                        ? "IN"
                                        : activeTab === "sent"
                                            ? "OUT"
                                            : "NET"}
                                </div>

                                <h2>
                                    {activeTab === "received"
                                        ? "No connection requests"
                                        : activeTab === "sent"
                                            ? "No sent requests"
                                            : "No connections yet"}
                                </h2>

                                <p>
                                    {activeTab === "received"
                                        ? "When someone wants to connect with you, their request will appear here."
                                        : activeTab === "sent"
                                            ? "Connection requests you send will appear here."
                                            : "Accepted connections across the SICR ecosystem will appear here."}
                                </p>

                            </div>

                        ) : (

                            <div className="connections-grid">

                                {currentItems.map((item) => (

                                    <ConnectionCard
                                        key={item._id}
                                        item={item}
                                        type={activeTab}
                                        actionId={actionId}
                                        onAccept={(id) =>
                                            performAction(id, "accept")
                                        }
                                        onReject={(id) =>
                                            performAction(id, "reject")
                                        }
                                        onCancel={(id) =>
                                            performAction(id, "cancel")
                                        }
                                        onRemove={(id) =>
                                            performAction(id, "remove")
                                        }
                                    />

                                ))}

                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Connections;
