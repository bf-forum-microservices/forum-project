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

    const handlePromote = async (userId) => {
        const token = sessionStorage.getItem('token');

        try {
            const res = await axios.put(`http://localhost:8080/users/admin/users/${userId}/promote`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(res.data); // e.g., "User promoted to ADMIN"
            refreshUsers();  // Re-fetch user list
        } catch (error) {
            if (error.response) {
                // Try to show message safely
                const errMsg =
                    typeof error.response.data === 'string'
                        ? error.response.data
                        : error.response.data.message || 'An error occurred.';
                alert(errMsg);
                //alert(error.response.data.message); // e.g., "User is already ADMIN or SUPER_ADMIN"
            } else {
                alert("Failed to promote user.");
            }
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
        <div className="container mt-5">
            <h2 className="mb-4 text-center">User Management</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                    <thead className="table-dark">
                    <tr>
                        <th>User ID</th>
                        <th>Profile</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Date Joined</th>
                        <th>Type</th>
                        <th>Status</th>
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
                                    className="rounded-circle"
                                />
                            </td>
                            <td>{user.email}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{new Date(user.dateJoined).toLocaleString()}</td>
                            <td>{user.type}</td>
                            <td>
                                    <span className={`badge ${user.banned ? 'bg-danger' : 'bg-success'}`}>
                                        {user.banned ? 'Banned' : 'Active'}
                                    </span>
                            </td>
                            <td>
                                <div className="d-flex flex-column gap-1">
                                    <button
                                        className="admin-btn"
                                        onClick={() => handleBan(user.userId)}
                                        disabled={user.type !== 'USER' || user.banned}
                                    >
                                        Ban
                                    </button>
                                    <button
                                        className="admin-btn"
                                        onClick={() => handleActivate(user.userId)}
                                        disabled={user.type !== 'USER' || !user.banned}
                                    >
                                        Activate
                                    </button>
                                    <button
                                        className="admin-btn"
                                        onClick={() => handlePromote(user.userId)}
                                        disabled={user.type !== 'USER'}
                                    >
                                        Promote to Admin
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-muted">No users found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;