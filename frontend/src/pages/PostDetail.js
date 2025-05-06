// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
//
// const PostDetail = () => {
//     const { id } = useParams();
//     const [post, setPost] = useState(null);
//     const [replies, setReplies] = useState([]);
//     const [replyContent, setReplyContent] = useState('');
//     const [subReplyContent, setSubReplyContent] = useState({});
//     const [error, setError] = useState('');
//     const { id: postId } = useParams();
//
//     useEffect(() => {
//         fetch(`http://localhost:8080/postandreply/singlePosts/{id}`)
//             .then(res => res.json())
//             .then(data => {
//                 setPost(data);
//                 setReplies(data.replies || []);
//             })
//             .catch(err => {
//                 console.error('Failed to fetch post:', err);
//                 setError('Failed to load post.');
//             });
//     }, [id]);
//
//     const handleReply = async () => {
//         if (!replyContent.trim()) return;
//
//         try {
//             const response = await fetch(`http://localhost:8080/postandreply/posts/${postId}/replies`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     content: replyContent,
//                     userId: localStorage.getItem('userId'), // if required
//                 }),
//             });
//
//             if (!response.ok) throw new Error('Failed to post reply');
//
//             const createdReply = await response.json();
//             setReplies(prev => [...prev, createdReply]); // update UI with new reply
//             setReplyContent('');
//         } catch (err) {
//             console.error('Reply failed:', err);
//         }
//     };
//
//
//     const handleSubReply = async (parentReplyId, subReplyContent) => {
//         if (!subReplyContent.trim()) return;
//
//         try {
//             const response = await fetch(`http://localhost:8080/postandreply/replies/${parentReplyId}/sub-replies`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     content: subReplyContent,
//                     userId: localStorage.getItem('userId'), // if required
//                 }),
//             });
//
//             if (!response.ok) throw new Error('Failed to post sub-reply');
//
//             const createdSubReply = await response.json();
//
//             // Update the subReplies in the UI
//             setReplies(prev =>
//                 prev.map(reply =>
//                     reply.id === parentReplyId
//                         ? { ...reply, subReplies: [...(reply.subReplies || []), createdSubReply] }
//                         : reply
//                 )
//             );
//         } catch (err) {
//             console.error('Sub-reply failed:', err);
//         }
//     };
//
//
//     if (error) return <p>{error}</p>;
//     if (!post) return <p>Loading...</p>;
//
//     return (
//         <div className="post-detail">
//             <h2>{post.title}</h2>
//             <p>{post.description}</p>
//             <p>
//                 By: {post.creator?.name}{' '}
//                 <img src={post.creator?.profileImage} alt="avatar" style={{ width: 40, borderRadius: '50%' }} />
//             </p>
//             <p>Created: {new Date(post.createdAt).toLocaleString()}</p>
//             {post.updatedAt && <p>Updated: {new Date(post.updatedAt).toLocaleString()}</p>}
//
//             {post.attachments?.length > 0 && (
//                 <div>
//                     <h4>Attachments:</h4>
//                     <ul>
//                         {post.attachments.map((file, i) => (
//                             <li key={i}><a href={file.url} target="_blank" rel="noreferrer">{file.name}</a></li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//
//             <hr />
//             <h3>Replies</h3>
//             <ul>
//                 {replies.map(reply => (
//                     <li key={reply.id}>
//                         <img src={reply.user.profileImage} alt="avatar" width={30} style={{ borderRadius: '50%' }} />
//                         <strong>{reply.user.name}</strong>: {reply.content}
//                         <ul>
//                             {reply.subReplies?.map(sub => (
//                                 <li key={sub.id}>
//                                     <img src={sub.user.profileImage} alt="avatar" width={25} style={{ borderRadius: '50%' }} />
//                                     <strong>{sub.user.name}</strong>: {sub.content}
//                                 </li>
//                             ))}
//                         </ul>
//
//                         <input
//                             placeholder="Reply to this reply..."
//                             value={subReplyContent[reply.id] || ''}
//                             onChange={(e) =>
//                                 setSubReplyContent({ ...subReplyContent, [reply.id]: e.target.value })
//                             }
//                         />
//                         <button onClick={() => handleSubReply(reply.id)}>Send</button>
//                     </li>
//                 ))}
//             </ul>
//
//             <hr />
//             <h4>Write a Reply:</h4>
//             <textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder="Write your reply here..."
//             />
//             <br />
//             <button onClick={handleReply}>Reply</button>
//         </div>
//     );
// };
//
// export default PostDetail;



import React from 'react';

const PostDetail = () => {
    const post = {
        title: 'How to Build a Microservice',
        description: 'This post explains how to set up a microservice using Spring Boot and React.',
        user: {
            name: 'Jane Doe',
            profileImageUrl: 'https://via.placeholder.com/100'
        },
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z',
        attachment: 'project-architecture.pdf'
    };

    const replies = [
        {
            id: 1,
            user: {
                name: 'John Smith',
                profileImageUrl: 'https://via.placeholder.com/80'
            },
            message: 'Great post! Thanks for sharing.',
            subReplies: [
                {
                    id: 11,
                    user: {
                        name: 'Alice',
                        profileImageUrl: 'https://via.placeholder.com/60'
                    },
                    message: 'Agreed. Super helpful!'
                }
            ]
        },
        {
            id: 2,
            user: {
                name: 'Bob Lee',
                profileImageUrl: 'https://via.placeholder.com/80'
            },
            message: 'How do you manage environment configs?'
        }
    ];

    return (
        <div className="post-detail">
            <h2>{post.title}</h2>
            <div className="post-meta">
                <img src={post.user.profileImageUrl} alt="User" width={60} />
                <p><strong>{post.user.name}</strong></p>
                <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
            </div>
            <p>{post.description}</p>
            {post.attachment && (
                <p>Attachment: <a href={`/${post.attachment}`} download>{post.attachment}</a></p>
            )}

            <h3>Replies</h3>
            <ul>
                {replies.map(reply => (
                    <li key={reply.id}>
                        <img src={reply.user.profileImageUrl} alt="Replier" width={40} />
                        <strong>{reply.user.name}</strong>: {reply.message}
                        {reply.subReplies && (
                            <ul>
                                {reply.subReplies.map(sub => (
                                    <li key={sub.id}>
                                        <img src={sub.user.profileImageUrl} alt="Sub-replier" width={30} />
                                        <strong>{sub.user.name}</strong>: {sub.message}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <h4>Reply to this post</h4>
            <textarea placeholder="Write your reply..."></textarea>
            <br />
            <button>Submit Reply</button>
        </div>
    );
};

export default PostDetail;
