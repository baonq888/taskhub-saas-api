import authMiddlewareSocket from "../../core/middleware/authMiddlewareSocket.js";

const onlineUsersByProject = {}; // { projectId: Set(userId) }

function setupOnlineStatus(io) {
    const presenceNamespace = io.of("/presence");

    presenceNamespace.use(authMiddlewareSocket);

    presenceNamespace.on("connection", (socket) => {
        const userId = socket.user.id;
        let projectId;

        socket.on("join_project", ({ projectId: projId }) => {
            projectId = projId;
            socket.join(projectId);

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

    console.log("Online Status Gateway initialized!");
}

export default setupOnlineStatus;