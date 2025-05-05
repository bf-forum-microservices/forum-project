import React, { useState } from 'react';

const ContactAdmin = () => {
    const [form, setForm] = useState({
        userId: '',
        email: '',
        subject: '',
        message: ''
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form is valid, ready to submit:', form);
            // Future: submit logic here
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Contact Admin</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="userId" className="form-label">User ID</label>
                    <input
                        type="text"
                        name="userId"
                        className="form-control"
                        value={form.userId}
                        onChange={handleChange}
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
