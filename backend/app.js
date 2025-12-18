import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import shiftRoutes from "./routes/shift.routes.js";
import swapRoutes from "./routes/swap.routes.js";
import taskRoutes from "./routes/task.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { apiRateLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Error handler (last)
app.use(errorHandler);

export default app;
