import db from "../lib/db";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { RegisterInput, LoginInput } from "../schemas/auth";
import { ConflictError, UnauthorizedError } from "../lib/errors";

export class AuthService {
  static async registerUser(data: RegisterInput) {
    const existingUser = await db("users").where({ email: data.email }).first();
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    const [user] = await db("users")
      .insert({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning(["id", "name", "email", "created_at"]);

    const token = generateToken({ user_id: user.id, email: user.email });

    return { user, token };
  }

  static async loginUser(data: LoginInput) {
    const user = await db("users").where({ email: data.email }).first();
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = generateToken({ user_id: user.id, email: user.email });

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
