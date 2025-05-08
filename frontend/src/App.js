import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { isAuthenticated } from "./auth";
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import UserProfile from './pages/UserProfile';
import ContactAdmin from './pages/ContactAdmin';
import PostDetail from './pages/PostDetail';
import MessageManagement from './pages/MessageManagement';
import Message from './pages/Message';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';
import EmailVerification from './pages/TokenValidation';
import PrivateRoute from './PrivateRoute'; //
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';

const App = () => {

    const NotFoundRedirect = () => {
        return isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar/>
            <main className="py-10">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/contactus" element={<ContactAdmin/>}/>

                    {/* Protected Routes */}
                    <Route path="/" element={<PrivateRoute><UserHome/></PrivateRoute>}/>
                    <Route path="/home" element={<PrivateRoute><UserHome/></PrivateRoute>}/>
                    <Route path="/profile" element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
                    <Route path="/create-post" element={<PrivateRoute><CreatePost/></PrivateRoute>}/>
                    <Route path="/posts/:id" element={<PrivateRoute><PostDetail/></PrivateRoute>}/>
                    <Route path="/myposts" element={<MyPosts />} />
                    <Route path="/messages"
                           element={<PrivateRoute requireAdmin={true}><MessageManagement/></PrivateRoute>}/>
                    <Route path="/message/:id"
                           element={<PrivateRoute requireAdmin={true}><Message/></PrivateRoute>}/>
                    <Route path="/users"
                           element={<PrivateRoute requireAdmin={true}><UserManagement/></PrivateRoute>}/>
                    <Route path="/tokenValidation" element={<PrivateRoute><EmailVerification/></PrivateRoute>}/>


                    {/* Catch All Route*/}
                    <Route path="/*" element={<NotFoundRedirect />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
