import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";

// Validation Schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  fullName: z.string().min(2),
  role: z.enum(["admin", "user"]),
  employeeId: z.string().uuid().optional(), // Optional link to employee table
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await this.authService.register(validatedData);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues,
        });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      // For security, standard login errors return 401
      res.status(401).json({ success: false, message: error.message });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      // req.user is attached by the middleware (contains {id, email, role})
      // In a real app, you might want to fetch fresh data from DB here:
      // const user = await this.authService.getUserById((req as any).user.id);

      const user = (req as any).user;
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
}
