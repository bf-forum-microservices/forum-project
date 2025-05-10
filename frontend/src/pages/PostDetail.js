import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
    const { id: postId } = useParams();
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [subReplyContent, setSubReplyContent] = useState({});
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [avatarMap, setAvatarMap] = useState({});

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    });

    useEffect(() => {
        fetch('http://localhost:8080/users/info', {
            headers: getAuthHeaders(),
        })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => {
                console.error('Failed to fetch user info:', err);
                setError('Failed to fetch user info.');
            });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/postandreply/singlePosts/${postId}`, {
            headers: getAuthHeaders(),
        })
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setReplies(data.postReplies || []);
            })
            .catch(err => {
                console.error('Failed to fetch post:', err);
                setError('Failed to load post.');
            });
    }, [postId]);

    useEffect(() => {
        const fetchUserInfoById = async (userId) => {
            if (avatarMap[userId]) return;
            try {
                const res = await fetch(`http://localhost:8080/users/infoByUserId/${userId}`, {
                    headers: getAuthHeaders(),
                });
                if (res.ok) {
                    const data = await res.json();
                    setAvatarMap(prev => ({
                        ...prev,
                        [userId]: {
                            userName: `${data.firstName} ${data.lastName}`,
                            profileImageURL: data.profileImageURL
                        }
                    }));
                }
            } catch (err) {
                console.error(`Failed to load avatar for user ${userId}:`, err);
            }
        };

        if (post) fetchUserInfoById(post.userId);
        replies.forEach(reply => {
            fetchUserInfoById(reply.userId);
            reply.subReplies?.forEach(sub => fetchUserInfoById(sub.userId));
        });
    }, [post, replies]);

    const isReadOnly = post?.status !== 'PUBLISHED' || post?.isArchived;

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            const res = await fetch(`http://localhost:8080/postandreply/posts/${postId}/replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    comment: replyContent,
                    userId: userInfo.userId,
                    userName: `${userInfo.firstName} ${userInfo.lastName}`
                }),
            });
            const updatedPost = await res.json();
            setReplies(updatedPost.postReplies);
            setReplyContent('');
        } catch (err) {
            console.error('Reply failed:', err);
        }
    };

    const handleSubReply = async (replyId) => {
        const content = subReplyContent[replyId];
        if (!content?.trim()) return;
        try {
            const res = await fetch(`http://localhost:8080/postandreply/replies/${replyId}/sub-replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    comment: content,
                    userId: userInfo.userId,
                    userName: `${userInfo.firstName} ${userInfo.lastName}`
                }),
            });
            const updatedPost = await res.json();
            setReplies(updatedPost.postReplies);
            setSubReplyContent(prev => ({ ...prev, [replyId]: '' }));
        } catch (err) {
            console.error('Sub-reply failed:', err);
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await fetch(`http://localhost:8080/postandreply/posts/replies/${replyId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            setReplies(prev => prev.filter(r => r.replyId !== replyId));
        } catch (err) {
            console.error('Delete reply failed:', err);
        }
    };

    const handleDeleteSubReply = async (subReplyId) => {
        try {
            await fetch(`http://localhost:8080/postandreply/posts/replies/sub-replies/${subReplyId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            setReplies(prev =>
                prev.map(reply => ({
                    ...reply,
                    subReplies: reply.subReplies.filter(sub => sub.subReplyId !== subReplyId)
                }))
            );
        } catch (err) {
            console.error('Delete sub-reply failed:', err);
        }
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>
                {post.title}{' '}
                {post.isArchived && (
                    <span style={{ color: 'gray', fontSize: '0.9rem', marginLeft: '10px' }}>
                        [ARCHIVED - Comments disabled]
                    </span>
                )}
            </h2>
            <p>{post.content}</p>

            {post.images?.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                    <h4>Images:</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {post.images.map((img, i) => (
                            <img key={i} src={img} alt={`img-${i}`} width={120} />
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
                    <li key={reply.replyId} style={{ marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {avatarMap[reply.userId]?.profileImageURL && (
                                <img
                                    src={avatarMap[reply.userId].profileImageURL}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: "50%" }}
                                />
                            )}
                            <strong>{avatarMap[reply.userId]?.userName || `User ${reply.userId}`}</strong>: {reply.comment}
                            {userInfo?.userId === reply.userId && !isReadOnly && (
                                <button onClick={() => handleDeleteReply(reply.replyId)} style={{ color: 'red' }}>
                                    Delete
                                </button>
                            )}
                        </div>
                        <ul style={{ paddingLeft: '40px' }}>
                            {reply.subReplies?.map(sub => (
                                <li key={sub.subReplyId}>
                                    <strong>{avatarMap[sub.userId]?.userName || `User ${sub.userId}`}</strong>: {sub.comment}
                                    {userInfo?.userId === sub.userId && !isReadOnly && (
                                        <button onClick={() => handleDeleteSubReply(sub.subReplyId)} style={{ color: 'red', marginLeft: '8px' }}>
                                            Delete
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {!isReadOnly && (
                            <>
                                <input
                                    value={subReplyContent[reply.replyId] || ''}
                                    onChange={(e) =>
                                        setSubReplyContent({ ...subReplyContent, [reply.replyId]: e.target.value })
                                    }
                                    placeholder="Reply to this reply..."
                                />
                                <button onClick={() => handleSubReply(reply.replyId)} disabled={!userInfo?.active}>
                                    Send Sub-reply
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <hr />
            <h4>Write a Reply:</h4>
            {!userInfo?.active && <p style={{ color: 'red' }}>You need to verify your email first.</p>}
            {isReadOnly ? (
                <p style={{ color: "gray" }}><i>This post is not open for replies.</i></p>
            ) : (
                <>
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        disabled={!userInfo?.active}
                    />
                    <br />
                    <button onClick={handleReply} disabled={!userInfo?.active}>Reply</button>
                </>
            )}
        </div>
    );
};

export default PostDetail;
