// auth.js

import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    return !!sessionStorage.getItem('token'); // or use cookies if that's how you store the JWT
}

export function isAdmin() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.role === 'ADMIN' ||'UPSER_ADMIN' ;
    } catch (error) {
        console.error("Invalid token: ", error.message);
        return false;
    }

}
