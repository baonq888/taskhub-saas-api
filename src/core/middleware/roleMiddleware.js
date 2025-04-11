const roleMiddleware = (requiredRoles, scopes = ["tenant"]) => {
  return async (req, res, next) => {
    try {
      const { tenantRoles, projectRoles } = req.user;
      const tenantId = req.params.tenantId;
      const projectId = req.params.projectId;

      const userTenantRole = tenantId && tenantRoles ? tenantRoles[tenantId] : null;
      const userProjectRole = projectId && projectRoles ? projectRoles[projectId] : null;

      const roleCheckResults = [];

      if (scopes.includes("tenant")) {
        roleCheckResults.push(requiredRoles.includes(userTenantRole));
      }

      if (scopes.includes("project")) {
        roleCheckResults.push(requiredRoles.includes(userProjectRole));
      }

      if (roleCheckResults.some(Boolean)) {
        return next();
      }

      return res.status(403).json({ error: "Access denied. Insufficient role." });

    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

export default roleMiddleware;