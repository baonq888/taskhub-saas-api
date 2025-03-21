import authMiddlewareSocket from "../../core/middleware/authMiddlewareSocket.js";

const projectChats = {}; // structure: { projectId: [{ userId, message, timestamp }] }

function setupChat(io) {
    const chatNamespace = io.of("/chat");

    chatNamespace.use(authMiddlewareSocket);

    chatNamespace.on("connection", (socket) => {
        const userId = socket.user.id;
        let projectId;

        socket.on("join_project", ({ projectId: projId }) => {
            projectId = projId;
            socket.join(projectId);

            if (!projectChats[projectId]) {
                projectChats[projectId] = [];
            }
            chatNamespace.to(projectId).emit("chat_history", projectChats[projectId]);
        });

        socket.on("send_message", ({ message }) => {
            if (!projectId) return;

            const chatMessage = { userId, message, timestamp: new Date() };
            projectChats[projectId].push(chatMessage);

            chatNamespace.to(projectId).emit("receive_message", chatMessage);
        });

        socket.on("disconnect", () => {
            if (projectId) {
                socket.leave(projectId);
            }
        });
    });

    console.log("Chat Gateway initialized!");
}

export default setupChat;