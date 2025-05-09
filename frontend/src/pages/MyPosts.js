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
    const [editPost, setEditPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editImages, setEditImages] = useState([]);
    const [editStatus, setEditStatus] = useState('');
    const navigate = useNavigate();
    const [bannedRawPosts, setBannedRawPosts] = useState([]);



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

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=published`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setPublishedPosts(response.data); // 不再过滤 isArchived
                })
                .catch(err => {
                    console.error("Failed to load published posts:", err);
                    setError('Failed to load published posts.');
                });

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=draft`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setDraftPosts(response.data); // 不再过滤 isArchived
                })
                .catch(err => {
                    console.error("Failed to load draft posts:", err);
                    setError('Failed to load draft posts.');
                });

            axios.get(`http://localhost:8080/postandreply/posts/user/${userIdFromToken}?status=banned`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setBannedRawPosts(response.data);
                })
                .catch(err => {
                    console.error("Failed to load banned posts:", err);
                });


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
            .then(response => {
                alert("Post updated successfully!");
                window.location.reload();
            })
            .catch(err => {
                console.error("Failed to update post:", err);
                alert("Failed to update post.");
            });
    };

    const handleDeletePost = (postId) => {
        const token = sessionStorage.getItem('token');

        if (!postId) {
            console.error("Invalid postId:", postId);
            alert("Invalid post ID.");
            return;
        }

        axios.delete(`http://localhost:8080/postandreply/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                alert("Post deleted successfully!");
                window.location.reload(); // 简单方式重新加载数据
            })
            .catch(err => {
                console.error("Failed to delete post:", err);
                alert("Failed to delete post.");
            });
    };

    const handleViewPostDetails = (postId) => {
        navigate(`/myposts/${postId}`);
    };

    const filteredPublished = publishedPosts.filter(
        post => !post.isArchived && post.status === "PUBLISHED"
    );
    const filteredDrafts = draftPosts.filter(
        post => !post.isArchived && post.status === "DRAFT"
    );
    const bannedPosts = bannedRawPosts.filter(post => !post.isArchived);

    const deletedPosts = [...publishedPosts, ...draftPosts].filter(post => post.isArchived);


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
                                <button onClick={() => handleEditPost(post)}>Edit</button>
                                <button onClick={() => handleDeletePost(post.postId)}>Delete Post</button>
                                <button onClick={() => handleViewPostDetails(post.postId)}>View Details</button>
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
                                <button onClick={() => handleDeletePost(post.postId)}>Delete Post</button>
                                <button onClick={() => handleViewPostDetails(post.postId)}>View Details</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No draft posts.</p>
                )}
            </div>

            <div className="posts-section">
                <h3>Deleted Posts</h3>
                {deletedPosts.length > 0 ? (
                    <ul className="post-list">
                        {deletedPosts.map(post => (
                            <li key={post.postId} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <p style={{ color: 'gray' }}><i>This post has been deleted.</i></p>
                                <button onClick={() => handleViewPostDetails(post.postId)}>View Details</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No deleted posts.</p>
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
                                <button onClick={() => handleViewPostDetails(post.postId)}>View Details</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No banned posts.</p>
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
