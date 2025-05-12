import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/admin/messages/all', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((err) => {
                console.error('Failed to load messages:', err);
                setLoading(false); // Ensure loading is false if there's an error
            });
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

            if (!res.ok) throw new Error(await res.text());

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

            if (!res.ok) throw new Error(await res.text());

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

            if (!res.ok) throw new Error(await res.text());

            setMessages((prevMessages) => prevMessages.filter((msg) => msg.messageId !== id));
        } catch (err) {
            const errorMessage = `Error deleting message ${id}: ${err.message}`;
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const viewMessage = (id) => {
        navigate(`/message/${id}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">User Messages</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="alert alert-info text-center">Loading...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle text-center">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Email</th>
                            <th>View</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <tr key={msg.messageId}>
                                    <td>{msg.messageId}</td>
                                    <td>{new Date(msg.dateCreated).toLocaleString()}</td>
                                    <td>{msg.subject}</td>
                                    <td>{msg.email}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={() => viewMessage(msg.messageId)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    <td>
                                            <span className={`badge ${msg.status === 'PROCESSED' ? 'bg-warning text-dark' : msg.status === 'RESOLVED' ? 'bg-success' : 'bg-secondary'}`}>
                                                {msg.status}
                                            </span>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column gap-1">
                                            <button
                                                className="admin-btn"
                                                onClick={() => markAsProcessed(msg.messageId)}
                                            >
                                                Mark as Processed
                                            </button>
                                            <button
                                                className="admin-btn"
                                                onClick={() => markAsResolved(msg.messageId)}
                                            >
                                                Mark as Resolved
                                            </button>
                                            <button
                                                className="admin-btn"
                                                onClick={() => deleteMessage(msg.messageId)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-muted">No messages found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
