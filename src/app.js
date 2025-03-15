import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
require("dotenv").config();

const app = express();

app.use(cors()); 
app.use(helmet()); 
app.use(morgan("dev")); 
app.use(json()); 
app.use(urlencoded({ extended: true })); 


app.get("/", (req, res) => {
  res.json({ message: "Taskly API is running!" });
});

export default app;