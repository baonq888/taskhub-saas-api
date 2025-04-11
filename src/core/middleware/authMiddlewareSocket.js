import pkg from "jsonwebtoken";
import redis from "../redis/redisClient.js";
import prisma from "../db/index.js";

const { verify } = pkg;

async function authMiddlewareSocket(socket, next) {
  try {
    // Read token from socket handshake auth
    const rawToken = socket.handshake.auth?.token;
    const token = rawToken?.replace(/^Bearer\s/, "");

    if (!token) {
      return next(new Error("Authentication error: No or invalid token"));
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Check if user roles are cached in Redis
    const cacheKey = `user_roles:${userId}`;
    let userRoles = await redis.get(cacheKey);

    if (!userRoles) {
      // Fetch roles from database
      const tenantRoles = await prisma.tenantUser.findMany({
        where: { userId },
        select: { tenantId: true, role: true },
      });

      const projectRoles = await prisma.projectUser.findMany({
        where: { userId },
        select: { projectId: true, role: true },
      });

      userRoles = {
        tenantRoles: Object.fromEntries(tenantRoles.map((t) => [t.tenantId, t.role])),
        projectRoles: Object.fromEntries(projectRoles.map((p) => [p.projectId, p.role])),
      };

      // Cache roles in Redis for 1 hour
      await redis.set(cacheKey, JSON.stringify(userRoles), "EX", 3600);
    } else {
      userRoles = JSON.parse(userRoles);
    }

    // Attach user data to the socket
    socket.user = {
      id: userId,
      role: decoded.role, // General role from JWT
      tenantRoles: userRoles.tenantRoles,
      projectRoles: userRoles.projectRoles,
    };

    next();
  } catch (error) {
    next(new Error("Authentication failed: " + error.message));
  }
}

export default authMiddlewareSocket;