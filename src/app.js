import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/authRoutes.js";
import userRoutes from "./modules/user/userRoutes.js";
import tenantRoutes from "./modules/tenants/tenantRoutes.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors()); 
app.use(helmet()); 
app.use(json()); 
app.use(urlencoded({ extended: true })); 

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tenant", tenantRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Taskly API is running!" });
});

export default app;