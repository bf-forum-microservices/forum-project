import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch(`http://localhost:8080/users/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'Verification failed');
            }

            setMessage('Email verified successfully. You are now a normal user.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="email-verification">
            <h2>Email Verification</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <label>Enter the 6-digit code sent to your email:</label>
                <input
                    type="text"
                    maxLength="6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default EmailVerification;
