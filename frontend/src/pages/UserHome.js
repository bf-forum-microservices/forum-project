import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [tab, setTab] = useState('published');
    const [isAdmin, setIsAdmin] = useState(false);
    const [avatarMap, setAvatarMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
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
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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

    const fetchUserInfo = async (userId) => {
        if (avatarMap[userId]) return;

        try {
            const res = await fetch(`http://localhost:8080/users/infoByUserId/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
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
            console.error(`Failed to fetch user info for userId ${userId}:`, err);
        }
    };

    useEffect(() => {
        posts.forEach(post => {
            fetchUserInfo(post.userId);
        });
    }, [posts]);

    const handleAction = (postId, action) => {
        const url = `http://localhost:8080/postandreply/admin/posts/${postId}/${action}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                            {avatarMap[post.userId]?.profileImageURL && (
                                <img
                                    src={avatarMap[post.userId].profileImageURL}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: '50%' }}
                                />
                            )}
                            <span>
                                By: {avatarMap[post.userId]?.userName || 'Loading...'} |{' '}
                                {new Date(post.dateCreated).toLocaleString('en-US', {
                                    year: 'numeric', month: '2-digit', day: '2-digit',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                })}
                            </span>
                        </div>

                        {isAdmin && (
                            <div style={{ marginTop: '5px' }}>
                                {tab === 'published' && (
                                    <button onClick={() => handleAction(post.postId, 'ban')}>Ban</button>
                                )}
                                {tab === 'banned' && (
                                    <button onClick={() => handleAction(post.postId, 'unban')}>Unban</button>
                                )}
                                {tab === 'deleted' && (
                                    <button onClick={() => handleAction(post.postId, 'recover')}>Recover</button>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserHome;
