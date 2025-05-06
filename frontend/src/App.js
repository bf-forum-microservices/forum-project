import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import UserProfile from './pages/UserProfile';
import ContactAdmin from './pages/ContactAdmin';
import PostDetail from './pages/PostDetail';
import AdminHome from './pages/AdminHome';
import MessageManagement from './pages/MessageManagement';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';
import EmailVerification from "./pages/TokenValidation";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="py-10">
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tokenValidation" element={<EmailVerification />} />

          {/* User Pages */}
          <Route path="/" element={<UserHome />} /> {/* need to change to /home later once we have authorization */}
          <Route path="/home" element={<UserHome />} /> {/* need to change to /home later once we have authorization */}
          <Route path="/profile" element={<UserProfile />} />

          {/* Contact */}
          <Route path="/contactus" element={<ContactAdmin />} />

          {/* Admin Pages */}
          <Route path="/admin/home" element={<AdminHome />} /> {/* need to change to /home later once we have authorization */}
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/messages" element={<MessageManagement />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
