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

import React, { useState } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([
        {
            userId: 1,
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@example.com',
            type: 'USER',
            status: 'ACTIVE',
        },
        {
            userId: 2,
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob@example.com',
            type: 'ADMIN',
            status: 'ACTIVE',
        },
        {
            userId: 3,
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie@example.com',
            type: 'USER',
            status: 'BANNED',
        },
    ]);

    const handleToggleStatus = (userId, status, type) => {
        if (type === 'ADMIN') {
            alert('You cannot ban another admin.');
            return;
        }

        const updated = users.map(user =>
            user.userId === userId
                ? {
                    ...user,
                    status: user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE',
                }
                : user
        );
        setUsers(updated);
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.userId}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.type}</td>
                        <td>{user.status}</td>
                        <td>
                            <button
                                onClick={() =>
                                    handleToggleStatus(user.userId, user.status, user.type)
                                }
                                disabled={user.type === 'ADMIN'}
                            >
                                {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;

