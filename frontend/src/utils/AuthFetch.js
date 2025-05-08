export const authFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem("token");

    const defaultHeaders = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const config = {
        ...options,
        headers: defaultHeaders,
    };

    return fetch(url, config);
};