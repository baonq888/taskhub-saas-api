import express from "express";
import initLoaders from "./loader/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

await initLoaders(app);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;