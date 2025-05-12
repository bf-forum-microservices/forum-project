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
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">Email Verification</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="code" className="form-label">
                        6-digit Verification Code <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        maxLength="6"
                        className="form-control"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {message && <div className="alert alert-success" role="alert">{message}</div>}

                <button type="submit" className="btn btn-primary w-100">Verify</button>
            </form>
        </div>
    );
};

export default EmailVerification;
