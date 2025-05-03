import React, { useState } from 'react';
import {createAsyncThunk} from "@reduxjs/toolkit";

const UserManagement = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await res.json();
        setUsers(data);
    }

    return (
        <div className="page-shift">
            <h2>Manage Users</h2>
            <button onClick={fetchUsers}>Fetch Users</button>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
};

export default UserManagement;