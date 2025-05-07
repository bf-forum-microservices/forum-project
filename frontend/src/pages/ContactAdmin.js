import React, { useState, useEffect } from 'react';
import {isAdmin, isAuthenticated} from './../auth';
import { jwtDecode } from "jwt-decode";

const ContactAdmin = () => {
    const [form, setForm] = useState({
        userId: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (isAuthenticated()) {
            const token = sessionStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            // Pre-fill form with user info if present
            setForm((prev) => ({
                ...prev,
                userId: decodedToken.userId || '',
                email: decodedToken.sub || ''
            }));
        }
    }, []);

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!form.subject) {
            newErrors.subject = 'Subject is required';
        } else if (form.subject.length < 5) {
            newErrors.subject = 'Subject must be at least 5 characters';
        }

        if (!form.message) {
            newErrors.message = 'Message is required';
        } else if (form.message.length < 5) {
            newErrors.message = 'Message must be at least 5 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('http://localhost:8080/admin/messages/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to send message');
                }

                alert('Message sent successfully!');
                setForm({
                    userId: isAuthenticated() ? form.userId: '',
                    email: isAuthenticated() ? form.email: '',
                    subject: '',
                    message: ''
                });
                setErrors({});
            } catch (err) {
                console.error('Error submitting message', err);
                alert('Failed to send message. Please try again later.');
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Contact Admin</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="userId" className="form-label">{isAuthenticated() ? 'User ID' : 'User ID (Optional)'}</label>
                    <input
                        type="text"
                        name="userId"
                        className="form-control"
                        value={form.userId}
                        onChange={handleChange}
                        readOnly={isAuthenticated()}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email<span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email}
                        onChange={handleChange}
                        readOnly={isAuthenticated()}
                        required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                        Subject<span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                        value={form.subject}
                        onChange={handleChange}
                        required
                    />
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        Message<span className="text-danger">*</span>
                    </label>
                    <textarea
                        name="message"
                        rows="4"
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ContactAdmin;
