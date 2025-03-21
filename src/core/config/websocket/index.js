import setupOnlineStatus from "../../../modules/online-status/onlineStatusGateway.js";
import setupChat from "../../../modules/chat/chatGateway.js";

function loadWebSockets(io) {
    setupOnlineStatus(io);
    setupChat(io);
}

export default loadWebSockets;