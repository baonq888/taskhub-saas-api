import pkg from "jsonwebtoken";
import prisma from "../db/index.js";
import redis from "../redis/redisClient.js";

const { verify } = pkg;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    // Check if user roles are cached
    const cacheKey = `user_roles:${decoded.id}`;
    let userRoles = await redis.get(cacheKey);

    if (!userRoles || !userRoles.tenantRoles || !userRoles.projectRoles) {
      // Fetch roles from database
      const tenantRoles = await prisma.tenantUser.findMany({
        where: { userId: decoded.id },
        select: { tenantId: true, role: true },
      });

      const projectRoles = await prisma.projectUser.findMany({
        where: { userId: decoded.id },
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

    req.user.tenantRoles = userRoles.tenantRoles;
    req.user.projectRoles = userRoles.projectRoles;

    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

export default authMiddleware;