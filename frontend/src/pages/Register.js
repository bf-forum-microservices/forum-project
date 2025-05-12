// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const Register = () => {
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//     });
//
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();
//
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//
//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setError('');
//         setMessage('');
//
//         try {
//             const response = await fetch('http://localhost:8080/users/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });
//
//             if (!response.ok) {
//                 const errData = await response.json();
//                 throw new Error(errData.message || 'Registration failed');
//             }
//
//             setMessage('Registration successful! Please check your email to verify your account.');
//         } catch (err) {
//             console.error('Registration error:', err);
//             setError(err.message);
//         }
//     };
//
//     return (
//         <div className="page-shift">
//             <div className="profile-container">
//                 <h2>Register</h2>
//                 <form onSubmit={handleRegister}>
//                     <label>First Name:</label>
//                     <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         required
//                     />
//
//                     <label>Last Name:</label>
//                     <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         required
//                     />
//
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />
//
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />
//
//                     {error && <p className="error-message">{error}</p>}
//                     {message && <p className="success-message">{message}</p>}
//
//                     <button type="submit">Register</button>
//                 </form>
//
//                 <p>
//                     Already have an account?{' '}
//                     <button onClick={() => navigate('/login')} type="button">
//                         Login here
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };
//
// export default Register;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profileImageURL: ''
    });

    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadToS3 = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', 'password123');

        const res = await fetch('http://localhost:8087/s3/upload', {
            method: 'POST',
            body: formData
        });

        return await res.text();
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            let imageUrl = '';
            if (file) {
                imageUrl = await uploadToS3();
            }

            const finalForm = {
                ...formData,
                profileImageURL: imageUrl
            };

            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalForm),
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
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">Register</h2>
            <form onSubmit={handleRegister} noValidate>
                <div className="mb-3">
                    <label className="form-label">First Name
                        <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name
                        <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email
                        <span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password
                        <span className="text-danger">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Profile Picture (optional)</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <button type="submit" className="btn btn-success w-100">Register</button>
            </form>

            <div className="text-center mt-3">
                <p>
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} type="link">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;

