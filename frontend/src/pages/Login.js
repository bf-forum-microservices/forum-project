import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            localStorage.setItem('token', data.token);
            navigate('/home');

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email<span className="text-danger">*</span></label>
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
                    <label htmlFor="password" className="form-label">Password<span className="text-danger">*</span></label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                <button type="submit" className="btn btn-success w-100">Login</button>
            </form>

            <p className="mt-3 text-center">
                Don’t have an account?{' '}
                <button onClick={() => navigate('/register')} type="button">
                    Register here
                </button>
            </p>
        </div>
    );
};

export default Login;
