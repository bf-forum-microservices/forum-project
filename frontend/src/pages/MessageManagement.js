import React, { useEffect, useState } from 'react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/admin/messages/all') //
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error('Failed to load messages:', err));
    }, []);

    const markAsProcessed = async (id) => {
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/admin/messages/${id}/status?status=processed`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update status');
            }

            // Update state if the request succeeded
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === id ? { ...msg, status: 'PROCESSED' } : msg
                )
            );
        } catch (err) {
            const errorMessage = `Error processing message ${id}: ${err.message}`;
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const markAsResolved = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/messages/${id}/status?status=resolved`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update status');
            }

            // Update state if the request succeeded
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.messageId === id ? { ...msg, status: 'RESOLVED' } : msg
                )
            );
        } catch (err) {
            const errorMessage = `Error processing message ${id}: ${err.message}`;
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    return (
        <div className="admin-messages">
            <h2>User Messages</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                <tr>
                    <th>Message ID</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((msg) => (
                    <tr key={msg.messageId}>
                        <td>{msg.messageId}</td>
                        <td>{new Date(msg.dateCreated).toLocaleString()}</td>
                        <td>{msg.subject}</td>
                        <td>{msg.email}</td>
                        <td>{msg.content}</td>
                        <td>{msg.status}</td>
                        <td>
                            <button onClick={() => markAsProcessed(msg.messageId, msg.status)}>
                                Mark as Processed
                            </button>
                            <button onClick={() => markAsResolved(msg.messageId, msg.status)}>
                                Mark as Resolved
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminMessages;



// import React, { useEffect, useState } from 'react';
//
// const MessageManagement = () => {
//     const [messages, setMessages] = useState([
//         {
//             id: 1,
//             from: 'Admin',
//             subject: 'Welcome to the Forum!',
//             body: 'Hi there! Thanks for joining. Let us know if you have any questions.',
//             date: '2025-05-01T09:00:00Z',
//             read: false
//         },
//         {
//             id: 2,
//             from: 'Moderator',
//             subject: 'Your Post Has Been Reviewed',
//             body: 'Please update your post to follow community guidelines.',
//             date: '2025-05-02T14:30:00Z',
//             read: true
//         },
//         {
//             id: 3,
//             from: 'Admin',
//             subject: 'Maintenance Notice',
//             body: 'The forum will be undergoing maintenance on May 10 from 1am to 3am.',
//             date: '2025-05-04T12:45:00Z',
//             read: false
//         }
//     ]);
//
//     const handleMarkAsRead = (id) => {
//         setMessages(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));
//     };
//
//     return (
//         <div className="message-management">
//             <h2>Inbox</h2>
//             <ul>
//                 {messages.map(msg => (
//                     <li key={msg.id} style={{ marginBottom: '16px', backgroundColor: msg.read ? '#f5f5f5' : '#fff' }}>
//                         <strong>{msg.subject}</strong> from {msg.from} - {new Date(msg.date).toLocaleString()}<br />
//                         <p>{msg.body}</p>
//                         {!msg.read && (
//                             <button onClick={() => handleMarkAsRead(msg.id)}>Mark as Read</button>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
//
// export default MessageManagement;
