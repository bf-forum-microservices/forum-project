import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        status: 'PUBLISHED'
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!form.title) newErrors.title = 'Title is required';
        if (!form.content) newErrors.content = 'Content is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const userId = parseInt(localStorage.getItem('userId'));
        const payload = {
            userId,
            title: form.title,
            content: form.content,
            status: form.status,
            isArchived: false
        };

        const endpoint = form.status === 'DRAFT'
            ? 'http://localhost:8080/postandreply/draftPost'
            : 'http://localhost:8080/postandreply/newPost';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to create post');
            alert('Post submitted successfully!');
            navigate('/home');
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to submit post.');
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4 text-center">Create New Post</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">
                        Title<span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Content<span className="text-danger">*</span>
                    </label>
                    <textarea
                        name="content"
                        rows="4"
                        className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                        value={form.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                    {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Status<span className="text-danger">*</span>
                    </label>
                    <select
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="PUBLISHED">Publish</option>
                        <option value="DRAFT">Save as Draft</option>
                    </select>
                </div>

                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary w-50 me-2">
                        Submit
                    </button>
                    <button type="button" className="btn btn-secondary w-50 ms-2" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
