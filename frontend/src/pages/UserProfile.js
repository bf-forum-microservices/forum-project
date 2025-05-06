// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// const UserProfile = () => {
//     const [user, setUser] = useState(null);
//     const [topPosts, setTopPosts] = useState([]);
//     const [drafts, setDrafts] = useState([]);
//     const [history, setHistory] = useState([]);
//     const navigate = useNavigate();
//     const userId = localStorage.getItem('userId');
//
//     useEffect(() => {
//         fetch(`http://localhost:8080/users/info?userId=${userId}`)
//             .then(res => res.json())
//             .then(data => setUser(data))
//             .catch(err => console.error('Failed to fetch user:', err));
//
//         fetch(`http://localhost:8080/postandreply/posts/top/${userId}`)
//             .then(res => res.json())
//             .then(data => setTopPosts(data))
//             .catch(err => console.error('Failed to fetch top posts:', err));
//
//         fetch(`http://localhost:8080/postandreply/posts/user/${userId}?status=draft`)
//             .then(res => res.json())
//             .then(data => setDrafts(data))
//             .catch(err => console.error('Failed to fetch drafts:', err));
//
//         fetch(`http://localhost:8080/history/${userId}`)
//             .then(res => res.json())
//             .then(data => setHistory(data))
//             .catch(err => console.error('Failed to fetch view history:', err));
//     }, [userId]);
//
//     const handleEditProfile = () => {
//         navigate('/edit-profile');
//     };
//
//     if (!user) return <div>Loading...</div>;
//
//     return (
//         <div className="user-profile">
//             <h2>User Profile</h2>
//             <img src={user.profileImageUrl || '/default-profile.jpg'} alt="Profile" width={150} height={150} />
//             <p><strong>First Name:</strong> {user.firstName}</p>
//             <p><strong>Last Name:</strong> {user.lastName}</p>
//             <p><strong>Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
//             <button onClick={handleEditProfile}>Edit Profile</button>
//
//             <h3>Top 3 Posts by Replies</h3>
//             <ul>
//                 {topPosts.map(post => (
//                     <li key={post.id}>{post.title} ({post.replyCount} replies)</li>
//                 ))}
//             </ul>
//
//             <h3>Your Drafts</h3>
//             <ul>
//                 {drafts.map(post => (
//                     <li key={post.id}>{post.title}</li>
//                 ))}
//             </ul>
//
//             <h3>View History (Published Only)</h3>
//             <ul>
//                 {history
//                     .filter(h => h.status === 'PUBLISHED')
//                     .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
//                     .map(h => (
//                         <li key={h.postId}>{h.title} - {new Date(h.viewedAt).toLocaleString()}</li>
//                     ))}
//             </ul>
//         </div>
//     );
// };
//
// export default UserProfile;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState({
        profileImageUrl: '',
        firstName: 'Jane',
        lastName: 'Doe',
        dateJoined: '2024-01-01T00:00:00Z'
    });
    const [topPosts, setTopPosts] = useState([
        { id: 1, title: 'Top Post 1', replyCount: 12 },
        { id: 2, title: 'Top Post 2', replyCount: 9 },
        { id: 3, title: 'Top Post 3', replyCount: 5 }
    ]);
    const [drafts, setDrafts] = useState([
        { id: 4, title: 'Draft 1' },
        { id: 5, title: 'Draft 2' }
    ]);
    const [history, setHistory] = useState([
        { postId: 6, title: 'Viewed Post 1', status: 'PUBLISHED', viewedAt: '2025-05-05T14:30:00Z' },
        { postId: 7, title: 'Viewed Post 2', status: 'PUBLISHED', viewedAt: '2025-05-04T10:20:00Z' }
    ]);
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <img src={user.profileImageUrl || '/default-profile.jpg'} alt="Profile" width={150} height={150} />
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
            <button onClick={handleEditProfile}>Edit Profile</button>

            <h3>Top 3 Posts by Replies</h3>
            <ul>
                {topPosts.map(post => (
                    <li key={post.id}>{post.title} ({post.replyCount} replies)</li>
                ))}
            </ul>

            <h3>Your Drafts</h3>
            <ul>
                {drafts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>

            <h3>View History (Published Only)</h3>
            <ul>
                {history
                    .filter(h => h.status === 'PUBLISHED')
                    .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
                    .map(h => (
                        <li key={h.postId}>{h.title} - {new Date(h.viewedAt).toLocaleString()}</li>
                    ))}
            </ul>
        </div>
    );
};

export default UserProfile;
