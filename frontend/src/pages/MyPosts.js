import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPosts.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const MyPosts = () => {
    const [publishedPosts, setPublishedPosts] = useState([]);
    const [draftPosts, setDraftPosts] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view this page.');
            return;
        }

        try {
            // 从 Token 中解码 userId
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.userId;
            console.log("Decoded Token:", decodedToken);
            console.log("User ID from Token:", userIdFromToken);

            // 从 /infoByUserId/{id} 获取完整的用户信息
            axios.get(`http://localhost:8080/users/infoByUserId/${userIdFromToken}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const userId = response.data.userId;
                    console.log("User ID from API:", userId);
                    setUserId(userId);

                    // 获取发布的帖子
                    return axios.get(`http://localhost:8080/postandreply/posts/user/${userId}?status=published`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                })
                .then(response => {
                    console.log("Published Posts:", response.data);
                    setPublishedPosts(response.data);
                })
                .catch(err => {
                    console.error("Failed to load published posts:", err);
                    setError('Failed to load published posts.');
                });

            // 获取草稿帖子
            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=draft`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    console.log("Draft Posts:", response.data);
                    setDraftPosts(response.data);
                })
                .catch(err => {
                    console.error("Failed to load draft posts:", err);
                    setError('Failed to load draft posts.');
                });

        } catch (error) {
            console.error("Invalid Token:", error);
            setError('Failed to decode token.');
        }
    }, []);

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="myposts-container">
            <h2>My Posts</h2>

            <div className="posts-section">
                <h3>Published Posts</h3>
                {publishedPosts.length > 0 ? (
                    <ul className="post-list">
                        {publishedPosts.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <small>Created on: {new Date(post.dateCreated).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No published posts.</p>
                )}
            </div>

            <div className="posts-section">
                <h3>Draft Posts</h3>
                {draftPosts.length > 0 ? (
                    <ul className="post-list">
                        {draftPosts.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <small>Last modified on: {new Date(post.dateModified).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No draft posts.</p>
                )}
            </div>
        </div>
    );
};

export default MyPosts;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './MyPosts.css';
// import { useNavigate } from 'react-router-dom';
//
// const MyPosts = () => {
//     const [publishedPosts, setPublishedPosts] = useState([]);
//     const [draftPosts, setDraftPosts] = useState([]);
//     const [error, setError] = useState('');
//     const [userId, setUserId] = useState(null);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             setError('You must be logged in to view this page.');
//             return;
//         }
//
//         // 获取当前用户的ID
//         axios.get('http://localhost:8080/users/infoByUserId/4', {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(response => {
//                 const userId = response.data.userId;
//                 setUserId(userId);
//
//                 // 获取发布的帖子
//                 axios.get(`http://localhost:8080/postandreply/posts/user/${userId}?status=published`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 })
//                     .then(response => setPublishedPosts(response.data))
//                     .catch(() => setError('Failed to load published posts.'));
//
//                 // 获取草稿帖子
//                 axios.get(`http://localhost:8080/postandreply/posts/user/${userId}?status=draft`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 })
//                     .then(response => setDraftPosts(response.data))
//                     .catch(() => setError('Failed to load draft posts.'));
//             })
//             .catch(() => setError('Failed to load user info.'));
//     }, []);
//
//     if (error) return <div className="error-message">{error}</div>;
//
//     return (
//         <div className="myposts-container">
//             <h2>My Posts</h2>
//
//             <div className="posts-section">
//                 <h3>Published Posts</h3>
//                 {publishedPosts.length > 0 ? (
//                     <ul className="post-list">
//                         {publishedPosts.map(post => (
//                             <li key={post.postId} className="post-item">
//                                 <h4>{post.title}</h4>
//                                 <p>{post.content}</p>
//                                 <small>Created on: {new Date(post.dateCreated).toLocaleString()}</small>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No published posts.</p>
//                 )}
//             </div>
//
//             <div className="posts-section">
//                 <h3>Draft Posts</h3>
//                 {draftPosts.length > 0 ? (
//                     <ul className="post-list">
//                         {draftPosts.map(post => (
//                             <li key={post.postId} className="post-item">
//                                 <h4>{post.title}</h4>
//                                 <p>{post.content}</p>
//                                 <small>Last modified on: {new Date(post.dateModified).toLocaleString()}</small>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No draft posts.</p>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default MyPosts;

