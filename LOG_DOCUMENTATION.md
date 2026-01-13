# System Logging Documentation

## Overview
The Employee Management System (EMS) utilizes a dual-layer logging strategy to ensure system observability while maintaining performance.

1.  **Authentication Logging (Winston)**: Specialized structured logging for security-critical events (Login, Register, Logout).
2.  **System Logging (Console/Temporary)**: Lightweight logging for general application events and unhandled errors.

---

## 1. Authentication Logging (`src/config/auth-logger.ts`)

Powered by **Winston**, this logger tracks all user authentication attempts. It writes to local files with automatic rotation and retention policies.

### **Configuration**
-   **Library**: `winston`
-   **Format**: JSON (Structured)
-   **Timestamp**: Yes (ISO 8601)
-   **Service Label**: `user-authentication`

### **File Locations**
All logs are stored in the `backend/logs/` directory.

| Log File | Level | Description |
| :--- | :--- | :--- |
| `logs/auth-activity.log` | `INFO` | Successful login, registration, and logout events. |
| `logs/auth-errors.log` | `ERROR` | Failed login attempts, system errors during auth. |

### **Retention Policy**
-   **Max File Size**: 10MB
-   **Max Files**: 7 files (Rolling history)
-   **Cleanup Job**: Daily cleanup task removes files older than 7 days.

### **Log Structure Example**
```json
{
  "level": "info",
  "message": "User login successful",
  "userId": "123-456-789",
  "email": "user@example.com",
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2026-01-13T10:00:00.000Z",
  "loginMethod": "standard",
  "service": "user-authentication"
}
```

---

## 2. System Logging (`src/app.ts`)

A lightweight wrapper around `console.log` and `console.error` is used for general application events to minimize overhead.

### **Usage**
-   **Startup**: Logs server port and environment on startup.
-   **Errors**: Captures unhandled exceptions via the Global Error Handler.

### **Global Error Handler**
Catches any errors that bubble up from controllers and logs them with context.

```typescript
app.use((err, req, res, next) => {
  systemLogger.error("Unhandled error", {
    message: err.message,
    url: req.originalUrl,
    method: req.method,
  });
  // ... sends 500 response
});
```

---

## 3. Maintenance & Cleanup

### **Automated Cleanup**
A scheduled job (`src/jobs/auth-log-cleanup.job.ts`) runs daily at midnight to enforce the retention policy.

-   **Schedule**: `0 0 * * *` (Daily at Midnight)
-   **Target**: `backend/logs/*.log`
-   **Action**: Deletes files older than 7 days.

### **Manual cleanup**
You can manually clear logs by deleting the contents of the `backend/logs/` directory. The system will recreate the files on the next write operation.
