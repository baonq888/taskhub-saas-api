import {ACTION_PAYLOAD_CONFIG} from "../../../core/config/automation/automationConstants.js";

export function validateActionPayload(action, payload) {
    const config = ACTION_PAYLOAD_CONFIG[action];
    if (!config) return false;

    for (const field of config.requiredFields) {
        if (!(field in payload)) {
            throw new Error(`Missing required field '${field}' in payload for action '${action}'`);
        }
    }

    return true;
}