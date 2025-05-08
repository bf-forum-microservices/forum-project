

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailDeleteReplies = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    });

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/postandreply/singlePosts/${postId}`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    throw new Error("Failed to load post details");
                }

                const data = await response.json();
                console.log("Fetched Post Data:", data);
                setPost(data);
            } catch (err) {
                console.error("Error loading post details:", err);
                setError("Failed to load post details. Please try again later.");
            }
        };

        if (postId) {
            fetchPostDetails();
        }
    }, [postId]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="post-detail" style={{ padding: "20px" }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            <p><strong>Status:</strong> {post.status}</p>
            <p><strong>Created:</strong> {new Date(post.dateCreated).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(post.dateModified).toLocaleString()}</p>

            {post.images && post.images.length > 0 && (
                <div>
                    <h4>Images:</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {post.images.map((img, idx) => img && (
                            <img key={idx} src={`/${img}`} alt={img} width={120} />
                        ))}
                    </div>
                </div>
            )}

            {post.attachments && post.attachments.length > 0 && (
                <div>
                    <h4>Attachments:</h4>
                    <ul>
                        {post.attachments.map((file, idx) => file && (
                            <li key={idx}><a href={`/${file}`} download>{file}</a></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PostDetailDeleteReplies;
