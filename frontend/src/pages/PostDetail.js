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

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    });

    // 🔹 获取当前用户信息
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await fetch('http://localhost:8080/users/info', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserInfo(data);
                }
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            }
        };

        fetchUserInfo();
    }, []);

    // 🔹 获取帖子详情和回复
    useEffect(() => {
        fetch(`http://localhost:8080/postandreply/singlePosts/${postId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })
            .then(res => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then(data => {
                setPost(data);
                setReplies(data.postReplies || []);
            })
            .catch(err => {
                console.error('Failed to fetch post:', err);
                setError('Failed to load post.');
            });
    }, [postId]);

    // 🔹 提交一级回复
    const handleReply = async () => {
        if (!replyContent.trim() || !userInfo) return;

        try {
            const response = await fetch(`http://localhost:8080/postandreply/posts/${postId}/replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    comment: replyContent,
                    userId: userInfo.userId,
                    userName: `${userInfo.firstName} ${userInfo.lastName}`,
                }),
            });

            if (!response.ok) throw new Error('Failed to post reply');
            const updatedPost = await response.json();
            setReplies(updatedPost.postReplies);
            setReplyContent('');
        } catch (err) {
            console.error('Reply failed:', err);
        }
    };

    // 🔹 提交子回复
    const handleSubReply = async (replyId) => {
        const content = subReplyContent[replyId];
        if (!content?.trim() || !userInfo) return;

        try {
            const response = await fetch(`http://localhost:8080/postandreply/replies/${replyId}/sub-replies`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    comment: content,
                    userId: userInfo.userId,
                    userName: `${userInfo.firstName} ${userInfo.lastName}`,
                }),
            });

            if (!response.ok) throw new Error('Failed to post sub-reply');
            const updatedPost = await response.json();
            setReplies(updatedPost.postReplies);
            setSubReplyContent(prev => ({ ...prev, [replyId]: '' }));
        } catch (err) {
            console.error('Sub-reply failed:', err);
        }
    };

    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="post-detail" style={{ padding: "20px" }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>By:</strong> {post.userName || `User ${post.userId}`}</p>
            <p>Created: {new Date(post.dateCreated).toLocaleString()}</p>
            <p>Updated: {new Date(post.dateModified).toLocaleString()}</p>

            {post.images?.length > 0 && (
                <div>
                    <h4>Images:</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {post.images.map((img, idx) => (
                            <img key={idx} src={`/${img}`} alt={img} width={120} />
                        ))}
                    </div>
                </div>
            )}

            {post.attachments?.length > 0 && (
                <div>
                    <h4>Attachments:</h4>
                    <ul>
                        {post.attachments.map((file, idx) => (
                            <li key={idx}><a href={`/${file}`} download>{file}</a></li>
                        ))}
                    </ul>
                </div>
            )}

            <hr />
            <h3>Replies</h3>
            <ul>
                {replies.map(reply => (
                    <li key={reply.replyId}>
                        <p><strong>{reply.userName || `User ${reply.userId}`}</strong>: {reply.comment}</p>
                        <ul>
                            {reply.subReplies?.map(sub => (
                                <li key={sub.subReplyId}>
                                    <strong>{sub.userName || `User ${sub.userId}`}</strong>: {sub.comment}
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
            <h4>Write a Reply:</h4>
            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
            />
            <br />
            <button onClick={handleReply}>Reply</button>
        </div>
    );
};

export default PostDetail;
