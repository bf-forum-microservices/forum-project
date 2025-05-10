import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPosts.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const MyPosts = () => {
    const [publishedPosts, setPublishedPosts] = useState([]);
    const [draftPosts, setDraftPosts] = useState([]);
    const [bannedRawPosts, setBannedRawPosts] = useState([]);
    const [hiddenPosts, setHiddenPosts] = useState([]);
    const [archivedPosts, setArchivedPosts] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [editPost, setEditPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editImages, setEditImages] = useState([]);
    const [editStatus, setEditStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view this page.');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.userId;
            setUserId(userIdFromToken);

            const headers = { Authorization: `Bearer ${token}` };

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=published`, { headers })
                .then(response => setPublishedPosts(response.data))
                .catch(() => setError('Failed to load published posts.'));

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=draft`, { headers })
                .then(response => setDraftPosts(response.data))
                .catch(() => setError('Failed to load draft posts.'));

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=banned`, { headers })
                .then(response => setBannedRawPosts(response.data))
                .catch(console.error);

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=hidden`, { headers })
                .then(response => setHiddenPosts(response.data))
                .catch(console.error);

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}`, { headers })
                .then(response => {
                    const archived = response.data.filter(post => post.isArchived === true);
                    setArchivedPosts(archived);
                })
                .catch(console.error);

        } catch (error) {
            console.error("Invalid Token:", error);
            setError('Failed to decode token.');
        }
    }, []);

    const handleEditPost = (post) => {
        setEditPost(post);
        setEditTitle(post.title);
        setEditContent(post.content);
        setEditImages([]);
        setEditStatus(post.status);
    };

    const handleHidePost = (postId) => {
        const token = sessionStorage.getItem('token');
        axios.put(`http://localhost:8080/postandreply/posts/${postId}/hide`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Post has been hidden.");
                window.location.reload();
            })
            .catch(() => alert("Failed to hide post."));
    };

    const handleUnhidePost = (postId) => {
        const token = sessionStorage.getItem('token');
        axios.put(`http://localhost:8080/postandreply/posts/${postId}/unhide`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Post is now public again.");
                window.location.reload();
            })
            .catch(() => alert("Failed to unhide post."));
    };

    const handleArchivePost = (postId) => {
        const token = sessionStorage.getItem('token');
        axios.put(`http://localhost:8080/postandreply/posts/${postId}/archive`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Post archived successfully!");
                window.location.reload();
            })
            .catch(() => alert("Failed to archive post."));
    };

    const handleUnarchivePost = (postId) => {
        const token = sessionStorage.getItem('token');
        axios.put(`http://localhost:8080/postandreply/posts/${postId}/unarchive`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Post unarchived successfully!");
                window.location.reload();
            })
            .catch(() => alert("Failed to unarchive post."));
    };

    const uploadFileToS3 = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', 'password123');

        try {
            const res = await fetch('http://localhost:8087/s3/upload', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            return await res.text();
        } catch (err) {
            console.error('File upload error:', err);
            return null;
        }
    };

    const handleSaveEdit = async () => {
        const token = sessionStorage.getItem('token');
        const uploadedImageUrls = [];
        for (const img of editImages) {
            const url = await uploadFileToS3(img);
            if (url) uploadedImageUrls.push(url);
        }

        const updatedPost = {
            title: editTitle,
            content: editContent,
            images: uploadedImageUrls,
            status: editPost.status === "DRAFT" ? editStatus : editPost.status
        };

        axios.patch(`http://localhost:8080/postandreply/posts/${editPost.postId}`, updatedPost, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Post updated!");
                window.location.reload();
            })
            .catch(() => alert("Failed to update post."));
    };

    const handleDeletePost = (postId) => {
        const token = sessionStorage.getItem('token');
        axios.put(`http://localhost:8080/postandreply/posts/${postId}/delete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                alert("Post marked as deleted.");
                window.location.reload();
            })
            .catch(() => alert("Failed to mark post as deleted."));
    };

    const handleViewPostDetails = (postId) => {
        navigate(`/myposts/${postId}`);
    };

    // ✅ Merged published + archived
    const filteredPublished = [...publishedPosts, ...archivedPosts]
        .filter(post => post.status === "PUBLISHED");
    const filteredDrafts = draftPosts.filter(post => post.status === "DRAFT");
    const bannedPosts = bannedRawPosts;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="myposts-container">
            <h2>My Posts</h2>

            <div className="posts-section">
                <h3>Published Posts</h3>
                {filteredPublished.length > 0 ? (
                    <ul className="post-list">
                        {filteredPublished.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                {post.isArchived && <p style={{ color: 'gray' }}><i>(Archived - comments disabled)</i></p>}
                                <button onClick={() => handleEditPost(post)}>Edit</button>
                                <button onClick={() => handleDeletePost(post.postId)}>Delete</button>
                                <button onClick={() => handleHidePost(post.postId)}>Hide</button>
                                {post.isArchived ? (
                                    <button onClick={() => handleUnarchivePost(post.postId)}>Unarchive</button>
                                ) : (
                                    <button onClick={() => handleArchivePost(post.postId)}>Archive</button>
                                )}
                                <button onClick={() => handleViewPostDetails(post.postId)}>View</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No published posts.</p>
                )}
            </div>

            <div className="posts-section">
                <h3>Draft Posts</h3>
                {filteredDrafts.length > 0 ? (
                    <ul className="post-list">
                        {filteredDrafts.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <button onClick={() => handleEditPost(post)}>Edit</button>
                                <button onClick={() => handleDeletePost(post.postId)}>Delete</button>
                                <button onClick={() => handleViewPostDetails(post.postId)}>View</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No draft posts.</p>
                )}
            </div>

            <div className="posts-section">
                <h3>Banned Posts</h3>
                {bannedPosts.length > 0 ? (
                    <ul className="post-list">
                        {bannedPosts.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <p style={{ color: 'orange' }}><i>This post has been banned by an admin.</i></p>
                                <button onClick={() => handleViewPostDetails(post.postId)}>View</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No banned posts.</p>
                )}
            </div>

            <div className="posts-section">
                <h3>Hidden Posts</h3>
                {hiddenPosts.length > 0 ? (
                    <ul className="post-list">
                        {hiddenPosts.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <p style={{ color: 'gray' }}><i>This post is hidden from public view.</i></p>
                                <button onClick={() => handleEditPost(post)}>Edit</button>
                                <button onClick={() => handleUnhidePost(post.postId)}>Unhide</button>
                                <button onClick={() => handleViewPostDetails(post.postId)}>View</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hidden posts.</p>
                )}
            </div>

            {editPost && (
                <div className="edit-modal">
                    <h3>Edit Post</h3>
                    <label>Title:</label>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />

                    <label>Content:</label>
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />

                    <label>Upload New Images:</label>
                    <input type="file" multiple onChange={(e) => setEditImages(Array.from(e.target.files))} />

                    {editPost.status === "DRAFT" && (
                        <>
                            <label>Status:</label>
                            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </>
                    )}

                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditPost(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default MyPosts;
