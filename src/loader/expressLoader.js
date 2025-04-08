import { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export default function expressLoader(app) {
    app.use(cors());
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: true }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { error: "Too many requests, try again later." },
        headers: true,
    });

    app.use(limiter);
}