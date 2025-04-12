export const API_VERSION = '/api/v1';

export let CHAT_PORT = 5003;
export let CHAT_URL = `http://localhost:${CHAT_PORT}/chat`;

export let PRESENCE_PORT = 5002;
export let PRESENCE_URL = `http://localhost:${PRESENCE_PORT}/presence`;

export function setChatPort(port) {
    CHAT_PORT = port;
    CHAT_URL = `http://localhost:${CHAT_PORT}/chat`;
}

export function setPresencePort(port) {
    PRESENCE_PORT = port;
    PRESENCE_URL = `http://localhost:${PRESENCE_PORT}/presence`;
}