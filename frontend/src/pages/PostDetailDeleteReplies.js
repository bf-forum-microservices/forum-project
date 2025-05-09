import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PostDetailDeleteReplies = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [subReplyContent, setSubReplyContent] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    });

    // 获取用户信息
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await fetch('http://localhost:8080/users/info', {
                    headers: getAuthHeaders(),
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserInfo(data);
                }
            } catch (err) {
                console.error('Failed to fetch user info:', err);
                setError('Failed to fetch user info.');
            }
        };
        fetchUserInfo();
    }, []);

    // 获取帖子详情
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/postandreply/singlePosts/${postId}`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });

                if (!response.ok) throw new Error("Failed to load post details");

                const data = await response.json();
                setPost(data);
                setReplies(data.postReplies || []);
            } catch (err) {
                console.error("Error loading post details:", err);
                setError("Failed to load post details. Please try again later.");
            }
        };

        if (postId) fetchPostDetails();
    }, [postId]);

    const handleReply = async () => {
        if (!replyContent.trim() || !userInfo) return;

        try {
            const response = await fetch(`http://localhost:8080/postandreply/posts/${postId}/replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    userId: userInfo.userId,
                    comment: replyContent,
                    subReplies: [],
                }),
            });

            if (!response.ok) throw new Error("Failed to post reply");

            const updatedPost = await response.json();
            setReplies(updatedPost.postReplies || []);
            setReplyContent('');
        } catch (err) {
            console.error("Reply failed:", err);
            setError("Failed to post reply. Please try again.");
        }
    };

    const handleSubReply = async (replyId) => {
        const content = subReplyContent[replyId];
        if (!content?.trim() || !userInfo) return;

        try {
            const response = await fetch(`http://localhost:8080/postandreply/replies/${replyId}/sub-replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    userId: userInfo.userId,
                    comment: content,
                }),
            });

            if (!response.ok) throw new Error("Failed to post sub-reply");

            const updatedPost = await response.json();
            setReplies(updatedPost.postReplies || []);
            setSubReplyContent(prev => ({ ...prev, [replyId]: '' }));
        } catch (err) {
            console.error("Sub-reply failed:", err);
            setError("Failed to post sub-reply. Please try again.");
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            const response = await fetch(`http://localhost:8080/postandreply/posts/replies/${replyId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error("Failed to delete reply");

            setReplies(prevReplies => prevReplies.filter(reply => reply.replyId !== replyId));
        } catch (err) {
            console.error("Failed to delete reply:", err);
            setError("Failed to delete reply. Please try again.");
        }
    };

    const handleDeleteSubReply = async (subReplyId) => {
        try {
            const response = await fetch(`http://localhost:8080/postandreply/posts/replies/sub-replies/${subReplyId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) throw new Error("Failed to delete sub-reply");

            setReplies(prevReplies =>
                prevReplies.map(reply => ({
                    ...reply,
                    subReplies: reply.subReplies.filter(sub => sub.subReplyId !== subReplyId)
                }))
            );
        } catch (err) {
            console.error("Failed to delete sub-reply:", err);
            setError("Failed to delete sub-reply. Please try again.");
        }
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="post-detail" style={{ padding: "20px" }}>
            <button
                onClick={() => navigate('/myposts')}
                style={{
                    marginBottom: "15px",
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                ← Back to My Posts
            </button>
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            {post.images?.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                    <h4>Images:</h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {post.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`post-img-${idx}`}
                                style={{
                                    width: '180px',
                                    height: 'auto',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <p><strong>Status:</strong> {post.status}</p>
            <p><strong>Created:</strong> {new Date(post.dateCreated).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(post.dateModified).toLocaleString()}</p>

            <hr />
            <h3>Replies</h3>
            <ul>
                {replies.map(reply => (
                    <li key={reply.replyId} style={{ marginBottom: "15px" }}>
                        <strong>User {reply.userId}:</strong> {reply.comment}
                        <button onClick={() => handleDeleteReply(reply.replyId)} style={{ marginLeft: "10px", color: "red" }}>
                            Delete Reply
                        </button>

                        <ul style={{ marginLeft: "20px" }}>
                            {reply.subReplies?.map(sub => (
                                <li key={sub.subReplyId}>
                                    <strong>User {sub.userId}:</strong> {sub.comment}
                                    <button onClick={() => handleDeleteSubReply(sub.subReplyId)} style={{ marginLeft: "10px", color: "red" }}>
                                        Delete Sub-reply
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <input
                            value={subReplyContent[reply.replyId] || ''}
                            onChange={(e) =>
                                setSubReplyContent({ ...subReplyContent, [reply.replyId]: e.target.value })
                            }
                            placeholder="Reply to this reply..."
                        />
                        <button onClick={() => handleSubReply(reply.replyId)}>Send Sub-reply</button>
                    </li>
                ))}
            </ul>

            <hr />
            <h4>Add a Reply:</h4>
            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
            />
            <br />
            <button onClick={handleReply}>Send Reply</button>
        </div>
    );
};

export default PostDetailDeleteReplies;
