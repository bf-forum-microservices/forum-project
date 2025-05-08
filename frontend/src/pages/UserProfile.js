// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const UserProfile = () => {
//     const [user, setUser] = useState(null);
//     const [topPosts, setTopPosts] = useState([]);
//     const [drafts, setDrafts] = useState([]);
//     const [history, setHistory] = useState([]);
//     const navigate = useNavigate();
//     const userId = localStorage.getItem('userId');
//
//     useEffect(() => {
//         fetch(`http://localhost:8080/users/info?userId=${userId}`)
//             .then(res => res.json())
//             .then(data => setUser(data))
//             .catch(err => console.error('Failed to fetch user:', err));
//
//         fetch(`http://localhost:8080/postandreply/posts/top/${userId}`)
//             .then(res => res.json())
//             .then(data => setTopPosts(data))
//             .catch(err => console.error('Failed to fetch top posts:', err));
//
//         fetch(`http://localhost:8080/postandreply/posts/user/${userId}?status=draft`)
//             .then(res => res.json())
//             .then(data => setDrafts(data))
//             .catch(err => console.error('Failed to fetch drafts:', err));
//
//         fetch(`http://localhost:8080/history/${userId}`)
//             .then(res => res.json())
//             .then(data => setHistory(data))
//             .catch(err => console.error('Failed to fetch view history:', err));
//     }, [userId]);
//
//     const handleEditProfile = () => {
//         navigate('/edit-profile');
//     };
//
//     if (!user) return <div>Loading...</div>;
//
//     return (
//         <div className="user-profile">
//             <h2>User Profile</h2>
//             <img src={user.profileImageUrl || '/default-profile.jpg'} alt="Profile" width={150} height={150} />
//             <p><strong>First Name:</strong> {user.firstName}</p>
//             <p><strong>Last Name:</strong> {user.lastName}</p>
//             <p><strong>Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
//             <button onClick={handleEditProfile}>Edit Profile</button>
//
//             <h3>Top 3 Posts by Replies</h3>
//             <ul>
//                 {topPosts.map(post => (
//                     <li key={post.id}>{post.title} ({post.replyCount} replies)</li>
//                 ))}
//             </ul>
//
//             <h3>Your Drafts</h3>
//             <ul>
//                 {drafts.map(post => (
//                     <li key={post.id}>{post.title}</li>
//                 ))}
//             </ul>
//
//             <h3>View History (Published Only)</h3>
//             <ul>
//                 {history
//                     .filter(h => h.status === 'PUBLISHED')
//                     .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
//                     .map(h => (
//                         <li key={h.postId}>{h.title} - {new Date(h.viewedAt).toLocaleString()}</li>
//                     ))}
//             </ul>
//         </div>
//     );
// };
//
// export default UserProfile;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const UserProfile = () => {
//     const [user, setUser] = useState({
//         profileImageUrl: '',
//         firstName: 'Jane',
//         lastName: 'Doe',
//         dateJoined: '2024-01-01T00:00:00Z'
//     });
//     const [topPosts, setTopPosts] = useState([
//         { id: 1, title: 'Top Post 1', replyCount: 12 },
//         { id: 2, title: 'Top Post 2', replyCount: 9 },
//         { id: 3, title: 'Top Post 3', replyCount: 5 }
//     ]);
//     const [drafts, setDrafts] = useState([
//         { id: 4, title: 'Draft 1' },
//         { id: 5, title: 'Draft 2' }
//     ]);
//     const [history, setHistory] = useState([
//         { postId: 6, title: 'Viewed Post 1', status: 'PUBLISHED', viewedAt: '2025-05-05T14:30:00Z' },
//         { postId: 7, title: 'Viewed Post 2', status: 'PUBLISHED', viewedAt: '2025-05-04T10:20:00Z' }
//     ]);
//     const navigate = useNavigate();
//
//     const handleEditProfile = () => {
//         navigate('/edit-profile');
//     };
//
//     return (
//         <div className="user-profile">
//             <h2>User Profile</h2>
//             <img src={user.profileImageUrl || '/default-profile.jpg'} alt="Profile" width={150} height={150} />
//             <p><strong>First Name:</strong> {user.firstName}</p>
//             <p><strong>Last Name:</strong> {user.lastName}</p>
//             <p><strong>Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
//             <button onClick={handleEditProfile}>Edit Profile</button>
//
//             <h3>Top 3 Posts by Replies</h3>
//             <ul>
//                 {topPosts.map(post => (
//                     <li key={post.id}>{post.title} ({post.replyCount} replies)</li>
//                 ))}
//             </ul>
//
//             <h3>Your Drafts</h3>
//             <ul>
//                 {drafts.map(post => (
//                     <li key={post.id}>{post.title}</li>
//                 ))}
//             </ul>
//
//             <h3>View History (Published Only)</h3>
//             <ul>
//                 {history
//                     .filter(h => h.status === 'PUBLISHED')
//                     .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
//                     .map(h => (
//                         <li key={h.postId}>{h.title} - {new Date(h.viewedAt).toLocaleString()}</li>
//                     ))}
//             </ul>
//         </div>
//     );
// };
//
// export default UserProfile;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pages.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        profileImageURL: ''
    });
    const [emailEditMode, setEmailEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [emailStep, setEmailStep] = useState(1); // 1 = input new email, 2 = verify code
    const [topPosts, setTopPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view this page.');
            return;
        }

        axios.get('http://localhost:8080/users/info', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUserInfo(res.data);
                setFormData({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    password: '',
                    profileImageURL: res.data.profileImageURL || ''
                });

                // Fetch top 3 posts for this user
                axios.get(`http://localhost:8080/postandreply/posts/top/${res.data.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(response => setTopPosts(response.data))
                    .catch(err => console.error('Failed to fetch top 3 posts:', err));

            })
            .catch(() => {
                setError('Failed to load profile.');
            });
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            await axios.put('http://localhost:8080/users/updateProfile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully!');
            setEditMode(false);
            window.location.reload(); // to refresh updated info
        } catch {
            alert('Failed to update profile.');
        }
    };
    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            await axios.put('http://localhost:8080/users/updateEmail', { newEmail }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Verification code sent to new email.');
            setEmailStep(2); // Move to next step
        } catch (err) {
            alert('Failed to send verification code.');
        }
    };

    const handleVerifyEmailCode = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/users/verifyUpdateEmailCode', { code: emailVerificationCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Email updated successfully!');
            setEmailEditMode(false);
            window.location.reload(); // Refresh profile info
        } catch (err) {
            alert('Invalid or expired verification code.');
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/myposts/${postId}`);
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!userInfo) return <div>Loading profile...</div>;

    return (
        <div className="profile-page-container">
            <div className="profile-container">
                <h2>User Profile</h2>
                <img
                    src={userInfo.profileImageURL || 'https://happypathbucket123.s3.amazonaws.com/fa4475be-aedd-4905-a3d5-b3a643b40753_default-avatar-icon-of-social-media-user-vector.jpg'}
                    alt="Profile"
                    className="profile-image"
                />

                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <label>First Name:</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} required />

                        <label>Last Name:</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} required />

                        <label>Password:</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} />

                        <label>Profile Image URL:</label>
                        <input name="profileImageURL" value={formData.profileImageURL} onChange={handleChange} />

                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <p><strong>Full Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                        <p><strong>Email:</strong> {userInfo.email}</p>
                        <p><strong>Role:</strong> {userInfo.type}</p>
                        <button onClick={() => setEditMode(true)}>Edit Profile</button>
                        <button onClick={() => setEmailEditMode(true)}>Change Email</button>
                        <button onClick={() => navigate('/myposts')}>My Post</button>
                    </>
                )}

                {emailEditMode && (
                    <form onSubmit={emailStep === 1 ? handleSendVerificationCode : handleVerifyEmailCode}>
                        {emailStep === 1 ? (
                            <>
                                <label>New Email:</label>
                                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                                <button type="submit">Send Verification Code</button>
                            </>
                        ) : (
                            <>
                                <label>Verification Code:</label>
                                <input value={emailVerificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} required />
                                <button type="submit">Verify and Update Email</button>
                            </>
                        )}
                        <button type="button" onClick={() => { setEmailEditMode(false); setEmailStep(1); }}>Cancel</button>
                    </form>
                )}
            </div>

            <div className="top-posts-wrapper">
                <div className="top-posts-container">
                    <h3>Top 3 Posts</h3>
                    {topPosts.length > 0 ? (
                        topPosts.map(post => (
                            <div key={post.postId} className="post-card">
                                <h4 className="clickable-title" onClick={() => handlePostClick(post.postId)}>{post.title}</h4>
                                <p>{post.content}</p>
                                <p><strong>Status:</strong> {post.status}</p>
                                <p><strong>Created:</strong> {new Date(post.dateCreated).toLocaleString()}</p>
                                <p><strong>Updated:</strong> {new Date(post.dateModified).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No posts to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
