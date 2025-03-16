import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/authRoutes";
import userRoutes from "./modules/user/userRoutes";


require("dotenv").config();

const app = express();

app.use(cors()); 
app.use(helmet()); 
app.use(json()); 
app.use(urlencoded({ extended: true })); 

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Taskly API is running!" });
});

export default app;