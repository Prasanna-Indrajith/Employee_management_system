import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// --- Route Imports ---
import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employee.routes";
import lookupRoutes from "./routes/lookup.routes";
import leaveRoutes from "./routes/leave.routes";
import payrollRoutes from "./routes/payroll.routes";
import dashboardRoutes from "./routes/dashboard.routes";

// --- Middleware Imports ---
import { authenticateToken, isAdmin } from "./middlewares/auth.middleware";

// --- Optional/Future Imports (Commented out until files exist) ---
// import { createAuditTables } from "./migrations/create-audit-tables";
// import { auditCleanupJob } from "./jobs/audit-cleanup.job";
// import { errorAuditMiddleware } from "./middlewares/error-audit.middleware";
import './jobs/auth-log-cleanup.job'; // Run auth log cleanup job

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// --- TEMPORARY LOGGER (Prevents crashes until you create a real logger) ---
const systemLogger = {
  info: (msg: string, meta?: any) => console.log(`[INFO] ${msg}`, meta || ""),
  error: (msg: string, meta?: any, stack?: any) =>
    console.error(`[ERROR] ${msg}`, meta || "", stack || ""),
};

// --- CONFIGURATION ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/lookups", lookupRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Admin Test Route
app.use(
  "/api/admin",
  authenticateToken,
  isAdmin,
  (req: Request, res: Response) => {
    res.json({ message: "Admin access verified" });
  }
);

// --- AUDIT SYSTEM INIT (Placeholder) ---
// async function initializeAuditSystem() {
//   try {
//     await createAuditTables();
//     systemLogger.info('Audit system initialized');
//   } catch (error) {
//     systemLogger.error('Audit init failed', error);
//   }
// }
// initializeAuditSystem();

// --- ERROR HANDLING ---

// 1. Audit Middleware (Commented out until file exists)
// app.use(errorAuditMiddleware);

// 2. Global Fallback Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  systemLogger.error("Unhandled error", {
    message: err.message,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// --- SERVER START ---
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  systemLogger.info("EMS Backend Server Started", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
});

export default app;
