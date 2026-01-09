import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_change_this";

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // 1. Get the token from the header (Format: "Bearer <token>")
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Get the part after "Bearer"

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Access Denied: No Token Provided" });
//   }

//   // 2. Verify Token
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Invalid or Expired Token" });
//     }

//     // 3. Attach user info to request (so Controllers can use it)
//     req.user = user;
//     next(); // Pass control to the next handler (the Controller)
//   });
// };

// // Optional: Admin Only Middleware
// export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
//   const user = req.user as any;
//   if (user && user.role === "admin") {
//     next();
//   } else {
//     res
//       .status(403)
//       .json({ success: false, message: "Access Denied: Admins Only" });
//   }
// };

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or Expired Token" });
    }

    // --- THE FIX: Cast req to 'any' to bypass the error ---
    (req as any).user = user;

    next();
  });
};

// Also update the isAdmin middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Cast here as well
  const user = (req as any).user;

  if (user && user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access Denied: Admins Only" });
  }
};
