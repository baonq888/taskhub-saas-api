import { Server } from "socket.io";
import authMiddlewareSocket from "./core/middleware/authMiddlewareSocket.js";

const onlineUsersByProject = {}; // { projectId: Set(userId) }
const projectChats = {}; // { projectId: [{ userId, message, timestamp }] }

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    const presenceNamespace = io.of("/presence");
    const chatNamespace = io.of("/chat");

    presenceNamespace.use(authMiddlewareSocket);
    chatNamespace.use(authMiddlewareSocket);

    presenceNamespace.on("connection", (socket) => {
        const userId = socket.user.id;
        let projectId;

        socket.on("join_project", ({ projectId: projId }) => {
            projectId = projId;
            socket.join(projectId);

            // Add user_id to project dictionary of projectId: [..user_ids]
            if (!onlineUsersByProject[projectId]) {
                onlineUsersByProject[projectId] = new Set();
            }
            onlineUsersByProject[projectId].add(userId);

            presenceNamespace.to(projectId).emit("user_online", Array.from(onlineUsersByProject[projectId]));
        });

        socket.on("disconnect", () => {
            if (projectId) {
                onlineUsersByProject[projectId]?.delete(userId);
                presenceNamespace.to(projectId).emit("user_online", Array.from(onlineUsersByProject[projectId]));
            }
        });
    });

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

    console.log("Socket.IO server started with namespaces!");
}

export default setupSocket;