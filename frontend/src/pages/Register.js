import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Registration failed');
            }

            setMessage('Registration successful! Please check your email to verify your account.');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="page-shift">
            <div className="profile-container">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} type="button">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
