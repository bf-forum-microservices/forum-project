import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [tab, setTab] = useState('published');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        setIsAdmin(role === 'ADMIN');
    }, []);

    useEffect(() => {
        let url = '';

        if (isAdmin) {
            url = `http://localhost:8080/postandreply/admin/userAllposts?status=${tab}`;
        } else {
            url = `http://localhost:8080/postandreply/posts/published`;
        }

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => setPosts(data))
            .catch(err => {
                if (err.message === 'Unauthorized') {
                    alert('Unauthorized. Please login again.');
                } else {
                    console.error('Failed to load posts:', err);
                }
            });
    }, [tab, isAdmin]);

    const handleAction = (postId, action) => {
        const url = `http://localhost:8080/postandreply/admin/posts/${postId}/${action}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(() => setPosts(posts.filter(p => p.postId !== postId)))
            .catch(err => console.error('Action failed:', err));
    };

    const sortedPosts = [...posts].sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="user-home">
            <h2>{isAdmin ? `Admin: ${tab.charAt(0).toUpperCase() + tab.slice(1)} Posts` : 'All Published Posts'}</h2>

            {isAdmin && (
                <div className="admin-tabs">
                    <button onClick={() => setTab('published')}>Published</button>
                    <button onClick={() => setTab('banned')}>Banned</button>
                    <button onClick={() => setTab('deleted')}>Deleted</button>
                </div>
            )}

            <div className="actions">
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sort by Date ({sortOrder === 'asc' ? '⬆️' : '⬇️'})
                </button>
                {!isAdmin && (
                    <>
                        <button onClick={() => navigate('/create-post')}>Create New Post</button>
                        <button onClick={() => navigate('/profile')}>View My Profile</button>
                    </>
                )}
            </div>

            <ul className="post-list">
                {sortedPosts.map(post => (
                    <li key={post.postId} className="post-item">
                        <strong
                            onClick={() => navigate(`/posts/${post.postId}`)}
                            style={{ cursor: 'pointer' }}>
                            {post.title || '(No Title)'}
                        </strong>
                        <br />
                        By: {post.userName} | {new Date(post.dateCreated).toLocaleString('en-US', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}

                        {isAdmin && tab === 'published' && (
                            <button onClick={() => handleAction(post.postId, 'ban')}>Ban</button>
                        )}
                        {isAdmin && tab === 'banned' && (
                            <button onClick={() => handleAction(post.postId, 'unban')}>Unban</button>
                        )}
                        {isAdmin && tab === 'deleted' && (
                            <button onClick={() => handleAction(post.postId, 'recover')}>Recover</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserHome;