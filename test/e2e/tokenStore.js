const tokenStore = {};

export function setToken(email, token) {
    tokenStore[email] = token;
}

export function getToken(email) {
    return tokenStore[email];
}

export function getAllTokens() {
    return tokenStore;
}

export function clearTokens() {
    for (const key in tokenStore) {
        delete tokenStore[key];
    }
}

export { tokenStore };