const roleMiddleware = (requiredRoles, type = "tenant") => {
  return async (req, res, next) => {
    try {
      const {  tenantRoles, projectRoles } = req.user;

      let userRole = null;

      if (type === "tenant") {
        const tenantId = req.params.tenantId;
        userRole = tenantRoles ? tenantRoles[tenantId] : null;

        if (!userRole) return res.status(403).json({ error: "Access denied. Not a tenant member." });
      } else if (type === "project") {
        const projectId = req.params.projectId;
        userRole = projectRoles ? projectRoles[projectId] : null;
        if (!userRole) return res.status(403).json({ error: "Access denied. Not a project member." });
      }

      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ error: "Access denied. Insufficient role." });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

export default roleMiddleware;