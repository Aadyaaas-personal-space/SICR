import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getLoggedInIdentity } from "../../utils/authIdentity";

import {
    getConversations,
    getMessages,
    sendMessage,
} from "../../services/messageService";

import Sidebar from "../../components/sidebar/Sidebar";

import "./Messenger.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

function normalizeType(value) {
    const type = String(value || "").trim().toUpperCase();

    if (["INVESTORFUNDER", "INVESTOR_FUNDER", "FUNDER"].includes(type)) {
        return "INVESTOR";
    }

    return type;
}

function formatTime(date) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString([], {
        dateStyle: "short",
        timeStyle: "short",
    });
}

function getInitial(name) {
    return String(name || "M").trim().charAt(0).toUpperCase() || "M";
}

function Messenger() {
    const location = useLocation();

    // Use only the identity selected by the existing auth utility.
    // Do not fall back to another ecosystem's stored token.
    const identity = getLoggedInIdentity();
    const token = identity?.token || null;

    const [conversations, setConversations] = useState([]);
    const [activePeer, setActivePeer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const request = useCallback(
        async (path, options = {}) => {
            if (!token) {
                throw new Error(
                    "Please log in to your SICR account."
                );
            }

            const response = await fetch(`${API_URL}${path}`, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || `Request failed (${response.status}).`
                );
            }

            return data;
        },
        [token]
    );

const loadConversations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
        const data = await getConversations(
            identity?.type
        );

        setConversations(
            data.conversations || []
        );

    } catch (err) {

        setError(
            err.message ||
            "Unable to load conversations."
        );

    } finally {

        setLoading(false);
    }
}, [identity?.type]);

