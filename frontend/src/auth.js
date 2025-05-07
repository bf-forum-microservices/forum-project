// auth.js

import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    return !!sessionStorage.getItem('token'); // or use cookies if that's how you store the JWT
}

export function isAdmin() {
    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    return decodedToken.role === 'ADMIN';
}
