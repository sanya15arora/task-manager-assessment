import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/authRoutes";
import taskRoutes from "./modules/tasks/taskRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { ENV } from "./config/env";

const app = express();

app.use(
    cors({
        origin: ENV.FRONTEND_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// auth
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// fallback error handler
app.use(errorHandler);

export default app;
