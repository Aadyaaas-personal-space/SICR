import { useState } from "react";
import {
    sendConnectionRequest,
} from "../../services/connectionService";
import "./Connection.css";

function ConnectButton({
    senderType,
    senderId,
    receiverType,
    receiverId,
    initialStatus = null,
}) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleConnect = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("===== SICR CONNECT CLICKED =====");
        console.log("Sender Type:", senderType);
        console.log("Sender ID:", senderId);
        console.log("Receiver Type:", receiverType);
        console.log("Receiver ID:", receiverId);

        if (!senderType || !senderId) {
            alert("SICR Error: Logged-in user identity is missing.");
            return;
        }

        if (!receiverType || !receiverId) {
            alert("SICR Error: Receiver profile ID is missing.");
            return;
        }

        try {
            setLoading(true);

            console.log("Sending connection request...");

            const result = await sendConnectionRequest({
                senderType,
                senderId,
                receiverType,
                receiverId,
                message:
                    "I would like to connect with you through SICR.",
            });

            console.log("SICR CONNECTION RESPONSE:", result);

            setStatus("PENDING");

            alert("Connection request sent successfully!");

        } catch (error) {
            console.error("SICR CONNECTION ERROR:", error);

            alert(
                error?.message ||
                "Failed to send connection request."
            );

        } finally {
            setLoading(false);
        }
    };

    if (status === "ACCEPTED") {
        return (
            <button
                type="button"
                className="connection-btn connected"
                disabled
            >
                Connected
            </button>
        );
    }

    if (status === "PENDING") {
        return (
            <button
                type="button"
                className="connection-btn pending"
                disabled
            >
                Request Sent
            </button>
        );
    }

    return (
        <button
            type="button"
            className="connection-btn"
            onClick={handleConnect}
            disabled={loading}
        >
            {loading
                ? "Sending..."
                : "Connect"}
        </button>
    );
}

export default ConnectButton;
