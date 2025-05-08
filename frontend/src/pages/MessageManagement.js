import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Pages.css'

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    console.log(sessionStorage.getItem('token'));

    useEffect(() => {
        fetch('http://localhost:8080/admin/messages/all', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        }) //
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error('Failed to load messages:', err));
    }, []);

    const markAsProcessed = async (id) => {
        setError(null);
        try {
            const res = await fetch(`http://localhost:8080/admin/messages/${id}/status?status=processed`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
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
            const res = await fetch(`http://localhost:8080/admin/messages/${id}/status?status=resolved`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
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

    const deleteMessage = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/admin/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to delete message.');
            }

            setMessages((prevMessages) => prevMessages.filter((msg) => msg.messageId !== id));

        } catch (err) {
            const errorMessage = `Error deleting message ${id}: ${err.message}`;
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const viewMessage = (id) => {
        navigate(`/message/${id}`);
    }

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
                        <td><button className="admin-btn" onClick={() => viewMessage(msg.messageId)}>View</button></td>
                        <td>{msg.status}</td>
                        <td>
                            <button className="admin-btn"
                                    onClick={() => markAsProcessed(msg.messageId, msg.status)}>
                                Mark as Processed
                            </button>
                            <button className="admin-btn"
                                    onClick={() => markAsResolved(msg.messageId, msg.status)}>
                                Mark as Resolved
                            </button>
                            <button className="admin-btn"
                                    onClick={() => deleteMessage(msg.messageId, msg.status)}>
                                Delete
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

