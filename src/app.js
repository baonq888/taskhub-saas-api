import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/core/swagger/swagger.js';

import authRoutes from "./modules/auth/authRoutes.js";
import userRoutes from "./modules/user/userRoutes.js";
import tenantRoutes from "./modules/tenants/tenantRoutes.js";
import projectRoutes from "./modules/tasks/projects/projectRoutes.js";
import boardRoutes from "./modules/tasks/boards/boardRoutes.js";
import taskRoutes from "./modules/tasks/tasks/taskRoutes.js";
import chatRoutes from "./modules/chat/chatRoutes.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// Load the certificate and private key


// Rate Limiter - Apply to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window per IP
  message: { error: "Too many requests, please try again later." },
  headers: true, // Send rate limit headers in response
});

app.use(cors()); 
app.use(limiter);
app.use(helmet()); 
app.use(json()); 
app.use(urlencoded({ extended: true })); 

const API_VERSION = "/api";
// Swagger UI route
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        url: 'https://localhost:3000/api-docs',
        filter: true,
        displayRequestDuration: true
      }
    })
);

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/tenants`, tenantRoutes);
app.use(`${API_VERSION}/tenants/:tenantId/projects`, projectRoutes);
app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/boards`, boardRoutes);
app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/boards/:boardId/tasks`, taskRoutes);
app.use(`${API_VERSION}/tenants/:tenantId/projects/:projectId/chat`, chatRoutes);

app.get('/', (req, res) => {
  res.send('Hello, this is HTTPS!');
});



export default app;