const loadMessages = useCallback(
    async (peer) => {

        if (!peer?.id || !peer?.type) {
            setError(
                "The selected member has an invalid account identity."
            );
            return;
        }

        setMessagesLoading(true);
        setError("");

        try {

            const peerType =
                normalizeType(peer.type);

            const peerId =
                String(peer.id);

            const data =
                await getMessages(
                    peerType,
                    peerId,
                    identity?.type
                );

            setMessages(
                data.messages || []
            );

            setCurrentUser(
                data.currentUser || null
            );

            setActivePeer(
                data.peer || {
                    ...peer,
                    type: peerType,
                    id: peerId,
                }
            );

            // Remove unread count after
            // opening the conversation.

            setConversations((previous) =>
                previous.map((conversation) => {

                    const conversationPeer =
                        conversation.peer;

                    if (
                        normalizeType(
                            conversationPeer?.type
                        ) === peerType &&
                        String(
                            conversationPeer?.id
                        ) === peerId
                    ) {
                        return {
                            ...conversation,
                            unreadCount: 0,
                        };
                    }

                    return conversation;
                })
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to load messages."
            );

        } finally {

            setMessagesLoading(false);
        }
    },
    [identity?.type]
);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // Universal Search can open Messenger with a selected peer.
    useEffect(() => {
        const peer = location.state?.peer;

        if (peer?.id && peer?.type) {
            loadMessages({
                ...peer,
                id: String(peer.id),
                type: normalizeType(peer.type),
                name: peer.name || "SICR Member",
            });
        }
    }, [location.state, loadMessages]);

    async function handleSend(event) {
        event.preventDefault();

        const text = content.trim();

        if (!activePeer || !text || sending) return;

        setSending(true);
        setError("");

        try {
            await sendMessage(
    normalizeType(activePeer.type),
    String(activePeer.id),
    text,
    identity?.type
);

            setContent("");

            await loadMessages(activePeer);
            await loadConversations();
        } catch (err) {
            setError(err.message || "Unable to send message.");
        } finally {
            setSending(false);
        }
    }

    const accountType = normalizeType(identity?.type);

    return (
        <div className="messenger-app-layout">
        <Sidebar />
        <main className="sicr-messenger">
            <header className="messenger-heading">
                <div>
                    <span className="messenger-eyebrow">SICR CONNECT</span>
                    <h1>Messages</h1>
                    <p>
                        Private conversations with your accepted connections.
                        {accountType ? ` Signed in as ${accountType}.` : ""}
                    </p>
                </div>

                <button
                    className="messenger-refresh"
                    onClick={loadConversations}
                    disabled={loading}
                    type="button"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {error && (
                <div className="messenger-error" role="alert">
                    {error}
                </div>
            )}

            <section className="messenger-layout">
                <aside className="messenger-sidebar">
                    <div className="messenger-sidebar-heading">
                        <h2>Conversations</h2>
                        <span>{conversations.length}</span>
                    </div>

                    {loading ? (
                        <p className="messenger-empty">
                            Loading conversations...
                        </p>
                    ) : conversations.length === 0 ? (
                        <p className="messenger-empty">
                            No conversations yet. Open a connected member from
                            Discover to start your first conversation.
                        </p>
                    ) : (
                        <div className="messenger-conversation-list">
                            {conversations.map((conversation) => {
                                const peer = conversation.peer;

                                if (!peer?.id || !peer?.type) return null;

                                const selected =
                                    String(activePeer?.id) === String(peer.id) &&
                                    normalizeType(activePeer?.type) ===
                                        normalizeType(peer.type);

                                return (
                                    <button
                                        type="button"
                                        key={`${peer.type}:${peer.id}`}
                                        className={`messenger-conversation ${
                                            selected ? "selected" : ""
                                        }`}
                                        onClick={() => loadMessages(peer)}
                                    >
                                        <span className="messenger-avatar">
                                            {getInitial(peer.name)}
                                        </span>

                                        <span className="messenger-conversation-info">
                                            <strong>
                                                {peer.name || "Member"}
                                            </strong>

                                            <small>
                                                {normalizeType(peer.type)}
                                            </small>

                                            <span className="messenger-preview">
                                                {conversation.latestMessage?.content ||
                                                    "Start a conversation"}
                                            </span>
                                        </span>

                                        {conversation.unreadCount > 0 && (
                                            <span className="messenger-unread">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </aside>

                <section className="messenger-chat">
                    {!activePeer ? (
                        <div className="messenger-welcome">
                            <span className="messenger-welcome-icon">
                                ✉
                            </span>
                            <h2>Your conversations</h2>
                            <p>
                                Select a conversation or open a connected
                                member from Discover.
                            </p>
                        </div>
                    ) : (
                        <>
                            <header className="messenger-chat-header">
                                <span className="messenger-avatar">
                                    {getInitial(activePeer.name)}
                                </span>

                                <div>
                                    <h2>{activePeer.name || "Member"}</h2>
                                    <p>{normalizeType(activePeer.type)}</p>
                                </div>
                            </header>

                            <div
                                className="messenger-message-list"
                                aria-live="polite"
                            >
                                {messagesLoading ? (
                                    <p className="messenger-empty">
                                        Loading messages...
                                    </p>
                                ) : messages.length === 0 ? (
                                    <p className="messenger-empty">
                                        No messages yet. Say hello!
                                    </p>
                                ) : (
                                    messages.map((message) => {
                                        const isMine =
                                            normalizeType(message.senderType) ===
                                                normalizeType(currentUser?.type) &&
                                            String(message.senderId) ===
                                                String(currentUser?.id);

                                        return (
                                            <div
                                                key={message._id}
                                                className={`messenger-message-row ${
                                                    isMine ? "mine" : "theirs"
                                                }`}
                                            >
                                                <article
                                                    className={`messenger-bubble ${
                                                        isMine ? "mine" : "theirs"
                                                    }`}
                                                >
                                                    <p>{message.content}</p>
                                                    <time>
                                                        {formatTime(
                                                            message.createdAt
                                                        )}
                                                        {isMine &&
                                                            message.readAt &&
                                                            " · Read"}
                                                    </time>
                                                </article>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <form
                                className="messenger-compose"
                                onSubmit={handleSend}
                            >
                                <textarea
                                    value={content}
                                    onChange={(event) =>
                                        setContent(event.target.value)
                                    }
                                    placeholder="Write a message..."
                                    maxLength={5000}
                                    rows={2}
                                    aria-label="Message"
                                    disabled={sending}
                                />

                                <button
                                    type="submit"
                                    disabled={!content.trim() || sending}
                                >
                                    {sending ? "Sending..." : "Send"}
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </section>
        </main>
        </div>
    );
}

export default Messenger;
