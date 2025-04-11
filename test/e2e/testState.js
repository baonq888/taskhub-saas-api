const testState = {
    tenants: {},
    users: {},
    userDetails: {},
    projects: {},
    boards: {},
    tasks: {},
    refreshTokens: {},
    notifications: {},
    chatRooms: {},
    chatParticipants: {},
    messages: {},
};

export function setEntity(entityType, key, value) {
    if (!testState[entityType]) {
        testState[entityType] = {};
    }
    testState[entityType][key] = value;
}

export function getEntity(entityType, key) {
    return testState[entityType]?.[key];
}

export function getEntityId(entityType, key) {
    return testState[entityType]?.[key]?.id ?? null;
}


export { testState };