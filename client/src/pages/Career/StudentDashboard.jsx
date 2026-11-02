
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./StudentDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const SUGGESTED_QUESTIONS = [
    {
        icon: "🧭",
        title: "Discover my career",
        prompt: "Help me discover suitable careers based on my interests and strengths. Ask me questions to understand myself better.",
    },
    {
        icon: "🎓",
        title: "Explore courses",
        prompt: "What courses and educational paths should I explore for my future career?",
    },
    {
        icon: "💡",
        title: "Identify my skills",
        prompt: "Help me identify the skills I should develop to build a successful career.",
    },
    {
        icon: "🗺️",
        title: "Build my roadmap",
        prompt: "Help me create a step-by-step career roadmap based on my current education.",
    },
];

const INITIAL_MESSAGE = {
    role: "assistant",
    content:
        "Hello! Welcome to SICR Career Guidance 👋\n\nI'm your AI career guide. I can help you understand your interests, explore career opportunities, choose suitable courses and plan your future.\n\nLet's start with you: What subjects or activities do you enjoy the most?",
};

function StudentDashboard() {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [sending, setSending] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("studentToken");

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const handleAuthError = useCallback(() => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentUser");
        navigate("/student/login", { replace: true });
    }, [navigate]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, sending]);

    // Load the student's previous conversations.
    const loadChats = useCallback(async () => {
        if (!token) {
            handleAuthError();
            return;
        }

        try {
            setLoadingChats(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/student/chat`,
                {
                    headers: authHeaders,
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load conversations."
                );
            }

            setChats(data.chats || []);
        } catch (err) {
            setError(err.message || "Unable to connect to SICR.");
        } finally {
            setLoadingChats(false);
        }
    }, [token, handleAuthError]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    // Create a new conversation.
    const createNewChat = async () => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/student/chat`,
                {
                    method: "POST",
                    headers: authHeaders,
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create a new chat."
                );
            }

            setChats((previous) => [
                data.chat,
                ...previous.filter(
                    (chat) => chat._id !== data.chat._id
                ),
            ]);

            setActiveChatId(data.chat._id);
            setMessages([INITIAL_MESSAGE]);
            setInput("");
            setSidebarOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Open an existing conversation.
    const openChat = async (chatId) => {
        try {
            setLoadingConversation(true);
            setError("");
            setSidebarOpen(false);

            const response = await fetch(
                `${API_URL}/api/student/chat/${chatId}`,
                {
                    headers: authHeaders,
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to open conversation."
                );
            }

            setActiveChatId(chatId);

            setMessages(
                data.chat.messages?.length
                    ? data.chat.messages
                    : [INITIAL_MESSAGE]
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingConversation(false);
        }
    };

    // Delete a conversation.
    const deleteChat = async (chatId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this conversation?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_URL}/api/student/chat/${chatId}`,
                {
                    method: "DELETE",
                    headers: authHeaders,
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete conversation."
                );
            }

            const updatedChats = chats.filter(
                (chat) => chat._id !== chatId
            );

            setChats(updatedChats);

            if (activeChatId === chatId) {
                setActiveChatId(null);
                setMessages([INITIAL_MESSAGE]);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Send a message to the AI.
    const sendMessage = async (messageText = input) => {
        const cleanMessage = messageText.trim();

        if (!cleanMessage || sending) return;

        let chatId = activeChatId;

        try {
            setError("");
            setSending(true);
            setInput("");

            // Create a conversation automatically for the first message.
            if (!chatId) {
                const createResponse = await fetch(
                    `${API_URL}/api/student/chat`,
                    {
                        method: "POST",
                        headers: authHeaders,
                    }
                );

                if (
                    createResponse.status === 401 ||
                    createResponse.status === 403
                ) {
                    handleAuthError();
                    return;
                }

                const createData = await createResponse.json();

                if (!createResponse.ok) {
                    throw new Error(
                        createData.message || "Unable to create chat."
                    );
                }

                chatId = createData.chat._id;
                setActiveChatId(chatId);

                setChats((previous) => [
                    createData.chat,
                    ...previous,
                ]);
            }

            const updatedMessages = [
                ...messages,
                {
                    role: "user",
                    content: cleanMessage,
                },
            ];

            setMessages(updatedMessages);

            const response = await fetch(
                `${API_URL}/api/student/chat/${chatId}/messages`,
                {
                    method: "POST",
                    headers: authHeaders,
                    body: JSON.stringify({
                        message: cleanMessage,
                    }),
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleAuthError();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "The AI could not respond."
                );
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: data.reply,
                },
            ]);

            await loadChats();
        } catch (err) {
            setError(err.message || "Unable to send message.");

            // Keep the student's message visible if the AI fails.
        } finally {
            setSending(false);
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentUser");
        navigate("/student/login", { replace: true });
    };

    const activeChat = chats.find(
        (chat) => chat._id === activeChatId
    );

    return (
        <div className="sicr-chat-layout">
            {sidebarOpen && (
                <div
                    className="sicr-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* LEFT SIDEBAR */}
            <aside
                className={`sicr-chat-sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >
                <div className="sicr-sidebar-brand">
                    <div className="sicr-brand-icon">S</div>

                    <div>
                        <h2>SICR</h2>
                        <span>Career Intelligence</span>
                    </div>

                    <button
                        className="sicr-mobile-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <button
                    className="sicr-new-chat"
                    onClick={createNewChat}
                >
                    <span>＋</span>
                    New conversation
                </button>

                <div className="sicr-sidebar-section">
                    <span className="sicr-section-label">
                        YOUR CONVERSATIONS
                    </span>

                    <div className="sicr-chat-history">
                        {loadingChats ? (
                            <p className="sicr-sidebar-message">
                                Loading conversations...
                            </p>
                        ) : chats.length === 0 ? (
                            <p className="sicr-sidebar-message">
                                Your conversations will appear here.
                            </p>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat._id}
                                    className={`sicr-history-item ${
                                        activeChatId === chat._id
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="sicr-history-open"
                                        onClick={() =>
                                            openChat(chat._id)
                                        }
                                    >
                                        <span className="history-chat-icon">
                                            ◷
                                        </span>

                                        <span className="history-title">
                                            {chat.title ||
                                                "Career Conversation"}
                                        </span>
                                    </button>

                                    <button
                                        className="sicr-delete-chat"
                                        title="Delete conversation"
                                        onClick={() =>
                                            deleteChat(chat._id)
                                        }
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="sicr-sidebar-bottom">
                    <button
                        onClick={() =>
                            navigate("/student/onboarding")
                        }
                    >
                        <span>◉</span> My Student Profile
                    </button>

                    <button onClick={handleLogout}>
                        <span>↪</span> Sign out
                    </button>

                    <div className="sicr-sidebar-footer">
                        SICR · AI Career Guidance
                    </div>
                </div>
            </aside>

            {/* MAIN CHAT AREA */}
            <main className="sicr-chat-main">
                <header className="sicr-chat-header">
                    <button
                        className="sicr-menu-button"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>

                    <div className="sicr-header-title">
                        <h1>AI Career Guide</h1>
                        <span>
                            <i className="sicr-online-dot" />
                            Your personal career assistant
                        </span>
                    </div>

                    <div className="sicr-header-actions">
                        <button
                            onClick={() =>
                                navigate("/student/onboarding")
                            }
                        >
                            My Profile
                        </button>
                    </div>
                </header>

                <section className="sicr-chat-content">
                    {error && (
                        <div className="sicr-chat-error">
                            {error}
                            <button
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {loadingConversation ? (
                        <div className="sicr-chat-loading">
                            <div className="sicr-loading-spinner" />
                            Loading conversation...
                        </div>
                    ) : (
                        <>
                            {messages.length === 1 &&
                            messages[0].role === "assistant" ? (
                                <div className="sicr-welcome-area">
                                    <div className="sicr-ai-avatar large">
                                        ✦
                                    </div>

                                    <span className="sicr-welcome-label">
                                        SICR INTELLIGENCE
                                    </span>

                                    <h2>
                                        Let's discover your
                                        <br />
                                        <span>future together.</span>
                                    </h2>

                                    <p>
                                        Explore careers, understand your
                                        potential and build a learning
                                        journey that matches your goals.
                                        Start by asking me anything.
                                    </p>

                                    <div className="sicr-suggestions">
                                        {SUGGESTED_QUESTIONS.map(
                                            (item) => (
                                                <button
                                                    key={item.title}
                                                    onClick={() =>
                                                        sendMessage(
                                                            item.prompt
                                                        )
                                                    }
                                                    disabled={sending}
                                                >
                                                    <span className="suggestion-icon">
                                                        {item.icon}
                                                    </span>

                                                    <span>
                                                        <strong>
                                                            {item.title}
                                                        </strong>
                                                        <small>
                                                            Explore with
                                                            your AI guide
                                                        </small>
                                                    </span>

                                                    <span className="suggestion-arrow">
                                                        →
                                                    </span>
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="sicr-message-list">
                                    {messages.map((message, index) => (
                                        <div
                                            key={
                                                message._id ||
                                                `${message.role}-${index}`
                                            }
                                            className={`sicr-message-row ${
                                                message.role === "user"
                                                    ? "user-message"
                                                    : "assistant-message"
                                            }`}
                                        >
                                            {message.role ===
                                                "assistant" && (
                                                <div className="sicr-ai-avatar">
                                                    ✦
                                                </div>
                                            )}

                                            <div className="sicr-message-body">
                                                <span className="sicr-message-author">
                                                    {message.role ===
                                                    "user"
                                                        ? "You"
                                                        : "SICR AI"}
                                                </span>

                                                <div className={`sicr-message-bubble ${
    message.role === "assistant"
        ? "sicr-markdown"
        : "sicr-plain-message"
}`}>
    {message.role === "assistant" ? (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                a: ({ children, href }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                ),
            }}
        >
            {message.content}
        </ReactMarkdown>
    ) : (
        message.content
    )}
</div>
                                            </div>

                                            {message.role ===
                                                "user" && (
                                                <div className="sicr-user-avatar">
                                                    You
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {sending && (
                                        <div className="sicr-message-row assistant-message">
                                            <div className="sicr-ai-avatar">
                                                ✦
                                            </div>

                                            <div className="sicr-message-body">
                                                <span className="sicr-message-author">
                                                    SICR AI
                                                </span>

                                                <div className="sicr-typing-indicator">
                                                    <span />
                                                    <span />
                                                    <span />
                                                    <small>
                                                        Thinking...
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* MESSAGE COMPOSER */}
                <footer className="sicr-chat-footer">
                    <div className="sicr-composer">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about your career, education or future..."
                            rows={1}
                            maxLength={4000}
                            disabled={sending || loadingConversation}
                        />

                        <button
                            className="sicr-send-button"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || sending}
                            title="Send message"
                        >
                            ➤
                        </button>
                    </div>

                    <div className="sicr-composer-caption">
                        <span>
                            Powered by SICR AI Career Intelligence
                        </span>

                        <span>
                            Enter to send · Shift + Enter for a new line
                        </span>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default StudentDashboard;
