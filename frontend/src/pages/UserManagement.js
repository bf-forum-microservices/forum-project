// import React, { useEffect, useState } from 'react';
//
// const AdminUserManagement = () => {
//     const [users, setUsers] = useState([]);
//
//     useEffect(() => {
//         fetch('http://localhost:8080/users') // Adjust if needed
//             .then(res => res.json())
//             .then(data => setUsers(data))
//             .catch(err => console.error('Failed to load users:', err));
//     }, []);
//
//     const handleToggleStatus = (userId, currentStatus, type) => {
//         if (type === 'ADMIN') {
//             alert('You cannot ban another admin.');
//             return;
//         }
//
//         const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
//
//         fetch(`http://localhost:8080/users/${userId}/status`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: newStatus }),
//         })
//             .then(() => {
//                 setUsers(prev =>
//                     prev.map(u =>
//                         u.userId === userId ? { ...u, status: newStatus } : u
//                     )
//                 );
//             })
//             .catch(err => console.error('Failed to update user status:', err));
//     };
//
//     return (
//         <div className="admin-user-management">
//             <h2>User Management</h2>
//             <table border="1" cellPadding="8" cellSpacing="0">
//                 <thead>
//                 <tr>
//                     <th>User ID</th>
//                     <th>Full Name</th>
//                     <th>Email</th>
//                     <th>Date Joined</th>
//                     <th>Type</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {users.map(user => (
//                     <tr key={user.userId}>
//                         <td>{user.userId}</td>
//                         <td>{user.firstName} {user.lastName}</td>
//                         <td>{user.email}</td>
//                         <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
//                         <td>{user.type}</td>
//                         <td>{user.status}</td>
//                         <td>
//                             <button
//                                 onClick={() =>
//                                     handleToggleStatus(user.userId, user.status, user.type)
//                                 }
//                                 disabled={user.type === 'ADMIN'}
//                             >
//                                 {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
//                             </button>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
//
// export default AdminUserManagement;

// import React, { useState } from 'react';
//
// const UserManagement = () => {
//     const [users, setUsers] = useState([
//         {
//             userId: 1,
//             firstName: 'Alice',
//             lastName: 'Johnson',
//             email: 'alice@example.com',
//             type: 'USER',
//             status: 'ACTIVE',
//         },
//         {
//             userId: 2,
//             firstName: 'Bob',
//             lastName: 'Smith',
//             email: 'bob@example.com',
//             type: 'ADMIN',
//             status: 'ACTIVE',
//         },
//         {
//             userId: 3,
//             firstName: 'Charlie',
//             lastName: 'Brown',
//             email: 'charlie@example.com',
//             type: 'USER',
//             status: 'BANNED',
//         },
//     ]);
//
//     const handleToggleStatus = (userId, status, type) => {
//         if (type === 'ADMIN') {
//             alert('You cannot ban another admin.');
//             return;
//         }
//
//         const updated = users.map(user =>
//             user.userId === userId
//                 ? {
//                     ...user,
//                     status: user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE',
//                 }
//                 : user
//         );
//         setUsers(updated);
//     };
//
//     return (
//         <div className="user-management">
//             <h2>User Management</h2>
//             <table>
//                 <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Type</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {users.map(user => (
//                     <tr key={user.userId}>
//                         <td>{user.firstName} {user.lastName}</td>
//                         <td>{user.email}</td>
//                         <td>{user.type}</td>
//                         <td>{user.status}</td>
//                         <td>
//                             <button
//                                 onClick={() =>
//                                     handleToggleStatus(user.userId, user.status, user.type)
//                                 }
//                                 disabled={user.type === 'ADMIN'}
//                             >
//                                 {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
//                             </button>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
//
// export default UserManagement;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:8080/users/admin/allUserInfo', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setUsers(res.data))
            .catch(() => setError('Failed to fetch users.'));
    }, []);

    const handleBan = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/users/admin/users/${userId}/ban`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`User ${userId} has been banned`);
            refreshUsers();
        } catch {
            alert('Failed to ban user.');
        }
    };

    const handleActivate = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/users/admin/users/${userId}/activate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`User ${userId} has been activated`);
            refreshUsers();
        } catch {
            alert('Failed to activate user.');
        }
    };

    const refreshUsers = () => {
        axios.get('http://localhost:8080/users/admin/allUserInfo', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setUsers(res.data))
            .catch(() => setError('Failed to refresh users.'));
    };

    if (error) return <p>{error}</p>;
    if (!users.length) return <p>Loading users...</p>;

    return (
        <div className="manage-users">
            <h2>Manage Users</h2>
            <table>
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Profile</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Banned</th>
                    <th>Actions</th>

                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>
                            <img
                                src={user.profileImageURL || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                width="40"
                            />
                        </td>
                        <td>{user.email}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.type}</td>
                        <td>
                              <span className={user.banned ? 'badge-banned' : 'badge-active'}>
                                {user.banned ? 'Banned' : 'Active'}
                              </span>
                        </td>
                        <td>
                            <button onClick={() => handleBan(user.userId)}>Ban</button>
                            <button onClick={() => handleActivate(user.userId)}>Activate</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;