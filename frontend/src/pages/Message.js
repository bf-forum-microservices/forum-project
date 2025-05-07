import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Pages.css';

const Message = () => {
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const res = await fetch(`http://localhost:8080/admin/messages/${id}`);
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Failed to fetch message.');
                }
                const data = await res.json();
                setMessage(data);
            } catch (err) {
                const errorMessage = `Error fetching message ${id}: ${err.message}`;
                setError(errorMessage);
                alert(errorMessage);
            }
        };
        fetchMessage();
    }, [id]);

    if (error) {
        return <div className="alert alert-danger text-center mt-4">{error}</div>;
    }

    if (!message) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Message Details</h4>
                </div>
                <div className="card-body">
                    <p><strong>ID:</strong> {message.messageId}</p>
                    <p><strong>Date:</strong> {new Date(message.dateCreated).toLocaleString()}</p>
                    <p><strong>Subject:</strong> {message.subject}</p>
                    <p><strong>Email:</strong> {message.email}</p>
                    <p><strong>Content:</strong> {message.message}</p>
                    <p>
                        <strong>Status:</strong>{' '}
                        <span className={`badge ${message.status === ('RESOLVED' || 'PROCESSED') ? 'bg-success' : 'bg-secondary'}`}>
                            {message.status}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Message;
