// auth.js
export function isAuthenticated() {
    return !!localStorage.getItem('jwtToken'); // or use cookies if that's how you store the JWT
}
