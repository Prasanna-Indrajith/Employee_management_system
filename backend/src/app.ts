// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employee.routes";
import authRoutes from "./routes/auth.routes";
import lookupRoutes from "./routes/lookup.routes";
// import adminResetRoutes from "./routes/admin-reset.ts__";
import attendanceRoutes from "./routes/attendance.routes";
import leaveRoutes from "./routes/leave.routes";
import payrollRoutes from "./routes/payroll.routes";
import dashboardRoutes from "./routes/dashboard.routes";
// import { setupCronJobs } from "./utils/cron-jobs";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize cron job
// setupCronJobs();

// Routes
// app.use("/api/admin-reset", adminResetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/lookups", lookupRoutes);
// app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global Error Handler (Optional but recommended)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
