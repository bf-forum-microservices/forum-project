import React, { useEffect, useState } from 'react';
import './Pages.css'

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/admin/messages/all') //
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error('Failed to load messages:', err));
    }, []);

    const markAsProcessed = async (id) => {
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/admin/messages/${id}/status?status=processed`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update status');
            }

            // Update state if the request succeeded
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === id ? { ...msg, status: 'PROCESSED' } : msg
                )
            );
        } catch (err) {
            const errorMessage = `Error processing message ${id}: ${err.message}`;
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const markAsResolved = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/messages/${id}/status?status=resolved`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update status');
            }

            // Update state if the request succeeded
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === id ? { ...msg, status: 'RESOLVED' } : msg
                )
            );
        } catch (err) {
            const errorMessage = `Error processing message ${id}: ${err.message}`;
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    return (
        <div className="admin-messages">
            <h2>User Messages</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                <tr>
                    <th>Message ID</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((msg) => (
                    <tr key={msg.messageId}>
                        <td>{msg.messageId}</td>
                        <td>{new Date(msg.dateCreated).toLocaleString()}</td>
                        <td>{msg.subject}</td>
                        <td>{msg.email}</td>
                        <td>{msg.content}</td>
                        <td>{msg.status}</td>
                        <td>
                            <button onClick={() => markAsProcessed(msg.messageId, msg.status)}>
                                Mark as Processed
                            </button>
                            <button onClick={() => markAsResolved(msg.messageId, msg.status)}>
                                Mark as Resolved
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminMessages;

