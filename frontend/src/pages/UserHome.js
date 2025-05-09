import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [tab, setTab] = useState('published');
    const [isAdmin, setIsAdmin] = useState(false);
    const [avatarMap, setAvatarMap] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const navigate = useNavigate();

    // 获取当前用户角色和信息
    useEffect(() => {
        const role = sessionStorage.getItem('role');
        setIsAdmin(role === 'ADMIN' || role === 'SUPER_ADMIN');

        const fetchCurrentUser = async () => {
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
                console.error('Failed to fetch current user info:', err);
            } finally {
                setIsUserLoaded(true);
            }
        };

        fetchCurrentUser();
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

    const fetchUserInfo = async (userId) => {
        if (avatarMap[userId]) return;

        try {
            const res = await fetch(`http://localhost:8080/users/infoByUserId/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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
        if (userInfo) {
            posts.forEach(post => {
                fetchUserInfo(post.userId);
            });
        }
    }, [posts, userInfo]);

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

    const saveViewHistory = async (postId) => {
        try {
            const userId = userInfo?.userId;
            if (!userId) return;

            // Record the post view in the history database
            const response = await fetch(`http://localhost:8080/history/${userId}?postId=${postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Post view recorded successfully');
                // Navigate to the post detail page after recording the view
                navigate(`/posts/${postId}`);
            } else {
                console.error('Failed to record post view:', response.status);
                alert('Failed to record post view. Please try again.');
            }
        } catch (err) {
            console.error('Error recording post view:', err);
            alert('An error occurred. Please try again later.');
        }
    };

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
                {isUserLoaded && (
                    <>
                        <button
                            onClick={() => {
                                if (userInfo?.active) {
                                    navigate('/create-post');
                                } else {
                                    alert('Please verify your email first.');
                                }
                            }}
                        >
                            Create New Post
                        </button>

                        <button onClick={() => navigate('/profile')}>View My Profile</button>
                    </>
                )}

            </div>

            <ul className="post-list">
                {sortedPosts.map(post => (
                    <li key={post.postId} className="post-item">
                        <strong
                            onClick={() => {
                                saveViewHistory(post.postId);
                                navigate(`/posts/${post.postId}`);
                            }}
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
