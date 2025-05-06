

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const UserHome = () => {
//     const [posts, setPosts] = useState([]);
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [tab, setTab] = useState('published');
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const role = localStorage.getItem('role');
//         setIsAdmin(role === 'ADMIN');
//     }, []);
//
//     useEffect(() => {
//         const userId = localStorage.getItem('userId');
//         let url = '';
//
//         if (isAdmin) {
//             url = `http://localhost:8080/postandreply/admin/userAllposts?status=${tab}`;
//         } else {
//             url = `http://localhost:8080/postandreply/userAllposts/${userId}`;
//         }
//
//         fetch(url)
//             .then(res => res.json())
//             .then(data => setPosts(data))
//             .catch(err => console.error('Failed to load posts:', err));
//     }, [tab, isAdmin]);
//
//     const handleAction = (postId, action) => {
//         const url = `http://localhost:8080/postandreply/admin/posts/${postId}/${action}`;
//         fetch(url, {
//             method: 'PUT',
//         })
//             .then(() => setPosts(posts.filter(p => p.id !== postId)))
//             .catch(err => console.error('Action failed:', err));
//     };
//
//     const sortedPosts = [...posts].sort((a, b) => {
//         const dateA = new Date(a.date);
//         const dateB = new Date(b.date);
//         return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
//     });
//
//     return (
//         <div className="user-home">
//             <h2>{isAdmin ? `Admin: ${tab.charAt(0).toUpperCase() + tab.slice(1)} Posts` : 'My Published Posts'}</h2>
//
//             {isAdmin && (
//                 <div className="admin-tabs">
//                     <button onClick={() => setTab('published')}>Published</button>
//                     <button onClick={() => setTab('banned')}>Banned</button>
//                     <button onClick={() => setTab('deleted')}>Deleted</button>
//                 </div>
//             )}
//
//             <div className="actions">
//                 <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
//                     Sort by Date ({sortOrder === 'asc' ? '⬆️' : '⬇️'})
//                 </button>
//                 {!isAdmin && (
//                     <>
//                         <button onClick={() => navigate('/create-post')}>Create New Post</button>
//                         <button onClick={() => navigate('/profile')}>View My Profile</button>
//                     </>
//                 )}
//             </div>
//
//             <ul className="post-list">
//                 {sortedPosts.map(post => (
//                     <li key={post.id} className="post-item">
//                         <strong
//                             onClick={() => navigate(`/posts/${post.id}`)}
//                             style={{ cursor: 'pointer' }}>
//                             {post.title}
//                         </strong>
//                         <br />
//                         By: {post.creator} | {new Date(post.date).toLocaleString()}
//
//                         {isAdmin && tab === 'published' && (
//                             <button onClick={() => handleAction(post.id, 'ban')}>Ban</button>
//                         )}
//                         {isAdmin && tab === 'banned' && (
//                             <button onClick={() => handleAction(post.id, 'unban')}>Unban</button>
//                         )}
//                         {isAdmin && tab === 'deleted' && (
//                             <button onClick={() => handleAction(post.id, 'recover')}>Recover</button>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
//
// export default UserHome;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [tab, setTab] = useState('published');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'ADMIN');
    }, []);

    useEffect(() => {
        // FAKE POSTS FOR FRONTEND TESTING
        const mockPosts = [
            { id: 1, title: 'First Post', creator: 'Alice', date: new Date().toISOString() },
            { id: 2, title: 'Second Post', creator: 'Bob', date: new Date().toISOString() },
            { id: 3, title: 'Third Post', creator: 'Charlie', date: new Date().toISOString() },
        ];
        setPosts(mockPosts);
    }, [tab, isAdmin]);

    const handleAction = (postId, action) => {
        // FAKE ACTION
        setPosts(posts.filter(p => p.id !== postId));
        console.log(`Fake ${action} performed on post ${postId}`);
    };

    const sortedPosts = [...posts].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="user-home">
            <h2>{isAdmin ? `Admin: ${tab.charAt(0).toUpperCase() + tab.slice(1)} Posts` : 'My Published Posts'}</h2>

            {isAdmin && (
                <div className="admin-tabs">
                    <button onClick={() => setTab('published')}>Published</button>
                    <button onClick={() => setTab('banned')}>Banned</button>
                    <button onClick={() => setTab('deleted')}>Deleted</button>
                </div>
            )}

            <div className="actions">

                {!isAdmin && (
                    <>
                        <button onClick={() => navigate('/create-post')}>Create New Post</button>
                        <button onClick={() => navigate('/profile')}>View My Profile</button>
                    </>
                )}
            </div>

            <ul className="post-list">
                {sortedPosts.map(post => (
                    <li key={post.id} className="post-item">
                        <strong
                            onClick={() => navigate(`/posts/${post.id}`)}
                            style={{ cursor: 'pointer' }}>
                            {post.title}
                        </strong>
                        <br />
                        By: {post.creator} | {new Date(post.date).toLocaleString()}

                        {isAdmin && tab === 'published' && (
                            <button onClick={() => handleAction(post.id, 'ban')}>Ban</button>
                        )}
                        {isAdmin && tab === 'banned' && (
                            <button onClick={() => handleAction(post.id, 'unban')}>Unban</button>
                        )}
                        {isAdmin && tab === 'deleted' && (
                            <button onClick={() => handleAction(post.id, 'recover')}>Recover</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserHome;
