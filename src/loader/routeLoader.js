import authRoutes from "../modules/auth/authRoutes.js";
import userRoutes from "../modules/user/userRoutes.js";
import tenantRoutes from "../modules/tenants/tenantRoutes.js";
import projectRoutes from "../modules/tasks/projects/projectRoutes.js";
import boardRoutes from "../modules/tasks/boards/boardRoutes.js";
import taskRoutes from "../modules/tasks/tasks/taskRoutes.js";
import chatRoutes from "../modules/chat/chatRoutes.js";
import commentRoute from "../modules/comments/commentRoute.js";

const API_VERSION = "/api/v1";

export default function routeLoader(app) {
    app.use(`${API_VERSION}/auth`, authRoutes);
    app.use(`${API_VERSION}/users`, userRoutes);
    app.use(`${API_VERSION}/tenants`, tenantRoutes);
    app.use(`${API_VERSION}/tenants/:tenantId/projects`, projectRoutes);
    app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/boards`, boardRoutes);
    app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/boards/:boardId/tasks`, taskRoutes);
    app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/boards/:boardId/tasks/:taskId/comments`, commentRoute());
    app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/chat`, chatRoutes);
}