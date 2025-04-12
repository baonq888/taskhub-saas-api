import authMiddlewareSocket from "../../core/middleware/authMiddlewareSocket.js";
import Redis from "ioredis";

const redis = new Redis();
const onlineUsersKey = (projectId) => `onlineUsers:${projectId}`;

function setupOnlineStatus(io) {
    const presenceNamespace = io.of("/presence");

    presenceNamespace.use(authMiddlewareSocket);

    presenceNamespace.on("connection", (socket) => {
        const userId = socket.user.id;
        let projectId;

        socket.on("join_project", async ({ projectId: projId }) => {
            projectId = projId;

            try {
                await socket.join(projectId); // Wait for joining
                await redis.sadd(onlineUsersKey(projectId), userId);
                const users = await redis.smembers(onlineUsersKey(projectId));

                presenceNamespace.to(projectId).emit("user_online", users);
            } catch (err) {
                console.error("Error in join_project:", err.message);
            }
        });

        socket.on("disconnect", async () => {
            try {
                if (!projectId) return;

                await redis.srem(onlineUsersKey(projectId), userId);
                const users = await redis.smembers(onlineUsersKey(projectId));

                presenceNamespace.to(projectId).emit("user_online", users);
            } catch (err) {
                console.error("Error on disconnect:", err.message);
            }
        });
    });

    console.log("Online Status Gateway initialized!");
}

export default setupOnlineStatus;