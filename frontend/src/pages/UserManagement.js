import React, { useState } from 'react';
import {createAsyncThunk} from "@reduxjs/toolkit";

const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        // const res = await fetch('http://localhost:8080/auth/users');
        const res = await fetch('http://localhost:8081/auth');
        const data = await res.text();
        //setUsers(data);
        setMessage(data);
    }

    return (
        <div className="page-shift">
            <h2>Manage Users</h2>
            <button onClick={fetchUsers}>Fetch Users</button>
            <p>{message}</p>
            {/*<ul>*/}
            {/*    {users.map(user => (*/}
            {/*        <li key={user.id}>{user.name}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    )
};

export default UserManagement;