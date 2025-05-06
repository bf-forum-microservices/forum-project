// auth.js
export function isAuthenticated() {
    return !!localStorage.getItem('token'); // or use cookies if that's how you store the JWT
}
