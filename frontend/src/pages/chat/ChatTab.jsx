import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { io } from "socket.io-client";

function ChatTab({ tripId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Get current logged-in user
  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    currentUser = null;
  }

  const currentUserId = currentUser?._id;

  // Load old messages
  async function fetchMessages() {
    try {
      const response = await api.get(
        `/trips/${tripId}/messages`
      );

      setMessages(response.data);
    } catch (err) {
      setError("Could not load messages.");
    } finally {
      setLoading(false);
    }
  }

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Socket.IO
  useEffect(() => {
    fetchMessages();

    const socket = io(import.meta.env.VITE_API_URL);

    socket.emit("joinTrip", tripId);

    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (message) => message._id === newMessage._id
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, newMessage];
      });
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  // Send message
  async function handleSendMessage(e) {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setSending(true);
      setError("");

      await api.post(
        `/trips/${tripId}/messages`,
        {
          text: text.trim(),
        }
      );

      setText("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not send message."
      );
    } finally {
      setSending(false);
    }
  }

  // Send with Enter
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (text.trim() && !sending) {
        e.currentTarget.form.requestSubmit();
      }
    }
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        Loading chat...
      </div>
    );
  }

  return (
    <div className="chat-container">

      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-header-left">

          <div className="chat-header-icon">
            💬
          </div>

          <div>
            <span className="chat-header-label">
              TRIP CHAT
            </span>

            <h3>Travel Group</h3>

            <p>Chat with your travel members</p>
          </div>

        </div>

        <div className="chat-live-badge">
          <span></span>
          Live
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">

        <div className="chat-welcome">
          <div className="chat-welcome-icon">
            ✈️
          </div>

          <strong>Welcome to your trip chat</strong>

          <p>
            Plan, discuss and share updates with your travel group.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              💬
            </div>

            <h4>No messages yet</h4>

            <p>
              Be the first one to start the conversation.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const senderId =
              message.sender?._id?.toString();

            const isMine =
              currentUserId &&
              senderId === currentUserId.toString();

            return (
              <div
                className={`chat-message ${
                  isMine ? "chat-message-mine" : ""
                }`}
                key={message._id}
              >

                {!isMine && (
                  <div className="chat-avatar">
                    {message.sender?.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>
                )}

                <div className="chat-message-content">

                  <div className="chat-message-top">
                    <strong>
                      {isMine
                        ? "You"
                        : message.sender?.name ||
                          "Unknown User"}
                    </strong>

                    <span>
                      {formatTime(message.createdAt)}
                    </span>
                  </div>

                  <div className="chat-bubble">
                    {message.text}
                  </div>

                </div>

                {isMine && (
                  <div className="chat-avatar chat-avatar-mine">
                    {currentUser?.name
                      ?.charAt(0)
                      .toUpperCase() || "Y"}
                  </div>
                )}

              </div>
            );
          })
        )}

        <div ref={messagesEndRef}></div>

      </div>

      {/* ERROR */}
      {error && (
        <p className="error-text chat-error">
          {error}
        </p>
      )}

      {/* INPUT */}
      <form
        className="chat-input-area"
        onSubmit={handleSendMessage}
      >
        <div className="chat-input-wrapper">

          <span className="chat-input-icon">
            😊
          </span>

          <input
            type="text"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={1000}
          />

        </div>

        <button
          type="submit"
          className="chat-send-btn"
          disabled={sending || !text.trim()}
        >
          {sending ? "..." : "➤"}
        </button>
      </form>

      <div className="chat-footer-text">
        Press Enter to send
      </div>

    </div>
  );
}

export default ChatTab;
