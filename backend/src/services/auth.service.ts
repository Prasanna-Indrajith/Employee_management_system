import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { LoginCredentials } from "../types";

export class AuthService {
  private userRepository: UserRepository;
  private readonly JWT_SECRET =
    process.env.JWT_SECRET || "super_secret_key_change_this";

  constructor() {
    this.userRepository = new UserRepository();
  }

  // REGISTER Logic
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role: "admin" | "user";
    employeeId?: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new Error("Email already registered");

    // 1. Hash the password (Salt = 10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 2. Save to DB
  return await this.userRepository.create(
      data.email,
      hashedPassword,
      data.fullName,
      data.role
    );
  }

  // LOGIN Logic
  async login(credentials: LoginCredentials) {
    // 1. Find User
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) throw new Error("Invalid email or password");

    // 2. Compare Password
    const isMatch = await bcrypt.compare(
      credentials.password,
      user.password_hash
    );
    if (!isMatch) throw new Error("Invalid email or password");

    // 3. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      this.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return User info (excluding hash) and Token
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  // LOGOUT Logic (Stateless)
  async logout(userId: string | undefined) {
    // In a stateless JWT system, the backend doesn't technically "logout" 
    // unless using a token blacklist (Redis/DB).
    // For now, we just acknowledge the request.
    return true;
  }
}
