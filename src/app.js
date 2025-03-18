import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/authRoutes.js";
import userRoutes from "./modules/user/userRoutes.js";
import tenantRoutes from "./modules/tenants/tenantRoutes.js";
import projectRoutes from "./modules/tasks/projects/projectRoutes.js";
import boardRoutes from "./modules/tasks/boards/boardRoutes.js";
import taskRoutes from "./modules/tasks/tasks/taskRoutes.js";


import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors()); 
app.use(helmet()); 
app.use(json()); 
app.use(urlencoded({ extended: true })); 

const API_VERSION = "/api/v1";

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/tenants`, tenantRoutes);
app.use(`${API_VERSION}/projects`, projectRoutes);
app.use(`${API_VERSION}/boards`, boardRoutes);
app.use(`${API_VERSION}/tasks`, taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Taskly API is running!" });
});

export default app;